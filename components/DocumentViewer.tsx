import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Eye, 
  Globe2, 
  Hash, 
  Building, 
  Scale, 
  ShieldCheck,
  SplitSquareVertical,
  QrCode
} from 'lucide-react';
import { CustomsMission, InterfaceLanguage, DocumentLanguage } from '../types';
import { translations } from '../i18n/translations';

interface DocumentViewerProps {
  mission: CustomsMission;
  uiLang: InterfaceLanguage;
  docLang: DocumentLanguage;
  setDocLang: (lang: DocumentLanguage) => void;
  highlightDiscrepancies: boolean;
  setHighlightDiscrepancies: (val: boolean) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  mission,
  uiLang,
  docLang,
  setDocLang,
  highlightDiscrepancies,
  setHighlightDiscrepancies,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';
  const [activeDocType, setActiveDocType] = useState<'INVOICE' | 'PACKING_LIST' | 'BL' | 'CERTIFICATES' | 'DUM_DRAFT' | 'SCANNER_SCALE'>('INVOICE');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const docTabs = [
    { id: 'INVOICE', label: t.commercialInvoice, icon: FileText },
    { id: 'PACKING_LIST', label: t.packingList, icon: Layers },
    { id: 'BL', label: t.billOfLading, icon: Building },
    { id: 'CERTIFICATES', label: `${t.certificateEur1} / ${t.mcinetConformity}`, icon: ShieldCheck },
    { id: 'DUM_DRAFT', label: t.dumDeclaration, icon: QrCode },
    { id: 'SCANNER_SCALE', label: `${t.scannerImaging} & ${t.scaleSlip}`, icon: Scale },
  ];

  const hasWeightDiscrepancy = mission.discrepancies.some(d => d.type === 'WEIGHT_MISMATCH');
  const hasHsDiscrepancy = mission.discrepancies.some(d => d.type === 'HS_CODE_ERROR');
  const hasCertDiscrepancy = mission.discrepancies.some(d => d.type === 'MISSING_CERTIFICATE');

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Toolbar: Document Subtabs, Language & Zoom Controls */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Document Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {docTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDocType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDocType(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 text-xs">
          
          {/* Document Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-medium mr-1 hidden sm:inline">{t.docLangLabel}:</span>
            {(['fr', 'ar', 'en', 'es'] as DocumentLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setDocLang(lang)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                  docLang === lang
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Toggle Discrepancy Highlight */}
          <button
            onClick={() => setHighlightDiscrepancies(!highlightDiscrepancies)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition border cursor-pointer ${
              highlightDiscrepancies
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Resalta campos sospechosos o inconsistentes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{t.highlightDiscrepancies}</span>
          </button>

          {/* Zoom buttons */}
          <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setZoomLevel(Math.max(80, zoomLevel - 10))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title={t.zoomOut}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title={t.zoomIn}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Workspace & Side-by-Side OCR Metadata Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left / Main Document Canvas Area */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-x-auto min-h-[520px]">
          <div 
            className="transition-transform origin-top-left mx-auto max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 border border-slate-300 font-sans relative"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            
            {/* 1. COMMERCIAL INVOICE VIEW */}
            {activeDocType === 'INVOICE' && (
              <div className="space-y-6">
                {/* Official Invoice Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">COMMERCIAL INVOICE / FACTURE COMMERCIALE</h2>
                    <p className="text-xs font-mono text-slate-600 mt-1">Invoice Ref: <strong className="text-slate-900">{mission.invoice.invoiceNumber}</strong></p>
                    <p className="text-xs text-slate-600">Date: {mission.invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded uppercase tracking-wider">
                      ORIGINAL
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 mt-1">Incoterm: <span className="text-emerald-700 font-bold">{mission.invoice.incoterm}</span></p>
                  </div>
                </div>

                {/* Supplier & Importer Blocks */}
                <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">EXPORTEUR / SUPPLIER:</span>
                    <p className="font-bold text-slate-900">{mission.invoice.supplierName}</p>
                    <p className="text-slate-600 mt-0.5">{mission.invoice.supplierAddress}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">DESTINATAIRE / IMPORTEUR (MAROC):</span>
                    <p className="font-bold text-slate-900">{mission.invoice.importerName}</p>
                    <p className="text-slate-600">{mission.invoice.importerAddress}</p>
                    <p className="font-mono text-[11px] text-slate-800 mt-1 font-semibold">ICE: {mission.invoice.importerICE} | IF: {mission.invoice.importerIF}</p>
                  </div>
                </div>

                {/* Products Table */}
                <div>
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-white font-bold uppercase text-[10px]">
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 text-center">Declared HS</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price ({mission.invoice.currency})</th>
                        <th className="p-2.5 text-right">Total ({mission.invoice.currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      {mission.items.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 font-medium text-slate-900">{item.description}</td>
                          <td className={`p-2.5 text-center font-mono font-semibold ${
                            highlightDiscrepancies && hasHsDiscrepancy && item.declaredHsCode !== item.correctHsCode
                              ? 'bg-amber-200 text-amber-900 font-bold'
                              : 'text-slate-700'
                          }`}>
                            {item.declaredHsCode}
                          </td>
                          <td className="p-2.5 text-center font-mono">{item.quantity.toLocaleString()} {item.unit}</td>
                          <td className="p-2.5 text-right font-mono">{item.unitPrice.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">{item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary & Totals */}
                <div className="flex justify-between items-end pt-4 border-t-2 border-slate-900">
                  <div className="text-[11px] text-slate-600 max-w-xs">
                    <p className="italic">{mission.invoice.suggestedRegimeHint}</p>
                    <p className="mt-2 font-mono text-[10px] text-slate-500">Bank Transfer / Swift Validated. Customs declaration subject to Moroccan ADII regulations.</p>
                  </div>
                  <div className="text-right space-y-1 text-xs">
                    <div className="flex justify-between gap-6">
                      <span className="text-slate-600">Subtotal FOB:</span>
                      <span className="font-mono font-semibold">{((mission.invoice.totalInvoiceAmount || 0) - (mission.invoice.freightCost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })} {mission.invoice.currency}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-slate-600">Freight & Insurance:</span>
                      <span className="font-mono font-semibold">{((mission.invoice.freightCost || 0) + (mission.invoice.insuranceCost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })} {mission.invoice.currency}</span>
                    </div>
                    <div className="flex justify-between gap-6 text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-300">
                      <span>TOTAL CIF INVOICE:</span>
                      <span className="font-mono text-emerald-800">{mission.invoice.totalInvoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {mission.invoice.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Stamp / Signature */}
                <div className="pt-4 flex justify-between items-center text-[10px] text-slate-500">
                  <div>Signature & Commercial Seal: <em>Valeo / Overseas Shipper</em></div>
                  <div className="font-mono">Taux de Change Fixé ADII: 1 {mission.invoice.currency} = {mission.invoice.exchangeRateToMAD} MAD</div>
                </div>
              </div>
            )}

            {/* 2. PACKING LIST VIEW */}
            {activeDocType === 'PACKING_LIST' && (
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 uppercase">PACKING LIST / LISTE DE COLISAGE</h2>
                    <p className="text-xs font-mono text-slate-600">Doc No: <strong>{mission.packingList.docNumber}</strong></p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-700">Conteneur: </span>
                    <span className="font-mono font-bold text-slate-900">{mission.packingList.containerNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded border border-slate-200">
                  <div>
                    <p><strong>Type de Colis:</strong> {mission.packingList.packageType}</p>
                    <p className="mt-1"><strong>Nombre de Colis:</strong> {mission.packingList.packagesCount} Colis</p>
                    <p className="mt-1"><strong>Volume Total:</strong> {mission.packingList.volumeCbm} CBM</p>
                  </div>
                  <div>
                    <p><strong>N° Plomb / Seal:</strong> <span className="font-mono font-bold text-slate-900">{mission.packingList.sealNumber}</span></p>
                    <p className="mt-1"><strong>Poids Net Déclaré:</strong> <span className="font-mono">{mission.packingList.declaredNetWeightKg.toLocaleString()} KG</span></p>
                    <p className={`mt-1 ${
                      highlightDiscrepancies && hasWeightDiscrepancy 
                        ? 'bg-amber-200 text-amber-900 p-1 rounded font-bold' 
                        : ''
                    }`}>
                      <strong>Poids Brut Déclaré:</strong> <span className="font-mono font-bold">{mission.packingList.declaredGrossWeightKg.toLocaleString()} KG</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-800 mb-2">Détail des bultos y acondicionamiento:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Pallets fumigados según norma internacional NIMF-15 / ISPM-15.</li>
                    <li>Etiquetado con código de barras GS1-128 con número de lote e importador SOMACA / NOOR.</li>
                    <li>Embalaje hermético anti-humedad para transporte marítimo en contenedor FCL.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. BILL OF LADING VIEW */}
            {activeDocType === 'BL' && (
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                  <div>
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-widest">{mission.billOfLading.carrierName}</span>
                    <h2 className="text-xl font-black text-slate-900 uppercase">OCEAN BILL OF LADING</h2>
                    <p className="text-xs font-mono text-slate-600">B/L No: <strong className="text-slate-900">{mission.billOfLading.blNumber}</strong></p>
                  </div>
                  <div className="text-right">
                    <div className="px-2 py-1 bg-blue-900 text-white font-mono text-xs font-bold rounded">
                      FREIGHT {mission.billOfLading.freightPaymentStatus}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border border-slate-300 p-3 rounded">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Vessel & Voyage:</span>
                    <p className="font-bold text-slate-900">{mission.billOfLading.vesselName} (Voy: {mission.billOfLading.voyageNumber})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Port of Loading:</span>
                    <p className="font-bold text-slate-900">{mission.billOfLading.portOfLoading}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Port of Discharge:</span>
                    <p className="font-bold text-slate-900">{mission.billOfLading.portOfDischarge}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Bon à Délivrer (BAD):</span>
                    <p className="font-bold text-emerald-700">{mission.billOfLading.badStatus}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-500">Container / Seal:</span>
                      <p className="font-mono font-bold text-slate-900">{mission.billOfLading.containerNumber} / {mission.billOfLading.sealNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Shipper's Declared Weight:</span>
                      <p className={`font-mono font-bold text-sm ${
                        highlightDiscrepancies && hasWeightDiscrepancy ? 'text-rose-600 bg-rose-100 px-2 py-0.5 rounded' : 'text-slate-900'
                      }`}>
                        {mission.billOfLading.shippersWeightKg.toLocaleString()} KG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CERTIFICATES VIEW (EUR.1 / MCINET / ONSSA) */}
            {activeDocType === 'CERTIFICATES' && (
              <div className="space-y-5">
                <h2 className="text-lg font-extrabold text-slate-900 uppercase border-b-2 border-slate-900 pb-2">
                  CERTIFICATS RÉGLEMENTAIRES & D'ORIGINE
                </h2>

                {mission.certificates.map((cert, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border text-xs ${
                    cert.status === 'VALID' 
                      ? 'bg-emerald-50 border-emerald-300' 
                      : 'bg-rose-50 border-rose-300'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={`w-5 h-5 ${cert.status === 'VALID' ? 'text-emerald-600' : 'text-rose-600'}`} />
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{cert.type} - {cert.certificateNumber}</h3>
                          <span className="text-[11px] text-slate-600">{cert.issuingAuthority}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        cert.status === 'VALID' ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {cert.status}
                      </span>
                    </div>

                    <p className="text-slate-700 mt-2"><strong>Remarques:</strong> {cert.remarks}</p>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">Date d'émission: {cert.issueDate}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 5. DUM DRAFT VIEW (PORTNET) */}
            {activeDocType === 'DUM_DRAFT' && (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">PROJET DE DÉCLARATION UNIQUE DE MARCHANDISE (DUM)</h2>
                    <p className="text-xs font-mono text-slate-600">DUM N°: <strong className="text-slate-900">{mission.dumDraft.dumNumber}</strong></p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs ${
                      mission.dumDraft.statutCircuit === 'VERT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      mission.dumDraft.statutCircuit === 'ORANGE' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      CIRCUIT {mission.dumDraft.statutCircuit}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded border border-slate-200 font-mono">
                  <div>
                    <p><strong>Bureau Douanier:</strong> {mission.dumDraft.bureauDouane}</p>
                    <p className="mt-1"><strong>Régime Douanier:</strong> {mission.dumDraft.regimeDouanier}</p>
                  </div>
                  <div>
                    <p><strong>Déclarant en Douane:</strong> {mission.dumDraft.declarantICE}</p>
                    <p className="mt-1"><strong>Date Enregistrement:</strong> {mission.dumDraft.dateEnregistrement}</p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valeur CAF Imposable:</span>
                    <span className="font-bold text-slate-100">{mission.dumDraft.cifValueMAD.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Droits d'Importation (DDI):</span>
                    <span>{mission.dumDraft.calculatedDDI.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TVA Importation:</span>
                    <span>{mission.dumDraft.calculatedTVA.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxe Parafiscale (0.25%):</span>
                    <span>{mission.dumDraft.calculatedTP.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-700 text-sm font-bold text-emerald-400">
                    <span>TOTAL LIQUIDATION DOUANIÈRE:</span>
                    <span>{mission.dumDraft.totalLiquidationMAD.toLocaleString()} MAD</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SCANNER & SCALE EVIDENCE VIEW */}
            {activeDocType === 'SCANNER_SCALE' && (
              <div className="space-y-5">
                <h2 className="text-lg font-black text-slate-900 uppercase border-b-2 border-slate-900 pb-2">
                  CONTRÔLES NON INTRUSIFS (SCANNER & PONT-BASCULE)
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-300 bg-slate-950 text-white font-mono text-xs">
                    <span className="text-cyan-400 font-bold uppercase block mb-2">RAPPORT RADIOSCOPIQUE X-RAY</span>
                    <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-cyan-500/10 to-blue-900/20"></div>
                      <span className="text-slate-400 text-center text-[11px] p-2">
                        {mission.scannerAnomalyDetected ? (
                          <span className="text-rose-400 font-bold">
                            ⚠️ ALERTE DENSITÉ ANORMALE DÉTECTÉE
                            <br />
                            {mission.scannerAnomalyLocation}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold">
                            ✓ SCANNER CONFORME (Pas d'anomalie)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs">
                    <span className="font-bold uppercase text-slate-700 block mb-2">TICKET OFFICIEL DU PONT-BASCULE</span>
                    <div className="space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span>Poids Brut Réel:</span>
                        <strong className="text-slate-900">{mission.scaleWeighbridgeWeightKg.toLocaleString()} KG</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Poids B/L:</span>
                        <span>{mission.packingList.declaredGrossWeightKg.toLocaleString()} KG</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-300 font-bold">
                        <span>Écart Constaté:</span>
                        <span className={mission.scaleWeighbridgeWeightKg !== mission.packingList.declaredGrossWeightKg ? 'text-rose-600' : 'text-emerald-700'}>
                          {(mission.scaleWeighbridgeWeightKg - mission.packingList.declaredGrossWeightKg).toLocaleString()} KG
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: YAFFA Trade Flow Structured OCR Metadata Drawer */}
        <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">{t.extractedFields}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                YAFFA PROTOCOL
              </span>
            </div>

            {/* Extracted JSON Inspector adhering to user rules */}
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">1. Factura:</span>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">numeroFactura:</span>
                  <span className="text-emerald-400">{mission.invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">fecha:</span>
                  <span>{mission.invoice.date}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">incoterm:</span>
                  <span className="text-cyan-400">{mission.invoice.incoterm}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">totalFactura:</span>
                  <span className="font-bold text-slate-100">{mission.invoice.totalInvoiceAmount.toLocaleString()} {mission.invoice.currency}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">2. Posibles Indicaciones Customs:</span>
                <p className="text-slate-300 text-[11px] font-sans italic">
                  "{mission.invoice.suggestedRegimeHint}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">3. Líneas de Producto ({mission.items.length}):</span>
                {mission.items.map((it, idx) => (
                  <div key={idx} className="pb-1 mb-1 border-b border-slate-800/60 last:border-0 last:pb-0">
                    <p className="text-slate-300 font-sans text-[11px] truncate">{it.description}</p>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                      <span>HS Sugerido: <strong className="text-amber-400">{it.declaredHsCode}</strong></span>
                      <span>Cant: {it.quantity} {it.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            {t.ruleEngineYaffa}
          </div>
        </div>
      </div>
    </div>
  );
};
