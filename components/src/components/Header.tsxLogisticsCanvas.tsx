import React, { useRef, useEffect, useState } from 'react';
import { 
  Anchor, 
  Truck, 
  Scale, 
  Radio, 
  ShieldAlert, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Info,
  Maximize2
} from 'lucide-react';
import { CustomsMission, InterfaceLanguage } from '../types';
import { translations } from '../i18n/translations';

interface LogisticsCanvasProps {
  mission: CustomsMission;
  uiLang: InterfaceLanguage;
  onSelectNode: (nodeId: string) => void;
}

export const LogisticsCanvas: React.FC<LogisticsCanvasProps> = ({
  mission,
  uiLang,
  onSelectNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = translations[uiLang];
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas Background (High-tech dark maritime terminal)
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // 1. Grid Background
      ctx.strokeStyle = '#141d2e';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Maritime Sea Zone (Left section)
      const seaWidth = width * 0.28;
      const gradSea = ctx.createLinearGradient(0, 0, seaWidth, 0);
      gradSea.addColorStop(0, '#04172e');
      gradSea.addColorStop(1, '#082547');
      ctx.fillStyle = gradSea;
      ctx.fillRect(0, 0, seaWidth, height);

      // Sea waves animation
      ctx.strokeStyle = '#0d3d75';
      ctx.lineWidth = 1.5;
      for (let y = 40; y < height; y += 45) {
        ctx.beginPath();
        for (let x = 0; x < seaWidth - 10; x += 10) {
          const waveY = y + Math.sin(x * 0.05 + time * 2) * 4;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      // 3. Port Quay Wall & Dock
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(seaWidth - 12, 0, 16, height);
      ctx.fillStyle = '#f59e0b';
      for (let y = 0; y < height; y += 30) {
        ctx.fillRect(seaWidth - 10, y, 12, 10);
      }

      // 4. Container Ship (Berth)
      const shipX = seaWidth * 0.45;
      const shipY = height * 0.48 + Math.sin(time) * 3;
      const shipW = 140;
      const shipH = 220;

      // Ship Hull
      ctx.save();
      ctx.translate(shipX, shipY);
      ctx.fillStyle = '#1e3a5f';
      ctx.beginPath();
      ctx.moveTo(-45, -shipH / 2);
      ctx.lineTo(45, -shipH / 2 + 30);
      ctx.lineTo(45, shipH / 2 - 30);
      ctx.lineTo(-45, shipH / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ship Containers Deck
      const colors = ['#0284c7', '#ea580c', '#16a34a', '#dc2626', '#eab308'];
      for (let row = -3; row <= 3; row++) {
        for (let col = -1; col <= 1; col++) {
          ctx.fillStyle = colors[Math.abs(row + col) % colors.length];
          ctx.fillRect(col * 22 - 10, row * 24 - 10, 20, 20);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1;
          ctx.strokeRect(col * 22 - 10, row * 24 - 10, 20, 20);
        }
      }
      ctx.restore();

      // 5. STS Gantry Crane Animation
      const craneX = seaWidth + 15;
      const craneY = height * 0.42;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(craneX, craneY - 80);
      ctx.lineTo(craneX - 60, craneY - 80); // Boom extending over vessel
      ctx.moveTo(craneX, craneY - 80);
      ctx.lineTo(craneX + 40, craneY - 80);
      ctx.moveTo(craneX, craneY - 80);
      ctx.lineTo(craneX, craneY + 80);
      ctx.stroke();

      // Crane trolley & cable animation
      const trolleyX = craneX - 25 + Math.sin(time * 1.5) * 30;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(trolleyX - 6, craneY - 84, 12, 8);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(trolleyX, craneY - 76);
      ctx.lineTo(trolleyX, craneY - 20);
      ctx.stroke();

      // Suspended Container
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(trolleyX - 14, craneY - 20, 28, 14);

      // 6. Logistics Flow Path Lines
      const nodes = [
        { id: 'berth', x: seaWidth + 40, y: height * 0.3, label: mission.billOfLading?.vesselName || mission.vesselName || 'Quai Tanger Med' },
        { id: 'yard', x: width * 0.42, y: height * 0.3, label: t.containerYard },
        { id: 'scale', x: width * 0.58, y: height * 0.3, label: 'Pont-Bascule', alert: mission.discrepancies.some(d => d.type === 'WEIGHT_MISMATCH') },
        { id: 'scanner', x: width * 0.72, y: height * 0.3, label: t.scannerXray, alert: mission.scannerAnomalyDetected },
        { id: 'customs', x: width * 0.85, y: height * 0.3, label: t.customsGate },
        { id: 'warehouse', x: width * 0.85, y: height * 0.75, label: t.bondedWarehouse },
      ];

      // Connecting flow conduits
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[2].x, nodes[2].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.lineTo(nodes[4].x, nodes[4].y);
      ctx.lineTo(nodes[5].x, nodes[5].y);
      ctx.stroke();

      // Glowing Data Stream Pulses
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 18]);
      ctx.lineDashOffset = -time * 30;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[2].x, nodes[2].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.lineTo(nodes[4].x, nodes[4].y);
      ctx.lineTo(nodes[5].x, nodes[5].y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 7. Animated Container Truck travelling along corridor
      const totalPath = width * 0.45;
      const truckProgress = (time * 0.4) % 1;
      const truckCurrentX = nodes[1].x + truckProgress * (nodes[4].x - nodes[1].x);
      const truckCurrentY = height * 0.3;

      ctx.save();
      ctx.translate(truckCurrentX, truckCurrentY + 18);
      // Truck Cabin
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(16, -10, 16, 20);
      // Container on Chassis
      ctx.fillStyle = mission.scannerAnomalyDetected ? '#e11d48' : '#0284c7';
      ctx.fillRect(-24, -12, 38, 24);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(-24, -12, 38, 24);
      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-16, 14, 4, 0, Math.PI * 2);
      ctx.arc(6, 14, 4, 0, Math.PI * 2);
      ctx.arc(24, 14, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 8. Scanner X-Ray Beam Effect (at scanner station)
      const scannerX = nodes[3].x;
      const scannerY = nodes[3].y;
      const beamHeight = 90;
      const beamGrad = ctx.createLinearGradient(scannerX - 25, 0, scannerX + 25, 0);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(scannerX - 25, scannerY - beamHeight / 2, 50, beamHeight);

      // Scanning Vertical Laser Sweep
      const laserY = scannerY - beamHeight / 2 + (Math.sin(time * 4) + 1) * 0.5 * beamHeight;
      ctx.strokeStyle = mission.scannerAnomalyDetected ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scannerX - 30, laserY);
      ctx.lineTo(scannerX + 30, laserY);
      ctx.stroke();

      // 9. Render Nodes on Map
      nodes.forEach((node) => {
        const isAlert = node.alert;
        const radius = isAlert ? 22 : 18;

        // Pulse ring if alert
        if (isAlert) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 6 + Math.sin(time * 6) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isAlert ? '#881337' : '#0f172a';
        ctx.fill();
        ctx.strokeStyle = isAlert ? '#f43f5e' : '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 18);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mission, uiLang]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl overflow-hidden">
      {/* Top Banner / Telemetry Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Anchor className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">{t.canvasPortFlow}</h3>
            <p className="text-xs text-slate-400">
              {mission.portOfEntry === 'TANGER_MED' ? t.portTangerMed : t.portCasablanca} &bull; Navire: <span className="text-cyan-400 font-mono font-medium">{mission.billOfLading.vesselName}</span> &bull; Conteneur: <span className="text-amber-400 font-mono font-medium">{mission.packingList.containerNumber}</span>
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-medium">{t.portnetStatus}</span>
          </div>
          {mission.scannerAnomalyDetected && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/50 text-rose-400 animate-pulse font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.scannerAlertTitle}</span>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={1000}
          height={400}
          className="w-full h-full object-cover cursor-crosshair"
          onClick={() => setSelectedNodeInfo(t.clickToInspect)}
        />

        {/* Interactive Overlay Telemetry Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700/80 text-[11px] font-mono text-slate-300 shadow-md">
            <div><strong>BÁSCULA ENTRADA:</strong> <span className={mission.scaleWeighbridgeWeightKg !== mission.packingList.declaredGrossWeightKg ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{mission.scaleWeighbridgeWeightKg.toLocaleString()} KG</span></div>
            <div><strong>MANIFESTADO B/L:</strong> {mission.packingList.declaredGrossWeightKg.toLocaleString()} KG</div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => onSelectNode('get_accuracy')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.tabGetAccuracy}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
