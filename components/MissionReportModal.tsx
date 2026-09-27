import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  Layers,
  Scale,
  X
} from 'lucide-react';
import { InterfaceLanguage, CustomsMission, PlayerCustomsDecision } from '../types';
import { translations } from '../i18n/translations';

interface MissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: InterfaceLanguage;
  mission: CustomsMission;
  playerDecision: PlayerCustomsDecision;
  demurrageSecondsLeft: number;
  accruedPenaltiesMAD: number;
  onRestartMission: () => void;
  onNextMission: () => void;
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({
  isOpen,
  onClose,
  uiLang,
  mission,
  playerDecision,
  demurrageSecondsLeft,
  accruedPenaltiesMAD,
  onRestartMission,
  onNextMission,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';

  if (!isOpen) return null;

  // Calculate Accuracy and Score
  const totalMissionDiscrepancies = mission.discrepancies.length;
  const correctlyDetected = playerDecision.detectedDiscrepancies.filter(id => 
    mission.discrepancies.some(d => d.id === id)
  ).length;

  const falsePositives = playerDecision.detectedDiscrepancies.filter(id =>
    !mission.discrepancies.some(d => d.id === id)
  ).length;

  let accuracyScore = 100;
  if (totalMissionDiscrepancies > 0) {
    accuracyScore = Math.max(0, Math.round((correctlyDetected / totalMissionDiscrepancies) * 100 - (falsePositives * 15)));
  }

  // Determine Grade
  let grade = 'A+';
  let gradeColor = 'text-emerald-400';
  if (accuracyScore < 50) {
    grade = 'F';
    gradeColor = 'text-rose-500';
  } else if (accuracyScore < 70) {
    grade = 'C';
    gradeColor = 'text-amber-500';
  } else if (accuracyScore < 85) {
    grade = 'B';
    gradeColor = 'text-cyan-400';
  } else if (accuracyScore < 95) {
    grade = 'A';
    gradeColor = 'text-emerald-400';
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header / Certificate Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">{t.auditReportTitle}</h2>
              <p className="text-xs text-slate-400">Royaume du Maroc &bull; Administration des Douanes et Impôts Indirects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Certificate Card */}
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-300 relative overflow-hidden font-sans">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-slate-900" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Top Official Morocco Customs Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">ROYAUME DU MAROC</h3>
              <h2 className="text-base font-black uppercase text-slate-900 mt-0.5">ADMINISTRATION DES DOUANES ET IMPÔTS INDIRECTS (ADII)</h2>
              <p className="text-[11px] font-mono text-slate-600 mt-1">PORTNET &bull; GUICHET UNIQUE NATIONAL DU COMMERCE EXTÉRIEUR</p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded">
                ATTESTATION DE CONTRÔLE ET AUDIT DE DÉDOUANEMENT
              </div>
            </div>

            {/* Core Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.officialMoroccanAuditScore}</span>
                <span className="text-2xl font-black font-mono text-slate-900">{accuracyScore}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.verdictLabel}</span>
                <span className={`text-2xl font-black font-mono ${grade === 'F' ? 'text-rose-600' : 'text-emerald-700'}`}>{grade}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.detectedIssues}</span>
                <span className="text-sm font-bold font-mono text-emerald-700 mt-1 block">{correctlyDetected} / {mission.discrepancies.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.penaltiesAccrued}</span>
                <span className="text-sm font-bold font-mono text-rose-600 mt-1 block">{accruedPenaltiesMAD.toLocaleString()} MAD</span>
              </div>
            </div>

            {/* Dossier Information Table */}
            <div className="text-xs space-y-2 border-t border-b border-slate-200 py-3 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Expediente DUM:</span>
                <strong className="text-slate-900">{mission.dumDraft.dumNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bureau Douanier:</span>
                <span>{mission.dumDraft.bureauDouane}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Importateur ICE:</span>
                <span>{mission.invoice.importerICE} ({mission.invoice.importerName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Régime Douanier Adopté:</span>
                <span className="font-bold text-emerald-800">{playerDecision.selectedRegime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Décision de Mainlevée (BAE):</span>
                <span className="font-bold text-slate-900">{playerDecision.mainleveeDecision}</span>
              </div>
            </div>

            {/* Official Stamp Block */}
            <div className="flex justify-between items-end pt-2 text-[11px] text-slate-600">
              <div>
                <p>Date de clôture: <strong>{new Date().toLocaleDateString()}</strong></p>
                <p>Visa du Vérificateur: <em>Système Expert ADII Simulator</em></p>
              </div>
              <div className="border-2 border-dashed border-emerald-800 p-3 rounded-lg text-center bg-emerald-50 text-emerald-950 font-mono font-bold">
                <p className="text-[10px] tracking-wider">CACHE DOUANE TANGER MED</p>
                <p className="text-xs text-emerald-900">MAINLEVÉE {playerDecision.mainleveeDecision === 'GRANT_MAINLEVEE' ? 'ACCORDÉE' : 'TRAITÉE'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.downloadReport}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRestartMission}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.takeAction}</span>
            </button>

            <button
              onClick={onNextMission}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.newMission}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
