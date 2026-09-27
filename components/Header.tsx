import React from 'react';
import { 
  Shield, 
  Anchor, 
  Globe2, 
  Volume2, 
  VolumeX, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Award, 
  Sparkles,
  Layers,
  Search,
  Radio,
  SlidersHorizontal,
  Bot,
  FileSpreadsheet,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { InterfaceLanguage, DocumentLanguage, CustomsMission } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  uiLang: InterfaceLanguage;
  setUiLang: (lang: InterfaceLanguage) => void;
  docLang: DocumentLanguage;
  setDocLang: (lang: DocumentLanguage) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentMission: CustomsMission;
  demurrageSecondsLeft: number;
  accruedPenaltiesMAD: number;
  playerXP: number;
  playerScore: number;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenRealToMission: () => void;
  onSelectMissionPrompt: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  uiLang,
  setUiLang,
  docLang,
  setDocLang,
  activeTab,
  setActiveTab,
  currentMission,
  demurrageSecondsLeft,
  accruedPenaltiesMAD,
  playerXP,
  playerScore,
  soundEnabled,
  setSoundEnabled,
  onOpenRealToMission,
  onSelectMissionPrompt,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankName = () => {
    if (playerXP >= 3000) return t.levelDirector;
    if (playerXP >= 1000) return t.levelInspector;
    return t.levelCadet;
  };

  const navTabs = [
    { id: 'overview', label: t.tabOverview, icon: Anchor },
    { id: 'control_tower', label: t.tabControlTower, icon: Radio, badge: currentMission.discrepancies.length > 0 },
    { id: 'doc_viewer', label: t.tabDocViewer, icon: FileText },
    { id: 'get_accuracy', label: t.tabGetAccuracy, icon: CheckCircle2, highlight: true },
    { id: 'adil_classifier', label: t.tabAdilClassifier, icon: Search },
    { id: 'customs_ai', label: t.tabCustomsAI, icon: Bot },
    { id: 'real_to_mission', label: t.tabRealToMission, icon: Sparkles },
    { id: 'enterprise_b2b', label: t.tabEnterpriseB2B, icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Telemetry & Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60">
        
        {/* Brand & System Identifier */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30">
            <Shield className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-wider text-slate-100 font-sans">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.enterpriseBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Live PortNet Countdown, Demurrage & Stats */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs">
          
          {/* Mission Demurrage Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono transition-colors ${
            demurrageSecondsLeft < 120 
              ? 'bg-rose-950/60 border-rose-600/60 text-rose-300 animate-pulse' 
              : 'bg-slate-800/80 border-slate-700 text-amber-300'
          }`}>
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-sans tracking-wide leading-none">{t.demurrageTimer}</span>
              <span className="font-bold text-sm leading-tight">{formatTime(demurrageSecondsLeft)}</span>
            </div>
            {accruedPenaltiesMAD > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                +{accruedPenaltiesMAD.toLocaleString()} MAD
              </span>
            )}
          </div>

          {/* Player Rank & Accuracy XP */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
            <Award className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide leading-none">{t.reputation}</div>
              <div className="font-bold text-emerald-400 leading-tight flex items-center gap-1.5">
                <span>{getRankName()}</span>
                <span className="text-xs text-slate-400 font-normal">({playerXP} XP)</span>
              </div>
            </div>
          </div>

          {/* Mission Switcher Button */}
          <button
            onClick={onSelectMissionPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition shadow-sm cursor-pointer"
            title="Cambiar misión de despacho"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium truncate max-w-[120px] sm:max-w-[180px]">
              {currentMission.portOfEntry.replace('_', ' ')}
            </span>
          </button>

          {/* Language Switchers */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
            <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {(['es', 'fr', 'ar', 'en'] as InterfaceLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setUiLang(lang)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition ${
                  uiLang === lang
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Audio FX Toggle */}
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Efectos de sonido"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? tab.highlight 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700 shadow'
                    : tab.highlight
                      ? 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive && tab.highlight ? 'text-slate-950' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
