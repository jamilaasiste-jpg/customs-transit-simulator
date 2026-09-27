import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Anchor, 
  CheckCircle2, 
  Clock, 
  Coins, 
  X, 
  Loader2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { InterfaceLanguage, CustomsMission } from '../types';
import { PRESET_CUSTOMS_MISSIONS } from '../data/presetMissions';
import { translations } from '../i18n/translations';

interface MissionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: InterfaceLanguage;
  currentMissionId: string;
  onSelectMission: (mission: CustomsMission) => void;
}

export const MissionSelectorModal: React.FC<MissionSelectorModalProps> = ({
  isOpen,
  onClose,
  uiLang,
  currentMissionId,
  onSelectMission,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiMission = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: 'MEDIUM',
          port: 'TANGER_MED',
          language: uiLang,
        }),
      });
      const newMission = await res.json();
      onSelectMission(newMission);
      onClose();
    } catch (e) {
      console.error("Mission generation error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{t.activeMissions}</h2>
              <p className="text-xs text-slate-400">Escenarios de simulación aduanera oficial en Marruecos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Missions List */}
        <div className="space-y-3">
          {PRESET_CUSTOMS_MISSIONS.map((mission) => {
            const isCurrent = mission.id === currentMissionId;
            const diffLevel = mission.level || mission.difficulty || 'inspector';
            const timeLimit = mission.timeLimitMinutes || Math.round((mission.demurrageTimerSeconds || 300) / 60);
            return (
              <div
                key={mission.id}
                onClick={() => {
                  onSelectMission(mission);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {mission.portOfEntry.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100 mt-1.5">{mission.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    diffLevel === 'director' || diffLevel === 'HARD' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {diffLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans mb-3">
                  {mission.storyContext || mission.description}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {timeLimit} min
                    </span>
                    <span>CIF: {mission.invoice.totalInvoiceAmount.toLocaleString()} {mission.invoice.currency}</span>
                  </div>
                  {isCurrent ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Activa
                    </span>
                  ) : (
                    <span className="text-cyan-400 flex items-center gap-1 hover:underline">
                      Seleccionar <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Generate AI Mission Button */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={handleGenerateAiMission}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando nuevo escenario aduanero con Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERAR NUEVA MISIÓN ADUANERA ALEATORIA CON IA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
