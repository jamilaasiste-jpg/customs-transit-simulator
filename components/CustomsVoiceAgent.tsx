import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  HelpCircle, 
  User, 
  RotateCcw,
  Radio,
  ShieldAlert,
  Paperclip,
  FileText,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Calculator,
  FileCheck,
  ShieldCheck,
  Building
} from 'lucide-react';
import { InterfaceLanguage, CustomsMission, CustomsRegimeCode, Discrepancy } from '../types';
import { translations } from '../i18n/translations';

interface CustomsVoiceAgentProps {
  mission: CustomsMission;
  uiLang: InterfaceLanguage;
  soundEnabled: boolean;
  onMissionLoaded?: (mission: CustomsMission) => void;
  onNavigateToTab?: (tabId: string) => void;
}

interface AttachedFile {
  name: string;
  size: number;
  type: string;
  base64: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  attachedFileName?: string;
  auditPayload?: {
    supplier: string;
    importer: string;
    incoterm: string;
    totalAmount: number;
    currency: string;
    cifMAD: number;
    ddiMAD: number;
    tvaMAD: number;
    tpMAD: number;
    totalDutiesMAD: number;
    incotermAlert?: string;
    itemsCount: number;
  };
}

export const CustomsVoiceAgent: React.FC<CustomsVoiceAgentProps> = ({
  mission,
  uiLang,
  soundEnabled,
  onMissionLoaded,
  onNavigateToTab,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: uiLang === 'fr' 
        ? "Bonjour Inspecteur. Je suis Amin El Fassi, conseiller expert ADII & PortNet. Vous pouvez me poser des questions juridiques ou joindre directement une facture commerciale / B/L (PDF ou image) pour audit immédiat."
        : uiLang === 'ar'
        ? "مرحبًا بك حضرة المفتش. أنا أمين الفاسي، مستشار الجمارك المغربية (ADII) وبورتنت. يمكنك طرح استفساراتك أو إرفاق فاتورة تجارية / بوليصة شحن للتدقيق الفوري."
        : uiLang === 'en'
        ? "Greetings Inspector. I am Amin El Fassi, ADII & PortNet Senior Customs Advisor. You can ask technical customs questions or attach a commercial invoice/BL (PDF or image) for instant AI auditing."
        : "Saludos, Inspector. Soy Amin El Fassi, Asesor Senior de la ADII y PortNet. Puedes hacerme consultas normativas o adjuntar directamente una factura comercial / B/L (PDF o imagen) con el clip para auditarla.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition Setup (STT)
  const handleToggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Su navegador no soporta Web Speech API para reconocimiento de voz directo. Utilice el campo de texto.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = uiLang === 'fr' ? 'fr-FR' : uiLang === 'ar' ? 'ar-MA' : uiLang === 'en' ? 'en-US' : 'es-ES';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        base64,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  // Text-To-Speech Output (TTS)
  const speakText = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = uiLang === 'fr' ? 'fr-FR' : uiLang === 'ar' ? 'ar-SA' : uiLang === 'en' ? 'en-US' : 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Send message and process document audit if attached
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if ((!query && !attachedFile) || isLoading) return;

    const currentFile = attachedFile;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query || (currentFile ? `Auditar documento adjunto: ${currentFile.name}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFileName: currentFile?.name,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setAttachedFile(null);
    setIsLoading(true);

    try {
      // If a file is attached OR the user explicitly requests an invoice analysis
      if (currentFile || query.toLowerCase().includes('factura') || query.toLowerCase().includes('invoice') || query.toLowerCase().includes('dum')) {
        const response = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentText: query,
            imageBase64: currentFile?.base64,
            mimeType: currentFile?.type || 'application/pdf',
            fileName: currentFile?.name || 'documento_aduanero.pdf',
            language: uiLang,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Error al procesar el archivo con Gemini.");
        }

        const extracted = result.data || result;
        const factura = extracted.factura || extracted.datos_extraidos || {};
        const lineas = extracted.lineasProducto || extracted.clasificacion_hs10 || [];
        const packing = extracted.packingList || {};
        const incoterm = (factura.incoterm || 'FOB').toUpperCase().trim();
        const moneda = (factura.moneda || 'EUR').toUpperCase().trim();
        
        // Tasas de cambio bancarias de referencia a Dirham Marroquí (MAD)
        const exchangeRate = moneda === 'EUR' ? 10.85 : moneda === 'USD' ? 10.05 : moneda === 'GBP' ? 12.80 : 1.0;
        const totalFactura = Number(factura.totalFactura) || 0;
        const cifValueMAD = totalFactura * exchangeRate;

        // Regla ADII Incoterms Marruecos:
        // Prohibidos directos en Territorio Nacional / Despacho a Consumo (Régimen 10) sin desglose FOB + Flete + Seguro
        const incotermsDirectosProhibidos = ["CIF", "CPT", "CIP", "DDP"];
        const hasIncotermViolation = incotermsDirectosProhibidos.some(inc => incoterm.includes(inc));
        
        const discrepancies: Discrepancy[] = [];
        let incotermAlertMsg = '';

        if (hasIncotermViolation) {
          incotermAlertMsg = `⚠️ ALERTA CRÍTICA ADII: El Incoterm ${incoterm} no es admisible directamente para despacho a consumo en territorio nacional. Se exige desglosar FOB + Flete Marítimo/Aéreo + Seguro en la DUM, salvo destino a Zona Franca (ZAI / Tanger Med Free Zone) o Régimen 021 (ATPA).`;
          discrepancies.push({
            id: 'DISC_INCOTERM_NATIONAL_TERRITORY',
            type: 'INCOTERM_VALUATION',
            title: `Incoterm ${incoterm} Inválido para Territorio Nacional sin Desglose`,
            description: `Según la normativa ADII / PortNet, el Incoterm ${incoterm} exige desglose en Valor FOB + Flete + Seguro para la declaración DUM a consumo directo.`,
            detectedByPlayer: false,
            severity: 'high',
            impactMAD: Math.round(cifValueMAD * 0.05),
            expectedAction: 'RECTIFY_DUM',
          });
        }

        // Agregar discrepancias adicionales detectadas por Gemini
        if (extracted.analisis_documental?.discrepancias && Array.isArray(extracted.analisis_documental.discrepancias)) {
          extracted.analisis_documental.discrepancias.forEach((discText: string, idx: number) => {
            if (discText && !discText.toLowerCase().includes('ninguna')) {
              discrepancies.push({
                id: `DISC_GEMINI_${idx + 1}`,
                type: 'HS_CODE_ERROR',
                title: `Observación Documental ADII #${idx + 1}`,
                description: discText,
                detectedByPlayer: false,
                severity: 'medium',
                impactMAD: 0,
                expectedAction: 'RECTIFY_DUM',
              });
            }
          });
        }

        // Liquidación Tributaria Marroquí real según subpartidas
        let computedDDI = 0;
        let computedTVA = 0;
        const computedTP = cifValueMAD * 0.0025; // 0.25% Taxe Parafiscale

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
          } else if (hsCode.startsWith('8708')) {
            ddiRate = 0.175;
          } else if (hsCode.startsWith('8481')) {
            ddiRate = 0.025;
          } else if (hsCode.startsWith('85')) {
            ddiRate = 0.10;
          } else {
            ddiRate = 0.175;
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

        // Construir misión completa actualizada para sincronizar todas las pestañas
        const newMission: CustomsMission = {
          id: `MISSION_AUDIT_${Date.now()}`,
          title: `Auditoría ADII: ${factura.proveedor || 'Proveedor Extranjero'} ➔ ${factura.importador || 'Importador Marruecos'}`,
          description: `Expediente auditado en tiempo real por Gemini AI a partir de "${currentFile?.name || factura.numeroFactura || 'Factura'}".`,
          difficulty: 'MEDIUM',
          portOfEntry: 'TANGER_MED',
          vesselName: 'CMA CGM TANGER MED EXPRESS',
          estimatedArrival: 'En Quai / Arrivé',
          timeLimitMinutes: 15,
          penaltyPerMinuteMAD: 250,
          invoice: {
            invoiceNumber: factura.numeroFactura || `FAC-${Date.now().toString().slice(-4)}`,
            date: factura.fecha || new Date().toISOString().split('T')[0],
            supplierName: factura.proveedor || 'PROVEEDOR EXTRACTO DOCUMENTO',
            supplierAddress: factura.proveedorDireccion || 'Dirección de origen',
            importerName: factura.importador || 'IMPORTADOR EXTRACTO DOCUMENTO',
            importerAddress: factura.importadorDireccion || 'Casablanca / Tanger Med, Maroc',
            importerICE: factura.importadorICE || '001524398000042',
            importerIF: factura.importadorIF || '40291033',
            incoterm: incoterm,
            currency: moneda,
            exchangeRateToMAD: exchangeRate,
            totalInvoiceAmount: totalFactura,
            freightCost: Number(factura.fleteEstimado) || Math.round(totalFactura * 0.06),
            insuranceCost: Number(factura.seguroEstimado) || Math.round(totalFactura * 0.01),
            suggestedRegimeHint: extracted.posiblesIndicacionesCustoms?.suggestedRegimeHint || extracted.regimen_aduanero_sugerido?.observaciones || 'Régimen 10 (Consumo) o Régimen 21 (ATPA)',
          },
          packingList: {
            docNumber: packing.docNumber || `PK-${factura.numeroFactura || '992'}`,
            date: factura.fecha || new Date().toISOString().split('T')[0],
            containerNumber: packing.containerNumber || 'MSCU-884910-2',
            sealNumber: packing.sealNumber || 'MA-ADII-90412',
            packageType: packing.packageType || 'Palettes Euro standards',
            packagesCount: Number(packing.packagesCount) || 36,
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
              issuingAuthority: 'Chambre de Commerce',
              issueDate: factura.fecha || new Date().toISOString().split('T')[0],
              status: 'VALID',
              remarks: 'Origine préférentielle Union Européenne certifiée conforme.',
            },
            {
              type: 'MCINET_COC',
              certificateNumber: 'MCI-CERT-88412',
              issuingAuthority: 'MCINET / Bureau Veritas Maroc',
              issueDate: factura.fecha || new Date().toISOString().split('T')[0],
              status: 'VALID',
              remarks: 'Certificat de Conformité aux Normes Marocaines NM homologué.',
            }
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
          discrepancies: discrepancies,
        };

        // Disparar sincronización global de estado en la app
        if (onMissionLoaded) {
          onMissionLoaded(newMission);
        }

        const replySummary = `📋 **Dictamen de Auditoría ADII (Extracción Real Gemini)**:
• **Proveedor**: ${newMission.invoice.supplierName}
• **Importador**: ${newMission.invoice.importerName}
• **Nº Factura / Fecha**: ${newMission.invoice.invoiceNumber} (${newMission.invoice.date})
• **Incoterm**: **${incoterm}** ${hasIncotermViolation ? '🔴 *(Incoterm observado)*' : '🟢 *(Conforme)*'}
• **Valor Total**: ${totalFactura.toLocaleString()} ${moneda} (${cifValueMAD.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD)
• **Subpartidas HS-10 asignadas**: ${itemsFormatted.map((i: any) => `${i.declaredHsCode} (${i.description})`).join(', ')}

💰 **Liquidación Aduanera Estimada (ADIL)**:
- **DDI**: ${computedDDI.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD
- **TVA (20%)**: ${computedTVA.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD
- **Taxe Parafiscale (0.25%)**: ${computedTP.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD
- **Total Derechos y Tasas**: **${totalDutiesMAD.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD**

${incotermAlertMsg ? `\n${incotermAlertMsg}\n` : ''}
Los datos han sido sincronizados automáticamente en el **Visor Documental** y en el **Motor GET ACCURACY**.`;

        const agentMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: replySummary,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          auditPayload: {
            supplier: newMission.invoice.supplierName,
            importer: newMission.invoice.importerName,
            incoterm: incoterm,
            totalAmount: totalFactura,
            currency: moneda,
            cifMAD: cifValueMAD,
            ddiMAD: computedDDI,
            tvaMAD: computedTVA,
            tpMAD: computedTP,
            totalDutiesMAD: totalDutiesMAD,
            incotermAlert: incotermAlertMsg || undefined,
            itemsCount: itemsFormatted.length,
          }
        };

        setMessages((prev) => [...prev, agentMsg]);
        speakText("Dictamen aduanero completado. Los datos han sido transferidos al visor documental y al motor de auditoría.");
      } else {
        // Conversación estándar con el asesor aduanero
        const response = await fetch('/api/customs-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            missionContext: {
              missionId: mission.id,
              port: mission.portOfEntry,
              supplier: mission.invoice.supplierName,
              importer: mission.invoice.importerName,
              cifMAD: mission.dumDraft.cifValueMAD,
              items: mission.items.map(i => ({ desc: i.description, hs: i.declaredHsCode })),
              discrepancies: mission.discrepancies.map(d => d.title),
              scannerAlert: mission.scannerAnomalyDetected,
            },
            language: uiLang,
          }),
        });

        const data = await response.json();
        const replyText = data.reply || (uiLang === 'es' ? "Respuesta recibida del centro de control aduanero." : "Réponse reçue.");

        const agentMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, agentMsg]);
        speakText(replyText);
      }
    } catch (error: any) {
      console.error("Customs agent error:", error);
      const errorMsg = error?.message || "Error procesando la solicitud con el motor de aduanas.";
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `⚠️ **Aviso del Sistema Aduanero**: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPromptChips = [
    uiLang === 'fr' ? "¿Quelle règle RGI appliquer pour ce produit?" : "¿Qué regla RGI aplicar a esta mercancía?",
    uiLang === 'fr' ? "¿Comment régulariser l'écart de poids?" : "¿Cómo resolver la discrepancia de peso?",
    uiLang === 'fr' ? "¿Ce dossier est-il éligible au régime 21 ATPA?" : "¿Es aplicable el Régimen 21 ATPA?",
    uiLang === 'fr' ? "¿Faut-il ordonner la visite physique (Circuit Rouge)?" : "¿Recomienda visita física (Circuito Rojo)?",
  ];

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Profile */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-100">{t.voiceAssistantTitle}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                INSPECTEUR ADII & PORTNET
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Asistencia legal, análisis OCR de facturas, validación de Incoterms y cálculo arancelario ADIL.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          title="Reiniciar chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {quickPromptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs whitespace-nowrap transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl h-[440px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {isAgent && (
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed shadow-md space-y-3 ${
                  isAgent
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60'
                    : 'bg-emerald-600 text-white font-medium ml-auto'
                }`}
              >
                {msg.attachedFileName && (
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/20 text-emerald-100 text-[11px] font-mono border border-white/10">
                    <Paperclip className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                    <span className="truncate">{msg.attachedFileName}</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Direct Action Navigation CTAs when audit finishes */}
                {isAgent && msg.auditPayload && onNavigateToTab && (
                  <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-2">
                    <button
                      onClick={() => onNavigateToTab('document_viewer')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t.tabDocViewer}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onNavigateToTab('get_accuracy')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.tabGetAccuracy}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                  <span>{msg.timestamp}</span>
                  {isAgent && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-slate-400 hover:text-emerald-400 cursor-pointer"
                      title="Reproducir por voz"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {!isAgent && (
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{attachedFile ? "Extrayendo y auditando factura con motor ADII / PortNet..." : "Consultando sistema experto ADII..."}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with File Attachment and Voice STT button */}
      <div className="space-y-2">
        {/* Attached File Preview Badge */}
        {attachedFile && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-850 border border-emerald-500/40 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 truncate">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-semibold text-slate-100 block truncate">{attachedFile.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {(attachedFile.size / 1024).toFixed(1)} KB &bull; {attachedFile.type}
                </span>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              title="Quitar archivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 shadow-xl flex items-center gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          {/* Attach Button with Paperclip icon */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-xl transition cursor-pointer ${
              attachedFile
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
            }`}
            title="Adjuntar factura comercial o documento (PDF, PNG, JPG)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice Mic Button */}
          <button
            onClick={handleToggleListening}
            className={`p-3 rounded-xl transition cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
            }`}
            title={isListening ? t.listeningSTT : t.speakToInspector}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              attachedFile 
                ? "Añade notas o pulsa Enviar para auditar la factura..." 
                : isListening 
                ? t.listeningSTT 
                : t.askInspectorPlaceholder || "Escribe tu consulta o adjunta una factura (PDF/JPG)..."
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={(!inputQuery.trim() && !attachedFile) || isLoading}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
