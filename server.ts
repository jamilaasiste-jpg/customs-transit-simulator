import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (geminiClient) return geminiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  geminiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return geminiClient;
}

// Resilient Gemini generator with automatic fallback across high-availability models
async function generateGeminiSafe(
  ai: GoogleGenAI,
  contents: any,
  options: {
    systemInstruction?: string;
    responseMimeType?: string;
    temperature?: number;
  } = {}
): Promise<string | null> {
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
  
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
          temperature: options.temperature ?? 0.3,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      // Gracefully switch to next high-availability model without fatal unhandled alerts
      const code = err?.status || err?.code || 'unknown';
      if (process.env.NODE_ENV !== "production") {
        console.info(`[AI Router] Model ${model} returned status ${code}, seamlessly routing to next available engine...`);
      }
    }
  }
  return null;
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    appName: "Customs Transit Simulator (Enterprise Edition)",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// 2. OCR / Document Analysis API (YAFFA Trade Flow Engine - Real Gemini Multimodal)
app.post("/api/analyze-document", async (req, res) => {
  try {
    const { documentText, imageBase64, mimeType = "application/pdf", fileName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: "Servicio de IA Gemini no disponible. Verifique la clave de API.",
      });
    }

    if (!documentText && !imageBase64) {
      return res.status(400).json({
        success: false,
        error: "Se requiere un archivo PDF/imagen adjunto o texto para analizar.",
      });
    }

    const systemInstruction = `Eres el motor experto de análisis documental y auditor aduanero de la ADII (Administration des Douanes et Impôts Indirects de Marruecos) en "YAFFA Trade Flow".
Tu función es extraer rigurosa y fielmente la información REAL del documento comercial (factura, packing list, BL) adjunto en el PDF o imagen y aplicar las directrices del Código de Aduanas de Marruecos.

REGLAS ESTRICTAS:
1. Extrae EXCLUSIVAMENTE datos reales, números, cantidades, códigos, precios y empresas que aparezcan explícitamente en el documento subido. Si un dato no figura, déjalo vacío ("") o null. NUNCA utilices datos de plantilla o empresas de ejemplo si no están en el documento.
2. Identifica el Incoterm (CIF, FOB, CFR, EXW, CPT, CIP, DDP, DAP), Moneda, Número de Factura, Fecha, Proveedor y Cliente Importador (con ICE e IF si figuran).
3. Regla de Incoterms ADII Marruecos:
   - Si el Incoterm es CIF, CPT, CIP o DDP y se destina a despacho a consumo en Territorio Nacional (Régimen 10), marca una ALERTA CRÍTICA exigiendo el desglose de la factura en FOB + Flete Marítimo/Aéreo + Seguro para la DUM.
   - Si se destina a Zona Franca (ZAI / Tanger Med Free Zone) o Régimen 021 (ATPA), márcalo como admisible.
4. Identifica las líneas de producto y clasifica cada ítem con una subpartida arancelaria HS-10 (10 dígitos del Tarif ADIL marroquí, ej. "8708.91.90.00"), con su justificación RGI 1 y 6, tipo de Derecho de Importación (DDI: ej. 0.025, 0.175, 0.40), TVA (0.20) y controles técnicos requeridos (MCINET, Conformité NM, ONSSA).
5. Extrae datos de transporte y pesos si están presentes (pesos bruto y neto en kg, número de bultos, contenedor, precinto).

Devuelve SIEMPRE tu respuesta en formato JSON estrictamente válido con este esquema:
{
  "analisis_documental": {
    "expediente_coherente": boolean,
    "discrepancias": string[],
    "datos_extraidos": {
      "proveedor": string,
      "cliente_importador": string,
      "incoterm": string,
      "valor_total": string,
      "moneda": string
    }
  },
  "clasificacion_hs10": [
    {
      "item": string,
      "codigo_hs10": string,
      "justificacion_rgi": string,
      "derecho_importacion_estimado": string,
      "tva_estimado": string,
      "controles_previos_requeridos": string[]
    }
  ],
  "regimen_aduanero_sugerido": {
    "codigo_regimen": string,
    "observaciones": string
  },
  "factura": {
    "numeroFactura": string,
    "fecha": string,
    "proveedor": string,
    "proveedorDireccion": string,
    "importador": string,
    "importadorDireccion": string,
    "importadorICE": string,
    "importadorIF": string,
    "incoterm": string,
    "moneda": string,
    "totalFactura": number,
    "fleteEstimado": number,
    "seguroEstimado": number
  },
  "posiblesIndicacionesCustoms": {
    "suggestedRegimeHint": string,
    "alertaIncotermCritica": boolean,
    "mensajeIncoterm": string
  },
  "lineasProducto": [
    {
      "descripcion": string,
      "cantidad": number,
      "precioUnitario": number,
      "totalLinea": number,
      "hsCodeSugerido": string,
      "ddiRate": number,
      "tvaRate": number,
      "justificacionRgi": string,
      "controlMcinet": boolean
    }
  ],
  "packingList": {
    "docNumber": string,
    "declaredGrossWeightKg": number,
    "declaredNetWeightKg": number,
    "packagesCount": number,
    "packageType": string,
    "containerNumber": string,
    "sealNumber": string
  }
}`;

    let promptParts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
      // Detect effective MIME type (application/pdf, image/png, image/jpeg, etc.)
      let effectiveMimeType = mimeType || "application/pdf";
      if (imageBase64.startsWith("data:application/pdf")) {
        effectiveMimeType = "application/pdf";
      } else if (imageBase64.startsWith("data:image/png")) {
        effectiveMimeType = "image/png";
      } else if (imageBase64.startsWith("data:image/jpeg") || imageBase64.startsWith("data:image/jpg")) {
        effectiveMimeType = "image/jpeg";
      }

      promptParts.push({
        inlineData: {
          mimeType: effectiveMimeType,
          data: cleanBase64,
        },
      });
      promptParts.push({
        text: `Analiza y extrae minuciosamente todos los datos del documento adjunto "${fileName || "documento_comercial"}". Devuelve exclusivamente los datos reales presentes en el documento en el formato JSON especificado.`,
      });
    } else {
      promptParts.push({
        text: `Analiza y extrae minuciosamente los datos reales del siguiente documento/texto:\n\n${documentText}`,
      });
    }

    const generatedText = await generateGeminiSafe(ai, { parts: promptParts }, {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.1,
    });

    if (!generatedText) {
      return res.status(502).json({
        success: false,
        error: "El motor de IA no pudo procesar el documento en este momento. Inténtelo de nuevo.",
      });
    }

    try {
      const parsed = JSON.parse(generatedText);
      return res.json({ success: true, data: parsed, engine: "gemini-ai" });
    } catch (parseError) {
      console.error("[JSON Parse Error] Raw text returned by Gemini:", generatedText);
      return res.status(500).json({
        success: false,
        error: "Error interpretando la respuesta estructurada del modelo.",
        rawText: generatedText,
      });
    }
  } catch (error: any) {
    console.error("Document analysis error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Error procesando el documento con Gemini.",
    });
  }
});

// 3. Dynamic Mission Generation API
app.post("/api/generate-mission", async (req, res) => {
  try {
    const { difficulty = "inspector", language = "es", customContext = "" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `Eres un Diseñador Lead de Simuladores de Comercio Exterior y Aduanas Marroquíes (ADII, PortNet, DUM, ADIL).
Genera una misión de despacho aduanero profesional y realista en formato JSON para el nivel '${difficulty}' e idioma '${language}'.

Debes incluir:
- id, title, portOfEntry ("TANGER_MED" | "CASABLANCA" | "AGADIR" | "NADOR_WEST_MED")
- clientName, containerId, vesselName, voyageNumber, blNumber
- invoice: { invoiceNumber, date, supplier, importer, incoterm, currency, exchangeRateMAD, totalAmount }
- packingList: { declaredGrossWeightKg, declaredNetWeightKg, packagesCount, containerSealNumber }
- scaleWeighbridgeWeightKg (puede tener discrepancia oculta o intencional para auditoría)
- regimeRecommended: ("10_IMPORT_CONSOMMATION" | "21_ATPA" | "30_ENTREPOT" | "40_TRANSIT")
- items: lista de productos con description, qty, unitPrice, correctHsCode, distractorHsCodes, declaredHsCode, isHsDiscrepant (boolean), ddiRate, tvaRate, tpRate (0.0025), isMcinetRequired, isOnssaRequired
- scannerAlert: boolean (si hay anomalía de densidad en rayos X)
- scaleAlert: boolean (si el peso en báscula difiere más del 3%)
- urgencyDemurrageMinutes: number (tiempo antes de cobrar sobrestadía portuaria)
- penaltyPerMinuteMAD: number
- fraudTrapDescription: string (descripción interna de la trampa aduanera para validar precisión)
- explanationTechnical: string (justificación de la resolución aduanera correcta)`;

      const prompt = `Genera un escenario de despacho aduanero marroquí altamente inmersivo con dificultad ${difficulty}. Contexto adicional: ${customContext}`;

      const generatedText = await generateGeminiSafe(ai, prompt, {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      });

      if (generatedText) {
        try {
          const parsed = JSON.parse(generatedText);
          return res.json({ success: true, mission: parsed, generatedBy: "gemini-ai" });
        } catch (parseError) {
          console.warn("[Mission Parse Error] Raw text:", generatedText);
        }
      }
    }

    res.json({ success: false, message: "Gemini fallback triggered" });
  } catch (error: any) {
    console.error("Mission generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate mission" });
  }
});

// 4. Customs AI Voice & Expert Advisor API
app.post("/api/customs-agent", async (req, res) => {
  const language = req.body.language || "es";
  const userQuery = req.body.userQuery || req.body.query || "";
  const missionContext = req.body.missionContext || {};
  const conversationHistory = req.body.conversationHistory || [];

  // Robust contextual fallback logic in case AI service is overloaded
  const getFallbackAdvice = () => {
    const q = userQuery.toLowerCase();
    
    if (q.includes("rgi") || q.includes("arancel") || q.includes("clasific") || q.includes("tarif")) {
      if (language === "fr") return "Inspecteur ADII: Appliquez la Règle Générale Interprétative RGI 1 (libellé des positions et notes de section/chapitre). Si le produit est composé, utilisez la RGI 3(b) selon la matière qui lui confère son caractère essentiel. N'oubliez pas les 10 chiffres du tarif ADIL.";
      if (language === "ar") return "مفتش الجمارك (ADII): طبّق القاعدة التفسيرية العامة RGI 1 وفقًا لنصوص البنود والملاحظات القانونية للأقسام والفصول، أو RGI 3(b) للبضائع المركبة. تحقق من مطابقة الرمز الجمركي ذي الـ 10 أرقام في تعريفة ADIL.";
      if (language === "en") return "ADII Inspector: Apply General Interpretative Rule GRI 1 based on heading terms and legal chapter notes, or GRI 3(b) for composite items based on essential character. Always verify the 10-digit code in the ADIL tariff.";
      return "Inspector ADII: Aplique la Regla General Interpretativa RGI 1 (textos de partidas y notas de sección/capítulo). Si el producto es compuesto, recurra a la RGI 3(b) según la materia esencial. Verifique siempre los 10 dígitos en el arancel ADIL.";
    }

    if (q.includes("peso") || q.includes("poids") || q.includes("weight") || q.includes("báscula") || q.includes("bascule") || q.includes("scanner")) {
      if (language === "fr") return "Inspecteur ADII: Tout écart supérieur à 3% entre le B/L et le ticket de pont-bascule constitue une anomalie flagrante. En cas de doute ou d'alerte scanner de densité, ordonnez une Visite Physique (Circuit Rouge) avant toute Mainlevée.";
      if (language === "ar") return "مفتش الجمارك: أي فارق في الوزن يتجاوز 3% بين بوليصة الشحن (B/L) وميزان الميناء يتطلب تدقيقًا فوريًا. في حالة وجود إنذار من الماسح الضوئي (Scanner)، وجّه الحاوية إلى الفحص الفعلي (المسار الأحمر).";
      if (language === "en") return "ADII Inspector: Any weight disparity over 3% between the Bill of Lading and port weighbridge is an anomaly. If scanner density alerts trigger, mandate a Physical Inspection (Red Circuit) prior to granting clearance.";
      return "Inspector ADII: Toda discrepancia superior al 3% entre el conocimiento de embarque (B/L) y el pesaje en báscula portuaria requiere acta de inspección. Si el escáner detecta densidad no homogénea, ordene Visite Physique (Circuito Rojo).";
    }

    if (q.includes("atpa") || q.includes("régime") || q.includes("regimen") || q.includes("21") || q.includes("10")) {
      if (language === "fr") return "Inspecteur ADII: Le Régime 21 (ATPA) suspend les droits et taxes pour transformation industrielle avec réexportation. Si la marchandise est destinée au marché national, appliquez le Régime 10 (Mise à la consommation) avec DDI + TVA + Taxe Parafiscale (0.25%).";
      if (language === "ar") return "مفتش الجمارك: النظام 21 (ATPA - القبول المؤقت) يعلق الرسوم والضرائب للتحويل الصناعي وإعادة التصدير. للاستهلاك الداخلي، اختر النظام 10 مع احتساب رسم الاستيراد، الضريبة على القيمة المضافة، ورسم 0.25%.";
      if (language === "en") return "ADII Inspector: Regime 21 (ATPA) suspends duties for inward processing destined for re-export. For domestic market release, apply Regime 10 (Direct Import) calculating DDI + VAT + 0.25% Parafiscale tax.";
      return "Inspector ADII: El Régimen 21 (ATPA) suspende aranceles e IVA para perfeccionamiento activo con reexportación posterior. Para el mercado nacional aplique Régimen 10 (Consumo) liquidando DDI + TVA + Tasa Parafiscal (0.25%).";
    }

    const standardReplies: Record<string, string> = {
      es: "Inspector Amin El Fassi (ADII): Expediente bajo supervisión. Recuerde contrastar la partida arancelaria de 10 dígitos (ADIL), el certificado de conformidad MCINET/ONSSA y el peso en báscula de Tanger Med.",
      fr: "Inspecteur Amin El Fassi (ADII): Dossier sous contrôle. Vérifiez impérativement la nomenclature tarifaire à 10 chiffres (ADIL), le certificat MCINET/ONSSA et le ticket de pont-bascule à Tanger Med.",
      ar: "المفتش أمين الفاسي (إدارة الجمارك ADII): الملف قيد المتابعة. تأكد من مطابقة التعريفة ذات 10 أرقام (ADIL)، وشهادة المطابقة الصناعية أو الصحية، والوزن في طنجة المتوسط.",
      en: "Inspector Amin El Fassi (ADII): File under review. Make sure to cross-examine the 10-digit HS code (ADIL), MCINET/ONSSA conformity certificate, and Tanger Med weighbridge ticket.",
    };
    return standardReplies[language] || standardReplies.es;
  };

  try {
    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `Eres "Inspector Amin El Fassi", Inspector Principal de la ADII (Administration des Douanes et Impôts Indirects du Maroc) y consultor senior de PortNet.
Responde de manera profesional, técnica y pedagógica en el idioma '${language}'.
Terminología oficial marroquí: DUM, ADIL (10 dígitos), PortNet, Mainlevée, MCINET, ONSSA, DDI, TVA, TP (0.25%), Régimes 10, 21 (ATPA), 30, 40.
Proporciona pautas legales y técnicas orientadas a la auditoría aduanera.`;

      const contents = [
        ...conversationHistory.map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
        {
          role: "user",
          parts: [
            {
              text: `Contexto de la misión aduanera:\n${JSON.stringify(
                missionContext
              )}\n\nConsulta del operador:\n${userQuery}`,
            },
          ],
        },
      ];

      const generatedText = await generateGeminiSafe(ai, contents, {
        systemInstruction,
        temperature: 0.3,
      });

      if (generatedText) {
        return res.json({
          success: true,
          reply: generatedText,
          agentName: "Inspector Amin El Fassi (ADII / PortNet)",
        });
      }
    }

    // Return smart fallback reply
    return res.json({
      success: true,
      reply: getFallbackAdvice(),
      agentName: "Inspector Amin El Fassi (ADII)",
    });
  } catch (error: any) {
    console.warn("[Customs Agent Handled Exception]:", error?.message || error);
    return res.json({
      success: true,
      reply: getFallbackAdvice(),
      agentName: "Inspector Amin El Fassi (ADII)",
    });
  }
});

// Vite Middleware for development / production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Customs Transit Simulator Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
