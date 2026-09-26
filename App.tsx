import React, { useState, useEffect, useRef } from 'react';
import { 
  InterfaceLanguage, 
  DocumentLanguage, 
  CustomsMission, 
  PlayerCustomsDecision 
} from './types';
import { PRESET_CUSTOMS_MISSIONS } from './data/presetMissions';
import { translations } from './i18n/translations';

// Subcomponents
import { Header } from './components/Header';
import { LogisticsCanvas } from './components/LogisticsCanvas';
import { ControlTower } from './components/ControlTower';
import { DocumentViewer } from './components/DocumentViewer';
import { GetAccuracyAudit } from './components/GetAccuracyAudit';
import { AdilClassifier } from './components/AdilClassifier';
import { CustomsVoiceAgent } from './components/CustomsVoiceAgent';
import { RealToMissionModal } from './components/RealToMissionModal';
import { MissionReportModal } from './components/MissionReportModal';
import { MissionSelectorModal } from './components/MissionSelectorModal';
import EnterpriseB2BDashboard from './components/EnterpriseB2BDashboard';

export default function App() {
  // 1. Language & Layout State
  const [uiLang, setUiLang] = useState<InterfaceLanguage>('es');
  const [docLang, setDocLang] = useState<DocumentLanguage>('fr');

  // 2. Mission State
  const [currentMission, setCurrentMission] = useState<CustomsMission>(PRESET_CUSTOMS_MISSIONS[0]);
  const [demurrageSecondsLeft, setDemurrageSecondsLeft] = useState<number>(PRESET_CUSTOMS_MISSIONS[0].demurrageTimerSeconds || 420);
  const [accruedPenaltiesMAD, setAccruedPenaltiesMAD] = useState<number>(0);

  // 3. UI Navigation & Highlight State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [highlightDiscrepancies, setHighlightDiscrepancies] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 4. Player Progression & Decision State
  const [playerXP, setPlayerXP] = useState<number>(450);
  const [playerScore, setPlayerScore] = useState<number>(100);
  const [executedActions, setExecutedActions] = useState<string[]>([]);
  const [playerDecision, setPlayerDecision] = useState<PlayerCustomsDecision>({
    missionId: PRESET_CUSTOMS_MISSIONS[0].id,
    triageStatus: 'NEEDS_REVIEW',
    selectedRegime: '10_IMPORT_CONSOMMATION',
    detectedDiscrepancies: [],
    declaredCIF_MAD: PRESET_CUSTOMS_MISSIONS[0].dumDraft.cifValueMAD,
    calculatedTotalDuty_MAD: PRESET_CUSTOMS_MISSIONS[0].dumDraft.totalLiquidationMAD,
    mainleveeDecision: 'GRANT_MAINLEVEE',
    justificationNotes: '',
  });

  // 5. Modals State
  const [isRealToMissionOpen, setIsRealToMissionOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isMissionSelectorOpen, setIsMissionSelectorOpen] = useState<boolean>(false);

  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';

  // Audio Beep Synthesizer using Web Audio API
  const playAudioCue = (type: 'beep' | 'alert' | 'success') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      // AudioContext policy fallback
    }
  };

  // Demurrage Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDemurrageSecondsLeft((prev) => {
        if (prev <= 1) {
          // Accrue penalty every minute past demurrage
          setAccruedPenaltiesMAD((p) => p + Math.round(currentMission.penaltyPerMinuteMAD / 60));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMission]);

  // Handle Switching Missions
  const handleSelectMission = (mission: CustomsMission) => {
    setCurrentMission(mission);
    setDemurrageSecondsLeft(mission.demurrageTimerSeconds || (mission.timeLimitMinutes ? mission.timeLimitMinutes * 60 : 300));
    setAccruedPenaltiesMAD(0);
    setExecutedActions([]);
    setPlayerDecision({
      missionId: mission.id,
      triageStatus: 'NEEDS_REVIEW',
      selectedRegime: '10_IMPORT_CONSOMMATION',
      detectedDiscrepancies: [],
      declaredCIF_MAD: mission.dumDraft.cifValueMAD,
      calculatedTotalDuty_MAD: mission.dumDraft.totalLiquidationMAD,
      mainleveeDecision: 'GRANT_MAINLEVEE',
      justificationNotes: '',
    });
    setActiveTab('overview');
    playAudioCue('beep');
  };

  // Handle Contingency Action execution in Control Tower
  const handleExecuteAction = (actionId: string, actionLabel: string, costMAD: number) => {
    if (executedActions.includes(actionId)) return;
    setExecutedActions((prev) => [...prev, actionId]);
    setAccruedPenaltiesMAD((prev) => prev + costMAD);
    playAudioCue('alert');
  };

  // Handle HS selection from ADIL classifier
  const handleSelectHsForProduct = (productId: string, hsCode: string, justification: string) => {
    const updatedItems = currentMission.items.map((item) => {
      if (item.id === productId) {
        return { ...item, declaredHsCode: hsCode };
      }
      return item;
    });

    setCurrentMission({
      ...currentMission,
      items: updatedItems,
    });

    setPlayerDecision((prev) => ({
      ...prev,
      justificationNotes: `${prev.justificationNotes}\n${justification}`.trim(),
    }));

    playAudioCue('success');
    setActiveTab('get_accuracy');
  };

  // Final Audit Submission
  const handleSubmitAudit = () => {
    playAudioCue('success');
    setPlayerXP((prev) => prev + 350);
    setIsReportOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Top Main Navigation & Telemetry Header */}
      <Header
        uiLang={uiLang}
        setUiLang={setUiLang}
        docLang={docLang}
        setDocLang={setDocLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentMission={currentMission}
        demurrageSecondsLeft={demurrageSecondsLeft}
        accruedPenaltiesMAD={accruedPenaltiesMAD}
        playerXP={playerXP}
        playerScore={playerScore}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenRealToMission={() => setIsRealToMissionOpen(true)}
        onSelectMissionPrompt={() => setIsMissionSelectorOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* TAB 1: OVERVIEW & FLOW CANVAS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <LogisticsCanvas
              mission={currentMission}
              uiLang={uiLang}
              onSelectNode={(tabId) => setActiveTab(tabId)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8">
                <ControlTower
                  mission={currentMission}
                  uiLang={uiLang}
                  demurrageSecondsLeft={demurrageSecondsLeft}
                  accruedPenaltiesMAD={accruedPenaltiesMAD}
                  executedActions={executedActions}
                  onExecuteAction={handleExecuteAction}
                  onNavigateToTab={(tabId) => setActiveTab(tabId)}
                />
              </div>

              <div className="lg:col-span-4">
                <CustomsVoiceAgent
                  mission={currentMission}
                  uiLang={uiLang}
                  soundEnabled={soundEnabled}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTROL TOWER */}
        {activeTab === 'control_tower' && (
          <ControlTower
            mission={currentMission}
            uiLang={uiLang}
            demurrageSecondsLeft={demurrageSecondsLeft}
            accruedPenaltiesMAD={accruedPenaltiesMAD}
            executedActions={executedActions}
            onExecuteAction={handleExecuteAction}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {/* TAB 3: DOCUMENT VIEWER */}
        {activeTab === 'doc_viewer' && (
          <DocumentViewer
            mission={currentMission}
            uiLang={uiLang}
            docLang={docLang}
            setDocLang={setDocLang}
            highlightDiscrepancies={highlightDiscrepancies}
            setHighlightDiscrepancies={setHighlightDiscrepancies}
          />
        )}

        {/* TAB 4: GET ACCURACY TRIANGULAR AUDIT */}
        {activeTab === 'get_accuracy' && (
          <GetAccuracyAudit
            mission={currentMission}
            uiLang={uiLang}
            playerDecision={playerDecision}
            setPlayerDecision={setPlayerDecision}
            onSubmitAudit={handleSubmitAudit}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {/* TAB 5: ADIL CLASSIFIER */}
        {activeTab === 'adil_classifier' && (
          <AdilClassifier
            mission={currentMission}
            uiLang={uiLang}
            onSelectHsForProduct={handleSelectHsForProduct}
          />
        )}

        {/* TAB 6: CUSTOMS AI VOICE AGENT */}
        {activeTab === 'customs_ai' && (
          <div className="max-w-4xl mx-auto">
            <CustomsVoiceAgent
              mission={currentMission}
              uiLang={uiLang}
              soundEnabled={soundEnabled}
              onMissionLoaded={(m) => handleSelectMission(m)}
              onNavigateToTab={(tabId) => setActiveTab(tabId)}
            />
          </div>
        )}

        {/* TAB 7: REAL-TO-MISSION (OCR INGESTION) */}
        {activeTab === 'real_to_mission' && (
          <div className="max-w-4xl mx-auto">
            <RealToMissionModal
              isOpen={true}
              onClose={() => setActiveTab('overview')}
              uiLang={uiLang}
              onMissionLoaded={(m) => handleSelectMission(m)}
            />
          </div>
        )}

        {/* TAB 8: ENTERPRISE B2B DASHBOARD */}
        {activeTab === 'enterprise_b2b' && (
          <EnterpriseB2BDashboard />
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-3 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <span>CUSTOMS TRANSIT SIMULATOR &bull; Moroccan ADII & PortNet Compliance Engine</span>
          <span className="font-mono text-emerald-400">YAFFA Schema V1.0 Active &bull; AI Studio Cloud Run</span>
        </div>
      </footer>

      {/* Real-To-Mission Modal Dialog */}
      <RealToMissionModal
        isOpen={isRealToMissionOpen}
        onClose={() => setIsRealToMissionOpen(false)}
        uiLang={uiLang}
        onMissionLoaded={(m) => handleSelectMission(m)}
      />

      {/* Mission Selector Modal */}
      <MissionSelectorModal
        isOpen={isMissionSelectorOpen}
        onClose={() => setIsMissionSelectorOpen(false)}
        uiLang={uiLang}
        currentMissionId={currentMission.id}
        onSelectMission={(m) => handleSelectMission(m)}
      />

      {/* Official Moroccan Customs Audit Report Modal */}
      <MissionReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        uiLang={uiLang}
        mission={currentMission}
        playerDecision={playerDecision}
        demurrageSecondsLeft={demurrageSecondsLeft}
        accruedPenaltiesMAD={accruedPenaltiesMAD}
        onRestartMission={() => handleSelectMission(currentMission)}
        onNextMission={() => {
          setIsReportOpen(false);
          setIsMissionSelectorOpen(true);
        }}
      />
    </div>
  );
}
