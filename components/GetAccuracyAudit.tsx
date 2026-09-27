import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calculator, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight, 
  ShieldAlert, 
  Scale, 
  HelpCircle, 
  Sparkles,
  Award,
  Layers,
  FileSpreadsheet,
  Building,
  Anchor,
  FileWarning
} from 'lucide-react';
import { 
  CustomsMission, 
  InterfaceLanguage, 
  CustomsRegimeCode, 
  TriageStatus, 
  PlayerCustomsDecision 
} from '../types';
import { translations } from '../i18n/translations';

// Regla de Auditoría de Incoterms - Normativa ADII / GET ACCURACY
export function validarIncotermYRegimen(incoterm: string, regimen: string, destinoZonaFranca: boolean) {
  const incotermsDirectosProhibidosTerNac = ["CIF", "CPT", "CIP", "DDP"];
  
  if (!destinoZonaFranca && incotermsDirectosProhibidosTerNac.includes((incoterm || '').toUpperCase())) {
    return {
      alertaNivel: "CRÍTICO" as const,
      codigoError: "INCOTERM_INVALIDO_TERRITORIO_NACIONAL",
      mensaje: `El Incoterm ${incoterm} no es admisible directamente para despacho a consumo en territorio aduanero nacional.`,
      accionRequerida: "Desglosar la factura en Valor FOB + Flete Marítimo/Aéreo + Seguro para la declaración DUM, o verificar si la operación destina a Zona de Aceleración Industrial (ZAI)."
    };
  }
  return {
    alertaNivel: "OK" as const,
    codigoError: "INCOTERM_VALIDO",
    mensaje: "Incoterm coherente con el régimen aduanero.",
    accionRequerida: "Continuar con la liquidación aduanera normal."
  };
}

interface GetAccuracyAuditProps {
  mission: CustomsMission;
  uiLang: InterfaceLanguage;
  playerDecision: PlayerCustomsDecision;
  setPlayerDecision: React.Dispatch<React.SetStateAction<PlayerCustomsDecision>>;
  onSubmitAudit: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export const GetAccuracyAudit: React.FC<GetAccuracyAuditProps> = ({
  mission,
  uiLang,
  playerDecision,
  setPlayerDecision,
  onSubmitAudit,
  onNavigateToTab,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';

  const [triage, setTriage] = useState<TriageStatus>(playerDecision.triageStatus);
  const [selectedRegime, setSelectedRegime] = useState<CustomsRegimeCode>(playerDecision.selectedRegime);
  const [selectedDiscrepancyIds, setSelectedDiscrepancyIds] = useState<string[]>(playerDecision.detectedDiscrepancies);
  const [mainleveeChoice, setMainleveeChoice] = useState<PlayerCustomsDecision['mainleveeDecision']>(playerDecision.mainleveeDecision);

  // Compute Taxes
  const exchangeRate = mission.invoice.exchangeRateToMAD || 10.85;
  const cifValueMAD = mission.invoice.totalInvoiceAmount * exchangeRate;

  // Calculate duty based on regime and items
  const isSuspensiveRegime = selectedRegime === '21_ATPA' || selectedRegime === '30_ENTREPOT' || selectedRegime === '40_TRANSIT';

  let computedDDI = 0;
  let computedTVA = 0;
  const computedTP = cifValueMAD * 0.0025; // 0.25% Taxe Parafiscale always applies

  mission.items.forEach(item => {
    const itemMAD = item.totalPrice * exchangeRate;
    if (!isSuspensiveRegime) {
      computedDDI += itemMAD * item.ddiRate;
      computedTVA += (itemMAD + (itemMAD * item.ddiRate)) * item.tvaRate;
    }
  });

  const totalCalculatedLiquidationMAD = computedDDI + computedTVA + computedTP;

  const handleToggleDiscrepancy = (discId: string) => {
    const updated = selectedDiscrepancyIds.includes(discId)
      ? selectedDiscrepancyIds.filter(id => id !== discId)
      : [...selectedDiscrepancyIds, discId];
    
    setSelectedDiscrepancyIds(updated);
    setPlayerDecision(prev => ({ ...prev, detectedDiscrepancies: updated }));
  };

  const handleRegimeChange = (regime: CustomsRegimeCode) => {
    setSelectedRegime(regime);
    setPlayerDecision(prev => ({ 
      ...prev, 
      selectedRegime: regime,
      declaredCIF_MAD: cifValueMAD,
      calculatedTotalDuty_MAD: totalCalculatedLiquidationMAD
    }));
  };

  const handleTriageChange = (newTriage: TriageStatus) => {
    setTriage(newTriage);
    setPlayerDecision(prev => ({ ...prev, triageStatus: newTriage }));
  };

  const handleVerdictChange = (verdict: PlayerCustomsDecision['mainleveeDecision']) => {
    setMainleveeChoice(verdict);
    setPlayerDecision(prev => ({ 
      ...prev, 
      mainleveeDecision: verdict,
      declaredCIF_MAD: cifValueMAD,
      calculatedTotalDuty_MAD: totalCalculatedLiquidationMAD
    }));
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">{t.triangularAuditTitle}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.triangularAuditSubtitle}</p>
          </div>
        </div>

        {/* Triage Selector Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriageChange('VALIDATED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              triage === 'VALIDATED'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {t.statusValidated}
          </button>
          <button
            onClick={() => handleTriageChange('NEEDS_REVIEW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              triage === 'NEEDS_REVIEW'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {t.statusNeedsReview}
          </button>
          <button
            onClick={() => handleTriageChange('FRAUD_OR_INCOMPLETE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              triage === 'FRAUD_OR_INCOMPLETE'
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {t.statusFraudOrIncomplete}
          </button>
        </div>
      </div>

      {/* 2. Triangular Cross-Validation Matrix & Discrepancy Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Discrepancies Checklist */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-slate-100">{t.discrepancyDetection}</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {mission.discrepancies.length} Detectable(s)
            </span>
          </div>

          {mission.discrepancies.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t.noIssuesFound}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {mission.discrepancies.map((disc) => {
                const isSelected = selectedDiscrepancyIds.includes(disc.id);
                return (
                  <div
                    key={disc.id}
                    onClick={() => handleToggleDiscrepancy(disc.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-md shadow-amber-950/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{disc.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{disc.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 shrink-0">
                        {disc.impactMAD > 0 ? `Impact: ${disc.impactMAD.toLocaleString()} MAD` : 'Normativo'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick link to ADIL Tariff Search */}
          <div className="pt-2">
            <button
              onClick={() => onNavigateToTab('adil_classifier')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
            >
              <span>{t.tabAdilClassifier}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customs Regime Selection */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">{t.customsRegimeSelection}</h3>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { id: '10_IMPORT_CONSOMMATION', title: 'Régime 10 - Mise à la Consommation', desc: t.regime10Desc },
              { id: '21_ATPA', title: 'Régime 21 - ATPA (Suspension de Droits)', desc: t.regime21Desc },
              { id: '30_ENTREPOT', title: 'Régime 30 - Entrepôt de Douane (MEAD)', desc: t.regime30Desc },
              { id: '40_TRANSIT', title: 'Régime 40 - Transit Douanier National', desc: t.regime40Desc },
            ].map((reg) => (
              <div
                key={reg.id}
                onClick={() => handleRegimeChange(reg.id as any)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  selectedRegime === reg.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{reg.title}</span>
                  {selectedRegime === reg.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{reg.desc}</p>
              </div>
            ))}
          </div>

          {/* Incoterm & Territory Compliance Audit Rule (ADII / GET ACCURACY) */}
          {(() => {
            const isFreeZone = (mission.portOfEntry === 'TANGER_MED' || mission.portOfEntry === 'KENITRA_ATLANTIC') && (selectedRegime === '21_ATPA' || selectedRegime === '30_ENTREPOT');
            const incotermAudit = validarIncotermYRegimen(mission.invoice.incoterm, selectedRegime, isFreeZone);

            if (incotermAudit.alertaNivel === 'CRÍTICO') {
              return (
                <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs space-y-1.5 animate-pulse">
                  <div className="flex items-center gap-2 font-bold text-rose-400">
                    <FileWarning className="w-4 h-4 text-rose-400" />
                    <span>ALERTA ADII: {incotermAudit.codigoError}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">{incotermAudit.mensaje}</p>
                  <p className="text-[10px] font-mono text-amber-300 bg-slate-950/80 p-2 rounded border border-amber-500/30">
                    <strong>Acción Requerida:</strong> {incotermAudit.accionRequerida}
                  </p>
                </div>
              );
            }

            return (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                <Anchor className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">
                  <strong>Incoterm {mission.invoice.incoterm}:</strong> {incotermAudit.mensaje}
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. Tax Liquidation Calculation & Breakdown (MAD) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-100">{t.taxLiquidationTitle}</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            1 {mission.invoice.currency} = {exchangeRate} MAD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-sans uppercase block">{t.cifValueCalculation}</span>
            <div className="text-base font-bold text-slate-100 mt-1">
              {cifValueMAD.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD
            </div>
            <span className="text-[10px] text-slate-400">({mission.invoice.totalInvoiceAmount.toLocaleString()} {mission.invoice.currency})</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-sans uppercase block">{t.ddiTitle}</span>
            <div className="text-base font-bold text-cyan-400 mt-1">
              {computedDDI.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD
            </div>
            <span className="text-[10px] text-slate-400">{isSuspensiveRegime ? 'Régime Suspensif (0 MAD)' : 'DDI Tarif ADIL'}</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-sans uppercase block">{t.tvaTitle}</span>
            <div className="text-base font-bold text-cyan-400 mt-1">
              {computedTVA.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD
            </div>
            <span className="text-[10px] text-slate-400">{isSuspensiveRegime ? 'TVA Suspendue' : 'TVA 20% / 10%'}</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-sans uppercase block">{t.taxeParafiscale}</span>
            <div className="text-base font-bold text-amber-400 mt-1">
              {computedTP.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD
            </div>
            <span className="text-[10px] text-slate-400">0.25% Base Imposable</span>
          </div>
        </div>

        {/* Total Liquidation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-300 block">{t.totalCustomsDuties}</span>
            <span className="text-[11px] text-slate-400">Droits et taxes exigibles selon le régime et les positions déclarées.</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {totalCalculatedLiquidationMAD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-400">MAD</span>
          </div>
        </div>
      </div>

      {/* 4. Final Verdict & Action Submission */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">{t.submitVerdict}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleVerdictChange('GRANT_MAINLEVEE')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer ${
              mainleveeChoice === 'GRANT_MAINLEVEE'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="font-bold text-xs">{t.grantMainlevee}</div>
            <div className="text-[10px] text-slate-400 mt-1">Autorisation de sortie et levée immédiate (BAE).</div>
          </button>

          <button
            onClick={() => handleVerdictChange('SEND_TO_PHYSICAL_VISITE')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer ${
              mainleveeChoice === 'SEND_TO_PHYSICAL_VISITE'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="font-bold text-xs">{t.sendToVisite}</div>
            <div className="text-[10px] text-slate-400 mt-1">Circuit Rouge: Examen physique des colis et pesage.</div>
          </button>

          <button
            onClick={() => handleVerdictChange('DEMAND_RECTIFICATION')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer ${
              mainleveeChoice === 'DEMAND_RECTIFICATION'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <FileCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="font-bold text-xs">{t.demandDUMRectification}</div>
            <div className="text-[10px] text-slate-400 mt-1">Exiger modification de code HS o valor imponible.</div>
          </button>

          <button
            onClick={() => handleVerdictChange('REFUSE_HOLD')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer ${
              mainleveeChoice === 'REFUSE_HOLD'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="font-bold text-xs">{t.refuseClearance}</div>
            <div className="text-[10px] text-slate-400 mt-1">Bloqueo por presunto fraude aduanero o contrabando.</div>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onSubmitAudit}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>FINALIZAR AUDITORÍA Y GENERAR DICTAMEN ADII</span>
          </button>
        </div>
      </div>
    </div>
  );
};
