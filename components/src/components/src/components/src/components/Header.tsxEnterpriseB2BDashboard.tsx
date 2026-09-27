import React, { useState } from 'react';
import { 
  Users, TrendingUp, AlertOctagon, FileCheck, Building2, 
  PlusCircle, ShieldCheck, Download, Search, CheckCircle2, 
  XCircle, BarChart3, UploadCloud, Globe, ArrowUpRight
} from 'lucide-react';

// Tipos para el Dashboard B2B
interface TeamMember {
  id: string;
  name: string;
  role: string;
  missionsCompleted: number;
  accuracyRate: number; // Porcentaje
  riskIndex: 'LOW' | 'MEDIUM' | 'HIGH';
  lastActive: string;
}

interface AgencyMetrics {
  totalMissionsCompleted: number;
  averageScore: number;
  estimatedSavingsMad: number;
  frequentErrors: { category: string; percentage: number }[];
}

export default function EnterpriseB2BDashboard() {
  const [activeView, setActiveView] = useState<'METRICS' | 'TEAM' | 'MISSION_CREATOR' | 'AUDIT_LOGS'>('METRICS');
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'fr' | 'ar' | 'en'>('es');
  const [searchQuery, setSearchQuery] = useState('');
  const isRtl = selectedLanguage === 'ar';

  // Datos de prueba para el Dashboard B2B
  const metrics: AgencyMetrics = {
    totalMissionsCompleted: 142,
    averageScore: 885,
    estimatedSavingsMad: 245000.00,
    frequentErrors: [
      { category: 'Clasificación HS-10 (Chatarra / Químicos)', percentage: 42 },
      { category: 'Discrepancia Peso BL vs Packing List', percentage: 28 },
      { category: 'Omisión de Controles MCINET / ONSSA', percentage: 18 },
      { category: 'Ajustes de Valor en Aduana (Incoterms)', percentage: 12 }
    ]
  };

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Youssef El Amrani', role: 'Transitário Senior', missionsCompleted: 45, accuracyRate: 96, riskIndex: 'LOW', lastActive: 'Hoy, 10:15' },
    { id: '2', name: 'Sofia Benjelloun', role: 'Auxiliar de Tránsito', missionsCompleted: 28, accuracyRate: 82, riskIndex: 'MEDIUM', lastActive: 'Ayer, 16:40' },
    { id: '3', name: 'Karim Tazi', role: 'Especialista Import', missionsCompleted: 39, accuracyRate: 91, riskIndex: 'LOW', lastActive: 'Hoy, 09:00' },
    { id: '4', name: 'Amina Alami', role: 'Aprendiz / Junior', missionsCompleted: 12, accuracyRate: 68, riskIndex: 'HIGH', lastActive: 'Hace 3 días' }
  ];

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-[calc(100vh-140px)] bg-slate-950 text-slate-100 font-sans rounded-xl border border-slate-800 overflow-hidden ${isRtl ? 'font-[Cairo,sans-serif]' : ''}`}>
      
      {/* HEADER SUPERIOR B2B */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Building2 className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-slate-100">MAROC LOGISTICS & TRANSIT S.A.</h1>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">B2B ENTERPRISE TENANT</span>
            </div>
            <p className="text-xs text-slate-400">Panel de Control Ejecutivo & Gestión de Talentos Aduaneros (PortNet / ADII Compliance)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Selector de Idioma */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-xs">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
              aria-label="Language selector"
            >
              <option value="es" className="bg-slate-900">Español</option>
              <option value="fr" className="bg-slate-900">Français</option>
              <option value="ar" className="bg-slate-900">العربية (RTL)</option>
              <option value="en" className="bg-slate-900">English</option>
            </select>
          </div>

          <button 
            onClick={() => setActiveView('MISSION_CREATOR')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-950/50"
          >
            <PlusCircle className="w-4 h-4" /> Crear Misión Corporativa
          </button>
        </div>
      </header>

      {/* NAVEGACIÓN B2B */}
      <nav className="bg-slate-900/60 border-b border-slate-800 px-6 sm:px-8 flex gap-2 sm:gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveView('METRICS')}
          className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${activeView === 'METRICS' ? 'border-cyan-500 text-cyan-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <BarChart3 className="w-4 h-4" /> Métricas & Análisis de Riesgo
        </button>
        <button 
          onClick={() => setActiveView('TEAM')}
          className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${activeView === 'TEAM' ? 'border-cyan-500 text-cyan-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Users className="w-4 h-4" /> Equipo & Evaluaciones ({teamMembers.length})
        </button>
        <button 
          onClick={() => setActiveView('MISSION_CREATOR')}
          className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${activeView === 'MISSION_CREATOR' ? 'border-cyan-500 text-cyan-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <UploadCloud className="w-4 h-4" /> Real-to-Mission Studio (OCR Ingest)
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-6 sm:p-8">

        {/* VISTA 1: MÉTRICAS GENERALES */}
        {activeView === 'METRICS' && (
          <div className="space-y-8">
            
            {/* CARDS KPIS PRINCIPALES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 font-mono block">OPERACIONES EVALUADAS</span>
                <div className="text-2xl font-black text-slate-100 font-mono">{metrics.totalMissionsCompleted} DUMs</div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +14% este mes
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 font-mono block">PRECISIÓN MEDIA AGENCIA</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">{metrics.averageScore} / 1000 PTS</div>
                <span className="text-[10px] text-slate-400">Nivel General: Especialista Aduanero</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 font-mono block">RIESGO FINANCIERO EVITADO</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">{metrics.estimatedSavingsMad.toLocaleString()} MAD</div>
                <span className="text-[10px] text-slate-400">Estimación por sanciones previas ADII</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 font-mono block">ÍNDICE DE INCUMPLIMIENTO</span>
                <div className="text-2xl font-black text-amber-400 font-mono">11.4%</div>
                <span className="text-[10px] text-amber-400">Principal causa: Ficha técnica ausente</span>
              </div>
            </div>

            {/* DESGLOSE DE ERRORES MÁS FRECUENTES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <AlertOctagon className="text-amber-400 w-4 h-4" /> Distribución de Deficiencias Detectadas en el Equipo
                </h3>
                <div className="space-y-4 pt-2">
                  {metrics.frequentErrors.map((err, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{err.category}</span>
                        <span className="text-cyan-400 font-bold">{err.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${err.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400 w-4 h-4" /> Homologación OEA / ISO
                  </h3>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    Los informes acumulados certifican que el <strong className="text-slate-200">85% de la plantilla</strong> cumple con las exigencias de auditoría previa exigidas por la ADII y PortNet para Operador Económico Autorizado (OEA-Simplificaciones Aduaneras).
                  </p>
                </div>
                <button className="w-full py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all">
                  <Download className="w-4 h-4" /> Exportar Informe Auditoría (PDF)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* VISTA 2: GESTIÓN DE EQUIPO Y EVALUACIÓN */}
        {activeView === 'TEAM' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Users className="text-cyan-400 w-4 h-4" /> Evaluación Individual de Operadores Aduaneros
              </h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute start-3 top-2.5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar empleado o rol..." 
                  className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-3 text-start">EMPLEADO</th>
                    <th className="py-3 text-start">ROL</th>
                    <th className="py-3 text-center">MISIONES</th>
                    <th className="py-3 text-center">PRECISIÓN (%)</th>
                    <th className="py-3 text-center">NIVEL DE RIESGO</th>
                    <th className="py-3 text-end">ÚLTIMA ACTIVIDAD</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-semibold text-slate-200">{m.name}</td>
                      <td className="py-3 text-slate-400 font-mono">{m.role}</td>
                      <td className="py-3 text-center font-mono">{m.missionsCompleted}</td>
                      <td className="py-3 text-center font-mono font-bold text-cyan-400">{m.accuracyRate}%</td>
                      <td className="py-3 text-center">
                        {m.riskIndex === 'LOW' && <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-bold">BAJO</span>}
                        {m.riskIndex === 'MEDIUM' && <span className="px-2.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded text-[10px] font-bold">MEDIO</span>}
                        {m.riskIndex === 'HIGH' && <span className="px-2.5 py-0.5 bg-rose-950 text-rose-400 border border-rose-800 rounded text-[10px] font-bold">ALTO</span>}
                      </td>
                      <td className="py-3 text-end text-slate-400 font-mono">{m.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA 3: REAL-TO-MISSION STUDIO (INGESTA OCR) */}
        {activeView === 'MISSION_CREATOR' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 mb-2">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Real-to-Mission Studio (Conversión OCR a Misión)</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">Suba una factura comercial o Bill of Lading en PDF para generar un escenario de simulación personalizado para su equipo.</p>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 p-8 rounded-xl text-center bg-slate-950/50 cursor-pointer transition-all space-y-3">
              <FileCheck className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300 font-mono">Arrastre archivos PDF (Factura, Packing List, BL) o haga clic para examinar</p>
              <span className="text-[10px] text-slate-500 block">Soporta documentos en Español, Francés, Árabe o Inglés</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-3">
              <span className="font-bold text-cyan-400 block">CONFIGURACIÓN DE RETO INTELIGENTE (AI INJECTION):</span>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-cyan-600 focus:ring-0" />
                Anonimizar datos sensibles de clientes y proveedores automáticamente.
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-cyan-600 focus:ring-0" />
                Inyectar una trampa documental leve (discrepancia de peso o Incoterm) para evaluar al empleado.
              </label>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase rounded-lg shadow-lg shadow-cyan-950/50 transition-all">
              Procesar Documentos y Generar Misión
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
