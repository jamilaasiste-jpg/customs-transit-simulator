import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  Layers, 
  Loader2,
  FileCheck
} from 'lucide-react';
import { InterfaceLanguage, CustomsMission } from '../types';
import { translations } from '../i18n/translations';

interface RealToMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: InterfaceLanguage;
  onMissionLoaded: (mission: CustomsMission) => void;
}

export const RealToMissionModal: React.FC<RealToMissionModalProps> = ({
  isOpen,
  onClose,
  uiLang,
  onMissionLoaded,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';

  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPresetSample, setSelectedPresetSample] = useState<string>('SAMPLE_AGRO');
  const [customFileText, setCustomFileText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
    base64: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const mime = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: mime,
        base64,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const samplePresets = [
    {
      id: 'SAMPLE_AGRO',
      title: 'Factura Aceite de Oliva Virgen Extra (Jaén ➔ Casablanca)',
      textSnippet: `FACTURE COMMERCIALE N° EXP-2026-9912
Date: 15/02/2026
Fournisseur: OLEO IBERICA EXPORT S.A. - Jaén, Espagne
Destinataire / Importateur: LES HUILERIES DU SOUSS S.A.R.L. - Casablanca, Maroc (ICE: 001889211000045)
Incoterm: CIF Port de Casablanca
Devise: EUR
Lignes:
1. Huile d'olive extra vierge en fûts alimentaires 200L - 12.000 Litres - Prix unit: 4.80 EUR - Total: 57.600 EUR (HS: 1509.20.00.00)
Sous-total FOB: 54.000 EUR
Fret Maritime & Assurance: 3.600 EUR
Total Facture: 57.600 EUR
Indications: Régime 10 Mise à la consommation directe. Soumis à contrôle sanitaire ONSSA.`,
    },
    {
      id: 'SAMPLE_AUTO',
      title: 'Factura Radiadores de Motor para Renault Tangier (Valeo ➔ TAC)',
      textSnippet: `COMMERCIAL INVOICE N° VAL-FR-88219
Date: 20/02/2026
Supplier: VALEO THERMAL SYSTEMS SAS - La Verrière, France
Importer: RENAULT TRUCK & CAR MAROC - Zone Franche Tanger Med TAC, Maroc (ICE: 002199401000088)
Incoterm: DAP Tanger Automotive City
Currency: EUR
Items:
1. Radiateurs en aluminium pour moteurs diesel Duster - 800 Unités - Prix unit: 75.00 EUR - Total: 60.000 EUR (HS: 8708.91.00.00)
Total Facture: 60.000 EUR
Indications: ATPA - Admission Temporaire pour Perfectionnement Actif (Régime 21) pour montage et réexportation de véhicules.`,
    },
    {
      id: 'SAMPLE_SOLAR',
      title: 'Factura Paneles Fotovoltaicos Noor Ouarzazate (Hamburg ➔ Agadir)',
      textSnippet: `COMMERCIAL INVOICE N° DE-SOLAR-4091
Date: 10/02/2026
Supplier: HANSEATIC SOLAR GMBH - Hamburg, Germany
Importer: MASEN ENERGY CONSORTIUM - Agadir / Ouarzazate, Maroc (ICE: 003344556000012)
Incoterm: CIF Port d'Agadir
Currency: EUR
Items:
1. Modules photovoltaïques monocristallins 550W - 1.500 Unités - Unit price: 92.00 EUR - Total: 138.000 EUR (HS: 8541.43.00.00)
Total Facture: 138.000 EUR
Indications: Importation pour projet d'énergie renouvelable. Taux DDI préférentiel 2.5%, exonération TVA selon loi de finances.`,
    }
  ];

  const handleRunOcrIngestion = async () => {
    setIsProcessing(true);
    setExtractedData(null);
    setErrorMessage(null);

    const docText = uploadedFile ? '' : (customFileText.trim() || samplePresets.find(p => p.id === selectedPresetSample)?.textSnippet || '');

    try {
      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          imageBase64: uploadedFile?.base64,
          mimeType: uploadedFile?.type || 'application/pdf',
          fileName: uploadedFile?.name || 'documento_aduanero.pdf',
          language: uiLang,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Error al analizar el documento con Gemini.");
      }

      setExtractedData(result.data || result);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e?.message || "Error procesando el archivo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLaunchMissionFromExtracted = () => {
    if (!extractedData) return;

    const factura = extractedData.factura || extractedData.datos_extraidos || {};
    const lineas = extractedData.lineasProducto || extractedData.clasificacion_hs10 || [];
    const packing = extractedData.packingList || {};
    const incoterm = (factura.incoterm || 'FOB').toUpperCase().trim();
    const moneda = (factura.moneda || 'EUR').toUpperCase().trim();
    const exchangeRate = moneda === 'EUR' ? 10.85 : moneda === 'USD' ? 10.05 : 1.0;
    const totalFactura = Number(factura.totalFactura) || 0;
    const cifValueMAD = totalFactura * exchangeRate;

    const incotermsDirectosProhibidos = ["CIF", "CPT", "CIP", "DDP"];
    const hasIncotermViolation = incotermsDirectosProhibidos.some(inc => incoterm.includes(inc));

    let computedDDI = 0;
    let computedTVA = 0;
    const computedTP = cifValueMAD * 0.0025;

    const itemsFormatted = lineas.map((l: any, idx: number) => {
      const hsCode = l.hsCodeSugerido || l.codigo_hs10 || '8708.91.90.00';
      const qty = Number(l.cantidad) || 1;
      const unitPrice = Number(l.precioUnitario) || (lineas.length === 1 && totalFactura > 0 ? totalFactura : 0);
      const itemTotal = l.totalLinea ? Number(l.totalLinea) : qty * unitPrice;
      const itemMAD = itemTotal * exchangeRate;

      let ddiRate = 0.175;
      if (typeof l.ddiRate === 'number') {
        ddiRate = l.ddiRate;
      } else if (l.derecho_importacion_estimado) {
        const parsedRate = parseFloat(l.derecho_importacion_estimado);
        if (!isNaN(parsedRate)) ddiRate = parsedRate > 1 ? parsedRate / 100 : parsedRate;
      }

      const tvaRate = 0.20;
      computedDDI += itemMAD * ddiRate;
      computedTVA += (itemMAD + (itemMAD * ddiRate)) * tvaRate;

      return {
        id: `item-${idx + 1}`,
        description: l.descripcion || l.item || 'Mercancía comercial declarada',
        quantity: qty,
        unit: 'U',
        unitPrice: unitPrice,
        totalPrice: itemTotal,
        declaredHsCode: hsCode,
        correctHsCode: hsCode,
        ddiRate,
        tvaRate,
        tpRate: 0.0025,
        isMcinetRequired: l.controlMcinet !== false,
        isOnssaRequired: false,
        originCountry: 'UE',
        preferentialDutyEligible: true,
      };
    });

    const totalDutiesMAD = computedDDI + computedTVA + computedTP;
    const grossWeight = Number(packing.declaredGrossWeightKg) || 14500;
    const netWeight = Number(packing.declaredNetWeightKg) || Math.round(grossWeight * 0.9);

    const newMission: CustomsMission = {
      id: `MISSION_REAL_${Date.now()}`,
      title: `Despacho Real: ${factura.proveedor || 'Proveedor Extranjero'} ➔ ${factura.importador || 'Importador Marruecos'}`,
      description: `Misión generada con Gemini AI a partir de "${uploadedFile?.name || factura.numeroFactura || 'Factura'}".`,
      difficulty: 'MEDIUM',
      portOfEntry: 'TANGER_MED',
      vesselName: 'CMA CGM TANGER EXPRESS',
      estimatedArrival: 'En Quai / Arrivé',
      timeLimitMinutes: 15,
      penaltyPerMinuteMAD: 250,
      invoice: {
        invoiceNumber: factura.numeroFactura || `FAC-${Date.now().toString().slice(-4)}`,
        date: factura.fecha || new Date().toISOString().split('T')[0],
        supplierName: factura.proveedor || 'Proveedor Declarado',
        supplierAddress: factura.proveedorDireccion || 'Dirección de origen',
        importerName: factura.importador || 'Importador Declarado',
        importerAddress: factura.importadorDireccion || 'Casablanca / Tanger Med, Maroc',
        importerICE: factura.importadorICE || '001994821000077',
        importerIF: factura.importadorIF || '40291033',
        incoterm: incoterm,
        currency: moneda,
        exchangeRateToMAD: exchangeRate,
        totalInvoiceAmount: totalFactura,
        freightCost: Number(factura.fleteEstimado) || Math.round(totalFactura * 0.06),
        insuranceCost: Number(factura.seguroEstimado) || Math.round(totalFactura * 0.01),
        suggestedRegimeHint: extractedData.posiblesIndicacionesCustoms?.suggestedRegimeHint || 'Mise à la consommation directe (Régime 10)',
      },
      packingList: {
        docNumber: packing.docNumber || `PK-${factura.numeroFactura || '992'}`,
        date: factura.fecha || new Date().toISOString().split('T')[0],
        containerNumber: packing.containerNumber || 'MSCU-884910-2',
        sealNumber: packing.sealNumber || 'MA-ADII-90412',
        packageType: packing.packageType || 'Palettes Euro standards',
        packagesCount: Number(packing.packagesCount) || 24,
        declaredGrossWeightKg: grossWeight,
        declaredNetWeightKg: netWeight,
        volumeCbm: 48.5,
      },
      billOfLading: {
        blNumber: `BL-MED-${Date.now().toString().slice(-5)}`,
        carrierName: 'MAERSK LINE MAROC',
        vesselName: 'CMA CGM TANGER EXPRESS',
        voyageNumber: '2604-W',
        portOfLoading: 'Puerto de Embarque',
        portOfDischarge: 'Tanger Med Port',
        containerNumber: packing.containerNumber || 'MSCU-884910-2',
        sealNumber: packing.sealNumber || 'MA-ADII-90412',
        shippersWeightKg: grossWeight,
        freightPaymentStatus: 'PREPAID',
        badStatus: 'DELIVERED',
      },
      certificates: [
        {
          type: 'EUR1',
          certificateNumber: 'EUR1-MA-2026-88',
          issuingAuthority: 'Chambre de Commerce Européenne',
          issueDate: factura.fecha || new Date().toISOString().split('T')[0],
          status: 'VALID',
          remarks: 'Origine préférentielle Union Européenne certifiée conforme.',
        },
      ],
      dumDraft: {
        dumNumber: `DUM-26-004-${Date.now().toString().slice(-4)}`,
        bureauDouane: '004 - Tanger Med Port',
        regimeDouanier: hasIncotermViolation ? '10_IMPORT_CONSOMMATION' : '21_ATPA',
        declarantICE: factura.importadorICE || '001556677000088',
        dateEnregistrement: new Date().toISOString().split('T')[0],
        cifValueMAD: cifValueMAD,
        calculatedDDI: computedDDI,
        calculatedTVA: computedTVA,
        calculatedTP: computedTP,
        totalLiquidationMAD: totalDutiesMAD,
        statutCircuit: hasIncotermViolation ? 'ORANGE' : 'VERT',
      },
      scaleWeighbridgeWeightKg: grossWeight,
      scannerAnomalyDetected: false,
      recommendedRegime: hasIncotermViolation ? '10_IMPORT_CONSOMMATION' : '21_ATPA',
      items: itemsFormatted,
      discrepancies: hasIncotermViolation ? [{
        id: 'DISC_INCOTERM_NATIONAL_TERRITORY',
        type: 'INCOTERM_VALUATION',
        title: `Incoterm ${incoterm} Inválido para Territorio Nacional sin Desglose`,
        description: `Según la normativa ADII / PortNet, el Incoterm ${incoterm} exige desglose en Valor FOB + Flete + Seguro para la declaración DUM a consumo directo.`,
        detectedByPlayer: false,
        severity: 'high',
        impactMAD: Math.round(cifValueMAD * 0.05),
        expectedAction: 'RECTIFY_DUM',
      }] : [],
    };

    onMissionLoaded(newMission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{t.tabRealToMission}</h2>
              <p className="text-xs text-slate-400">{t.uploadRealDocDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Samples or Custom Text or Direct File Upload */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Subir Factura Comercial / Documento (PDF o Imagen)
              </label>
              {uploadedFile && (
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                >
                  Eliminar archivo
                </button>
              )}
            </div>

            {uploadedFile ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">{uploadedFile.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Listo para procesar con Gemini
                </span>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  Haz clic para seleccionar o arrastra tu archivo PDF, PNG o JPG
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Gemini extraerá directamente la información real del documento
                </span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase">
              O bien seleccione una factura de ejemplo / texto libre:
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {samplePresets.map((samp) => (
                <button
                  key={samp.id}
                  onClick={() => {
                    setSelectedPresetSample(samp.id);
                    setCustomFileText('');
                    setUploadedFile(null);
                  }}
                  className={`p-3 rounded-xl border text-start text-xs font-semibold transition cursor-pointer ${
                    selectedPresetSample === samp.id && !customFileText && !uploadedFile
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {samp.title}
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={customFileText || (uploadedFile ? '' : samplePresets.find(p => p.id === selectedPresetSample)?.textSnippet)}
              onChange={(e) => {
                setCustomFileText(e.target.value);
                setUploadedFile(null);
              }}
              placeholder="Pegue aquí el texto de su factura comercial o documento logístico si no adjunta archivo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleRunOcrIngestion}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/30 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analizando con motor IA OCR YAFFA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.generateMissionBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Extracted YAFFA JSON Result */}
        {extractedData && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Extracción estructurada exitosa
              </span>
              <span className="text-[10px] font-mono text-slate-500">YAFFA SCHEMA V1.0</span>
            </div>

            <pre className="text-[11px] font-mono text-slate-300 bg-slate-900 p-3 rounded-xl overflow-x-auto max-h-48 border border-slate-800">
              {JSON.stringify(extractedData, null, 2)}
            </pre>

            <button
              onClick={handleLaunchMissionFromExtracted}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>CREAR & CARGAR MISIÓN ADUANERA INTERACTIVA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
