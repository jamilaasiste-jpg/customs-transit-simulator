import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import PyPDF2
from openai import OpenAI

app = FastAPI(title="Customs Transit Simulator - Core API Engine")

# Configurar CORS para comunicación con React 19
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar cliente OpenAI (Asegurar variable OPENAI_API_KEY en entorno)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "tu-api-key-aqui"))

# --- MODELOS DE DATOS ---
class InspectionRequest(BaseModel):
    invoice_data: dict
    packing_list_data: dict
    bl_data: dict

# --- 1. ENDPOINT: PROCESAMIENTO Y PARSEO DE PDF REAL (OCR TO MISSION) ---
@app.post("/api/v1/documents/parse-pdf")
async def parse_pdf_document(file: UploadFile = File(...), document_type: str = Form(...)):
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() or ""
        
        # Invocación a LLM para estructurar los datos del PDF con auditoría ADII
        prompt = f"""
        Eres el motor experto en comercio exterior y cumplimiento aduanero de "Customs Transit Simulator", especializado en la normativa de la ADII (Administration des Douanes et Impôts Indirects de Marruecos). 

        Tu función principal es analizar documentos de importación/exportación ({document_type}) para auditar la coherencia documental y clasificar mercancías a nivel de subpartida nacional HS-10 (10 dígitos).

        Texto extraído:
        {extracted_text[:3500]}

        Responde SIEMPRE con este esquema JSON exacto:
        {{
          "analisis_documental": {{
            "expediente_coherente": true,
            "discrepancias": [
              "Lista detallada de cualquier incoherencia de pesos, importes o descripciones entre documentos"
            ],
            "datos_extraidos": {{
              "proveedor": "",
              "cliente_importador": "",
              "incoterm": "",
              "valor_total": "",
              "moneda": ""
            }}
          }},
          "clasificacion_hs10": [
            {{
              "item": "Nombre de la mercancía",
              "codigo_hs10": "XXXX.XX.XX.XX",
              "justificacion_rgi": "Explicación basada en las RGI y Notas Explicativas",
              "derecho_importacion_estimado": "XX%",
              "tva_estimado": "XX%",
              "controles_previos_requeridos": ["MCI", "ONSSA", "Certificado de Conformidad"]
            }}
          ],
          "regimen_aduanero_sugerido": {{
            "codigo_regimen": "010 o 021 (ATPA)",
            "observaciones": "Comentarios clave sobre la liquidación tributaria o suspensiones"
          }}
        }}
        """

        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}]
        )

        parsed_json = json.loads(response.choices[0].message.content)
        return {
            "status": "SUCCESS",
            "document_type": document_type,
            "extracted_data": parsed_json
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analizando documento PDF: {str(e)}")

# Regla de Auditoría de Incoterms - Normativa ADII / GET ACCURACY
def validar_incoterm_y_regimen(incoterm: str, regimen: str, destino_zona_franca: bool):
    incoterms_directos_prohibidos_ter_nac = ["CIF", "CPT", "CIP", "DDP"]
    
    if not destino_zona_franca and incoterm.upper() in incoterms_directos_prohibidos_ter_nac:
        return {
            "alerta_nivel": "CRÍTICO",
            "codigo_error": "INCOTERM_INVALIDO_TERRITORIO_NACIONAL",
            "mensaje": f"El Incoterm {incoterm} no es admisible directamente para despacho a consumo en territorio aduanero nacional.",
            "accion_requerida": "Desglosar la factura en Valor FOB + Flete Marítimo/Aéreo + Seguro para la declaración DUM, o verificar si la operación destina a Zona de Aceleración Industrial (ZAI)."
        }
    return {"alerta_nivel": "OK", "mensaje": "Incoterm coherente con el régimen aduanero."}

# --- 2. ENDPOINT: MOTOR GET ACCURACY (CROSS-CHECK & AUDITORÍA) ---
@app.post("/api/v1/accuracy/audit")
async def audit_operation(payload: InspectionRequest):
    discrepancies = []
    
    # Regla 1: Coherencia de Peso Bruto entre Packing List y BL
    pl_weight = payload.packing_list_data.get("gross_weight_kg", 0)
    bl_weight = payload.bl_data.get("gross_weight_kg", 0)
    
    if abs(pl_weight - bl_weight) > 10:  # Tolerancia máxima 10kg
        discrepancies.append({
            "id": "DISC_WEIGHT_MISMATCH",
            "document": "Bill of Lading vs Packing List",
            "severity": "MEDIUM",
            "message": f"Discrepancia crítica de peso: Packing List indica {pl_weight}kg y el BL registra {bl_weight}kg."
        })

    # Regla 2: Vaguedad Descriptiva en Factura
    items = payload.invoice_data.get("declared_items", [])
    for item in items:
        desc = item.get("description", "").lower()
        if len(desc) < 15 or "hierro" in desc and "usado" in desc and "calidad" not in desc:
            discrepancies.append({
                "id": "DISC_DESCRIPTION_VAGUE",
                "document": "Factura Comercial",
                "severity": "HIGH",
                "message": f"Descripción insuficiente o ambigua ('{desc}'). Falta especificar aleación y composición según norma ADII."
            })

    # Regla 3: Auditoría de Incoterms y Régimen (Normativa ADII)
    declared_incoterm = payload.invoice_data.get("incoterm", "CIF")
    regime = payload.invoice_data.get("regime", "10_IMPORT_CONSOMMATION")
    is_free_zone = payload.invoice_data.get("destino_zona_franca", False)

    incoterm_audit = validar_incoterm_y_regimen(declared_incoterm, regime, is_free_zone)
    if incoterm_audit["alerta_nivel"] == "CRÍTICO":
        discrepancies.append({
            "id": incoterm_audit["codigo_error"],
            "document": "Factura Comercial / DUM Draft",
            "severity": "HIGH",
            "message": incoterm_audit["mensaje"],
            "action_required": incoterm_audit["accion_requerida"]
        })

    status = "VALIDADO"
    if any(d["severity"] == "HIGH" for d in discrepancies):
        status = "DOCUMENTACION_INCOMPLETA"
    elif discrepancies:
        status = "REQUIERE_REVISION"

    return {
        "status": status,
        "discrepancies_found": discrepancies,
        "incoterm_audit": incoterm_audit,
        "recommendation": "Requiere aclaración del proveedor antes de presentar la DUM ante Tanger Med."
    }

# --- 3. ENDPOINT: MOTOR DE VOZ MULTILINGÜE (OPENAI WHISPER STT) ---
@app.post("/api/v1/voice/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = Form("es")):
    try:
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())

        with open(temp_file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language
            )

        os.remove(temp_file_path)
        return {"status": "SUCCESS", "transcript": transcript.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en transcripción Whisper: {str(e)}")

# --- 4. ENDPOINT: CONSULTA ARANCELARIA ADII / ADIL (10 DÍGITOS) ---
ADIL_FALLBACK_DATABASE = {
    "7204490000": {
        "hs10_code": "7204490000",
        "description_fr": "Autres déchets et débris de fonte, fer ou acier (ferraille et tournures)",
        "description_es": "Chatarra y desperdicios de fundición, hierro o acero",
        "ddi_rate": 2.50,
        "tva_rate": 20.00,
        "parafiscale_rate": 0.25,
        "mcinet_control_required": True,
        "onssa_control_required": False,
        "special_requirements": "Certificat de Conformité MCINET + Contrôle physique radiologique obligatoire"
    },
    "8424820000": {
        "hs10_code": "8424820000",
        "description_fr": "Appareils pour l'agriculture ou l'horticulture (goutte-à-goutte, fertirrigation)",
        "description_es": "Sistemas de fertirrigación y riego tecnificado",
        "ddi_rate": 2.50,
        "tva_rate": 20.00,
        "parafiscale_rate": 0.25,
        "mcinet_control_required": True,
        "onssa_control_required": False,
        "special_requirements": "Norme Marocaine NM ISO 9261"
    },
    "8481809000": {
        "hs10_code": "8481809000",
        "description_fr": "Robinetterie industrielle et vannes de régulation haute pression",
        "description_es": "Válvulas y robinetería industrial",
        "ddi_rate": 17.50,
        "tva_rate": 20.00,
        "parafiscale_rate": 0.25,
        "mcinet_control_required": True,
        "onssa_control_required": False,
        "special_requirements": "Certificat MCINET"
    },
    "7208510000": {
        "hs10_code": "7208510000",
        "description_fr": "Produits laminés plats en fer ou aciers non alliés (> 10 mm)",
        "description_es": "Chapas y bobinas laminadas en caliente",
        "ddi_rate": 40.00,
        "tva_rate": 20.00,
        "parafiscale_rate": 0.25,
        "mcinet_control_required": True,
        "onssa_control_required": False,
        "special_requirements": "Droit Antidumping applicable"
    },
    "0702000000": {
        "hs10_code": "0702000000",
        "description_fr": "Tomates fraîches ou réfrigérées",
        "description_es": "Tomates frescos para exportación/importación",
        "ddi_rate": 40.00,
        "tva_rate": 20.00,
        "parafiscale_rate": 0.25,
        "mcinet_control_required": False,
        "onssa_control_required": True,
        "special_requirements": "Certificat Phytosanitaire ONSSA"
    }
}

@app.get("/api/v1/tariffs/{hs10_code}")
async def get_adil_tariff(hs10_code: str):
    clean_code = hs10_code.replace(".", "").replace(" ", "").strip()
    
    # Intento de consulta en base de datos PostgreSQL si existe DATABASE_URL
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            conn = psycopg2.connect(db_url)
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT 
                        hs10_code AS "Código de 10 dígitos (ADIL)",
                        description_fr AS "Désignation ADII",
                        description_es AS "Descripción",
                        ddi_rate AS "Droit d'Importation (DDI %)",
                        tva_rate AS "TVA (%)",
                        parafiscale_rate AS "Taxe Parafiscale (%)",
                        mcinet_control_required AS "Control de Calidad MCINET",
                        onssa_control_required AS "Control Sanitario ONSSA",
                        special_requirements AS "Requisitos Especiales"
                    FROM hs10_tariff_schedule
                    WHERE hs10_code = %s;
                """, (clean_code,))
                result = cur.fetchone()
                conn.close()
                if result:
                    return {"status": "SUCCESS", "source": "POSTGRES_ADII", "data": dict(result)}
        except Exception:
            pass  # Fallback suave a diccionario en memoria
            
    if clean_code in ADIL_FALLBACK_DATABASE:
        item = ADIL_FALLBACK_DATABASE[clean_code]
        return {
            "status": "SUCCESS",
            "source": "CACHE_ADIL",
            "data": {
                "Código de 10 dígitos (ADIL)": item["hs10_code"],
                "Désignation ADII": item["description_fr"],
                "Descripción": item["description_es"],
                "Droit d'Importation (DDI %)": item["ddi_rate"],
                "TVA (%)": item["tva_rate"],
                "Taxe Parafiscale (%)": item["parafiscale_rate"],
                "Control de Calidad MCINET": item["mcinet_control_required"],
                "Control Sanitario ONSSA": item["onssa_control_required"],
                "Requisitos Especiales": item["special_requirements"]
            }
        }
    
    raise HTTPException(status_code=404, detail=f"Partida arancelaria ADII '{hs10_code}' no encontrada en el nomenclátor oficial.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
