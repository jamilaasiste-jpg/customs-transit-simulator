import React, { useState } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  Scale, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  RotateCw, 
  FileEdit, 
  Coins, 
  Sparkles,
  HelpCircle,
  Eye,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { CustomsMission, InterfaceLanguage } from '../types';
import { translations } from '../i18n/translations';

interface ControlTowerProps {
  mission: CustomsMission;
  uiLang: InterfaceLanguage;
  demurrageSecondsLeft: number;
  accruedPenaltiesMAD: number;
  executedActions: string[];
  onExecuteAction: (actionId: string, actionLabel: string, costMAD: number) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const ControlTower: React.FC<ControlTowerProps> = ({
  mission,
  uiLang,
  demurrageSecondsLeft,
  accruedPenaltiesMAD,
  executedActions,
  onExecuteAction,
  onNavigateToTab,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const weightDiscrepancyKg = mission.scaleWeighbridgeWeightKg - mission.packingList.declaredGrossWeightKg;
  const isWeightAlert = Math.abs(weightDiscrepancyKg) > 300;

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Banner: Real-Time Incident Radar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">{t.incidentRadar}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PORTNET LIVE RADAR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitorización activa de sensores de báscula, portal radioscópico de rayos X y contadores de sobrestadía.
              </p>
            </div>
          </div>

          {/* Demurrage Urgency Clock & Penalty Ticker */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.demurrageTimer}</div>
              <div className={`text-xl font-black ${demurrageSecondsLeft < 120 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {formatTime(demurrageSecondsLeft)}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.penaltiesAccrued}</div>
              <div className="text-xl font-black text-rose-400">
                {accruedPenaltiesMAD.toLocaleString()} <span className="text-xs font-normal text-slate-400">MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 1. X-Ray Scanner Status Card */}
        <div className={`rounded-2xl border p-5 transition shadow-lg ${
          mission.scannerAnomalyDetected
            ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${
                mission.scannerAnomalyDetected
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">{t.scannerXray}</h3>
                <span className={`text-[11px] font-semibold ${
                  mission.scannerAnomalyDetected ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {mission.scannerAnomalyDetected ? 'ANOMALÍA DETECTADA (RAYOS-X)' : 'SCANNER LIMPIO (CONFORME)'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ADII TM-SCAN-01
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {mission.scannerAnomalyDetected ? (
              <>
                <p className="text-rose-300 font-medium">
                  {t.scannerAlertDesc}
                </p>
                {mission.scannerAnomalyLocation && (
                  <div className="mt-2 p-2 rounded bg-rose-950/50 border border-rose-500/30 text-rose-200">
                    <strong>Localización del sensor:</strong> {mission.scannerAnomalyLocation}
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400">
                La radioscopía no presenta gradientes de densidad anormales. Distribución de carga homogénea conforme al manifiesto.
              </p>
            )}
          </div>

          {/* Action Trigger for Scanner */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onExecuteAction('PHYSICAL_INSPECTION', 'Visite Douanière Physique (Écor)', 1200)}
              disabled={executedActions.includes('PHYSICAL_INSPECTION')}
              className={`w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                executedActions.includes('PHYSICAL_INSPECTION')
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30'
              }`}
            >
              {executedActions.includes('PHYSICAL_INSPECTION') ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.actionCompleted} (Visita Ordenada)</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>{t.orderPhysicalInspection}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Port Weighbridge Scale Card */}
        <div className={`rounded-2xl border p-5 transition shadow-lg ${
          isWeightAlert
            ? 'bg-amber-950/20 border-amber-500/40 shadow-amber-950/20'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${
                isWeightAlert
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">{t.scaleSlip}</h3>
                <span className={`text-[11px] font-semibold ${
                  isWeightAlert ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {isWeightAlert ? 'DISCREPANCIA DE BÁSCULA' : 'PESAJE CONFORME (<1% TOLERANCIA)'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              PONT-BASCULE #04
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Peso en Báscula Real:</span>
              <span className={`font-bold text-sm ${isWeightAlert ? 'text-amber-300' : 'text-slate-200'}`}>
                {mission.scaleWeighbridgeWeightKg.toLocaleString()} KG
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Peso Bruto B/L / Packing:</span>
              <span className="text-slate-200 font-bold">{mission.packingList.declaredGrossWeightKg.toLocaleString()} KG</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">Diferencia Neta:</span>
              <span className={`font-bold ${isWeightAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                {weightDiscrepancyKg > 0 ? `+${weightDiscrepancyKg.toLocaleString()}` : weightDiscrepancyKg.toLocaleString()} KG
              </span>
            </div>
          </div>

          {/* Action Trigger for Weighbridge */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onExecuteAction('REWEIGH', 'Repesage Officiel de Contrôle', 500)}
              disabled={executedActions.includes('REWEIGH')}
              className={`w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                executedActions.includes('REWEIGH')
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-900/30'
              }`}
            >
              {executedActions.includes('REWEIGH') ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.actionCompleted} (Segundo Pesaje Hecho)</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  <span>{t.requestReweigh}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. DUM Rectification & Legal Contingency Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{t.rectifyDumDraft}</h3>
                  <span className="text-[11px] font-semibold text-cyan-400">
                    PORTNET DECLARATION ENGINE
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {mission.dumDraft.dumNumber}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 mb-4 leading-relaxed">
              Si detecta errores de clasificación arancelaria ADIL o discrepancias de peso, puede emitir una DUM Rectificativa antes de la liquidación definitiva.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => onNavigateToTab('get_accuracy')}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>{t.tabGetAccuracy}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contingency Action Center */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">{t.takeAction}</h3>
          </div>
          <span className="text-xs text-slate-400">
            Acciones ejecutadas: <strong className="text-emerald-400">{executedActions.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onExecuteAction('REWEIGH', 'Repesage Officiel', 500)}
            disabled={executedActions.includes('REWEIGH')}
            className={`p-3 rounded-xl border text-start transition cursor-pointer ${
              executedActions.includes('REWEIGH')
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">500 MAD</span>
            </div>
            <div className="font-bold text-xs">{t.requestReweigh}</div>
            <div className="text-[10px] text-slate-400 mt-1">Verifica tara y peso bruto real en báscula.</div>
          </button>

          <button
            onClick={() => onExecuteAction('PHYSICAL_INSPECTION', 'Visite Douanière (Écor)', 1200)}
            disabled={executedActions.includes('PHYSICAL_INSPECTION')}
            className={`p-3 rounded-xl border text-start transition cursor-pointer ${
              executedActions.includes('PHYSICAL_INSPECTION')
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Eye className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">1,200 MAD</span>
            </div>
            <div className="font-bold text-xs">{t.orderPhysicalInspection}</div>
            <div className="text-[10px] text-slate-400 mt-1">Apertura física de contenedor y recuento.</div>
          </button>

          <button
            onClick={() => onExecuteAction('PAY_GUARANTEE', 'Dépôt de Caution Provisoire', 5000)}
            disabled={executedActions.includes('PAY_GUARANTEE')}
            className={`p-3 rounded-xl border text-start transition cursor-pointer ${
              executedActions.includes('PAY_GUARANTEE')
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">5,000 MAD</span>
            </div>
            <div className="font-bold text-xs">{t.payGuaranteeDeposit}</div>
            <div className="text-[10px] text-slate-400 mt-1">Evita costes de demurrage durante litigio.</div>
          </button>

          <button
            onClick={() => onExecuteAction('REQUEST_SAMPLE', 'Échantillonnage Laboratoire ONSSA', 1800)}
            disabled={executedActions.includes('REQUEST_SAMPLE')}
            className={`p-3 rounded-xl border text-start transition cursor-pointer ${
              executedActions.includes('REQUEST_SAMPLE')
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">1,800 MAD</span>
            </div>
            <div className="font-bold text-xs">{t.requestOnssaSample}</div>
            <div className="text-[10px] text-slate-400 mt-1">Análisis microbiológico y fitosanitario.</div>
          </button>
        </div>
      </div>
    </div>
  );
};
