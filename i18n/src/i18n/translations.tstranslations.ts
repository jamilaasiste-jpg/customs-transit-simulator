import { InterfaceLanguage } from '../types';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  enterpriseBadge: string;
  uiLangLabel: string;
  docLangLabel: string;
  
  // Navigation tabs
  tabOverview: string;
  tabControlTower: string;
  tabDocViewer: string;
  tabGetAccuracy: string;
  tabAdilClassifier: string;
  tabCustomsAI: string;
  tabRealToMission: string;
  tabEnterpriseB2B: string;

  // Header & stats
  levelCadet: string;
  levelInspector: string;
  levelDirector: string;
  xpPoints: string;
  reputation: string;
  activeMissions: string;
  demurrageTimer: string;
  demurrageWarning: string;
  penaltiesAccrued: string;

  // Logistics Canvas
  canvasPortFlow: string;
  vesselApproaching: string;
  containerYard: string;
  scannerXray: string;
  customsGate: string;
  bondedWarehouse: string;
  portnetStatus: string;
  truckTransit: string;
  clickToInspect: string;
  portTangerMed: string;
  portCasablanca: string;

  // Control Tower
  incidentRadar: string;
  activeAlerts: string;
  scannerAlertTitle: string;
  scannerAlertDesc: string;
  scaleAlertTitle: string;
  scaleAlertDesc: string;
  demurrageUrgency: string;
  takeAction: string;
  requestReweigh: string;
  orderPhysicalInspection: string;
  rectifyDumDraft: string;
  payGuaranteeDeposit: string;
  requestOnssaSample: string;
  actionCompleted: string;

  // Document Viewer & Ingestion
  commercialInvoice: string;
  packingList: string;
  billOfLading: string;
  certificateEur1: string;
  phytosanitaryDoc: string;
  dumDeclaration: string;
  scannerImaging: string;
  scaleSlip: string;
  highlightDiscrepancies: string;
  zoomIn: string;
  zoomOut: string;
  extractedFields: string;
  ocrConfidence: string;
  supplier: string;
  importer: string;
  incoterm: string;
  currency: string;
  invoiceTotal: string;
  grossWeight: string;
  netWeight: string;
  containerSeal: string;
  carrier: string;

  // GET Accuracy Audit
  triangularAuditTitle: string;
  triangularAuditSubtitle: string;
  statusValidated: string;
  statusNeedsReview: string;
  statusFraudOrIncomplete: string;
  discrepancyDetection: string;
  detectedIssues: string;
  noIssuesFound: string;
  taxLiquidationTitle: string;
  cifValueCalculation: string;
  ddiTitle: string;
  tvaTitle: string;
  taxeParafiscale: string;
  totalCustomsDuties: string;
  regulatoryCompliance: string;
  mcinetConformity: string;
  onssaSanitary: string;
  customsRegimeSelection: string;
  regime10Desc: string;
  regime21Desc: string;
  regime30Desc: string;
  regime40Desc: string;

  // Final Action & Submission
  submitVerdict: string;
  grantMainlevee: string;
  refuseClearance: string;
  sendToVisite: string;
  demandDUMRectification: string;
  auditReportTitle: string;
  officialMoroccanAuditScore: string;
  verdictLabel: string;
  downloadReport: string;
  newMission: string;

  // ADIL Classifier
  adilSearchPlaceholder: string;
  searchAdilTariff: string;
  hsCode: string;
  designation: string;
  dutyRate: string;
  requiredDocuments: string;
  technicalJustification: string;
  selectHsCode: string;
  rgiRulesGuide: string;

  // AI Voice & Customs Agent
  voiceAssistantTitle: string;
  voiceAssistantSubtitle: string;
  listeningSTT: string;
  speakToInspector: string;
  askInspectorPlaceholder: string;
  sendQuery: string;
  speakResponse: string;
  inspectorName: string;
  quickPromptsTitle: string;
  promptAtpaHint: string;
  promptMcinetHint: string;
  promptWeightHint: string;
  promptScannerHint: string;

  // Real-to-Mission
  uploadRealDocTitle: string;
  uploadRealDocDesc: string;
  dragDropDoc: string;
  orSelectSample: string;
  sampleAutoParts: string;
  sampleOliveOil: string;
  sampleElectronics: string;
  generateMissionBtn: string;
  processingOcr: string;
  ruleEngineYaffa: string;
}

export const translations: Record<InterfaceLanguage, Translations> = {
  es: {
    appTitle: "CUSTOMS TRANSIT SIMULATOR",
    appSubtitle: "Plataforma de Simulación y Despacho Aduanero Marroquí de Alta Precisión (ADII, PortNet, ADIL, DUM)",
    enterpriseBadge: "EDICIÓN EMPRESARIAL v4.2",
    uiLangLabel: "Idioma Interfaz",
    docLangLabel: "Idioma Documental",

    tabOverview: "Flujo Logístico",
    tabControlTower: "Torre de Control",
    tabDocViewer: "Visor Documental",
    tabGetAccuracy: "Motor GET ACCURACY",
    tabAdilClassifier: "Arancel ADIL HS-10",
    tabCustomsAI: "Inspector Virtual IA & Voz",
    tabRealToMission: "Real-to-Mission (OCR)",
    tabEnterpriseB2B: "Panel B2B Enterprise",

    levelCadet: "Cadete Aduanero",
    levelInspector: "Inspector ADII",
    levelDirector: "Director de Aduanas",
    xpPoints: "Puntos de Precisión (XP)",
    reputation: "Reputación ADII",
    activeMissions: "Misión Activa",
    demurrageTimer: "Tiempo Sobrestadía PortNet",
    demurrageWarning: "¡Alerta de Demurrage!",
    penaltiesAccrued: "Penalizaciones Acumuladas",

    canvasPortFlow: "Diagrama de Tránsito Portuario en Tiempo Real",
    vesselApproaching: "Buque en Atraque",
    containerYard: "Parque de Contenedores",
    scannerXray: "Portal Escáner Rayos-X",
    customsGate: "Puerta de Aforo ADII",
    bondedWarehouse: "Almacén MEAD / Zona Franca",
    portnetStatus: "Enlace PortNet 24/7",
    truckTransit: "Salida Carretera",
    clickToInspect: "Haga clic en un nodo para inspeccionar detalles operativos",
    portTangerMed: "Tanger Med Port Hub",
    portCasablanca: "Puerto de Casablanca",

    incidentRadar: "Radar de Incidentes en Tiempo Real",
    activeAlerts: "Alertas Críticas Activas",
    scannerAlertTitle: "Discrepancia de Densidad en Escáner X-Ray",
    scannerAlertDesc: "Anomalía detectada en zona central del contenedor. Posible mercancía no declarada o sobredimensionada.",
    scaleAlertTitle: "Desviación de Báscula Portuaria",
    scaleAlertDesc: "El peso real en báscula supera en más de 800 kg el peso bruto manifestado en el Bill of Lading.",
    demurrageUrgency: "Urgencia de Retención y Costes de Demurrage",
    takeAction: "Ejecutar Acción Correctiva",
    requestReweigh: "Solicitar Segundo Pesaje",
    orderPhysicalInspection: "Ordenar Visite Douanière (Écor)",
    rectifyDumDraft: "Emitir Rectificación DUM",
    payGuaranteeDeposit: "Consignar Fianza de Garantía",
    requestOnssaSample: "Toma de Muestra ONSSA",
    actionCompleted: "Acción aplicada satisfactoriamente",

    commercialInvoice: "Factura Comercial",
    packingList: "Packing List (Lista de Empaque)",
    billOfLading: "Bill of Lading (B/L Marítimo)",
    certificateEur1: "Certificado de Origen EUR.1",
    phytosanitaryDoc: "Certificado Fitosanitario / Sanitario",
    dumDeclaration: "Borrador Declaración DUM",
    scannerImaging: "Informe Imagen Escáner",
    scaleSlip: "Ticket de Báscula de Entrada",
    highlightDiscrepancies: "Resaltar Puntos Críticos",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    extractedFields: "Metadatos Extraídos (OCR)",
    ocrConfidence: "Confianza OCR",
    supplier: "Proveedor / Exportador",
    importer: "Importador / ICE",
    incoterm: "Incoterm Pactado",
    currency: "Moneda de Transacción",
    invoiceTotal: "Total Facturado",
    grossWeight: "Peso Bruto Declarado",
    netWeight: "Peso Neto Declarado",
    containerSeal: "Nº Precinto (Seal)",
    carrier: "Naviera / Transportista",

    triangularAuditTitle: "Auditoría Cruzada Triangular (GET ACCURACY)",
    triangularAuditSubtitle: "Validación documental rigurosa: Factura ↔ Packing List ↔ Bill of Lading ↔ DUM PortNet",
    statusValidated: "VALIDADO (Sin Inconsistencias)",
    statusNeedsReview: "REQUIERE REVISIÓN (Discrepancia Menor)",
    statusFraudOrIncomplete: "DOCUMENTACIÓN INCOMPLETA / ALERTA FRAUDE",
    discrepancyDetection: "Detección de Discrepancias",
    detectedIssues: "Inconsistencias Detectadas",
    noIssuesFound: "Todos los campos concuerdan con la normativa aduanera marroquí.",
    taxLiquidationTitle: "Liquidación y Cálculo Arancelario ADII (MAD)",
    cifValueCalculation: "Base Imponible Valor CIF (MAD)",
    ddiTitle: "DDI (Droit de Douane à l'Importation)",
    tvaTitle: "TVA Importación",
    taxeParafiscale: "Taxe Parafiscale (0.25%)",
    totalCustomsDuties: "Total Liquidación Aduanera (MAD)",
    regulatoryCompliance: "Control de Organismos Reguladores",
    mcinetConformity: "MCINET (Certificado de Conformidad CoC / NM)",
    onssaSanitary: "ONSSA (Control Sanitario / Fitosanitario)",
    customsRegimeSelection: "Selección del Régimen Aduanero Aplicable",
    regime10Desc: "Régimen 10: Puesta al Consumo Directo (Pago íntegro de derechos e impuestos)",
    regime21Desc: "Régimen 21: ATPA (Admisión Temporal para Perfeccionamiento Activo con suspensión)",
    regime30Desc: "Régimen 30: Entrepôt de Douane (Almacenamiento fiscal con exención temporal)",
    regime40Desc: "Régimen 40: Tránsito Aduanero Nacional / Internacional (Garantía)",

    submitVerdict: "Emitir Decisión Aduanera Definitiva",
    grantMainlevee: "Otorgar Mainlevée (Levante)",
    refuseClearance: "Bloquear Despacho / Iniciar Contentioso",
    sendToVisite: "Enviar a Visita Física Integral (Circuit Rouge)",
    demandDUMRectification: "Exigir Rectificación DUM con Recargo",
    auditReportTitle: "Certificado de Auditoría y Dictamen Aduanero",
    officialMoroccanAuditScore: "Puntuación de Eficacia ADII",
    verdictLabel: "Dictamen Final",
    downloadReport: "Descargar Certificado Oficial",
    newMission: "Iniciar Nueva Misión",

    adilSearchPlaceholder: "Buscar por código (ej: 8708.91) o denominación (radiadores, aceite, textil)...",
    searchAdilTariff: "Consultar Nomenclatura ADIL (HS-10)",
    hsCode: "Partida Arancelaria HS-10",
    designation: "Designación de la Mercancía",
    dutyRate: "Tipo DDI / IVA / TP",
    requiredDocuments: "Exigencias Documentales",
    technicalJustification: "Justificación Técnica (Reglas RGI)",
    selectHsCode: "Asignar a la Declaración",
    rgiRulesGuide: "Reglas Generales para la Interpretación de la Nomenclatura (RGI 1 a 6)",

    voiceAssistantTitle: "Inspector Amin El Fassi (Asistente IA)",
    voiceAssistantSubtitle: "Reconocimiento de voz en tiempo real y asesoramiento experto en aduanas marroquíes",
    listeningSTT: "Escuchando su voz... Hable con claridad",
    speakToInspector: "Hablar por Micrófono",
    askInspectorPlaceholder: "Escriba o hable para consultar al inspector...",
    sendQuery: "Consultar",
    speakResponse: "Escuchar Dictamen por Voz",
    inspectorName: "Inspector Jefe ADII",
    quickPromptsTitle: "Consultas Frecuentes",
    promptAtpaHint: "¿Cuándo procede aplicar el régimen ATPA 21?",
    promptMcinetHint: "¿Qué exige el MCINET para piezas de automoción?",
    promptWeightHint: "¿Qué tolerancia de peso existe en báscula antes de levantar acta?",
    promptScannerHint: "¿Cómo proceder ante una alerta amarilla de escáner?",

    uploadRealDocTitle: "Módulo Real-to-Mission (Ingesta Documental)",
    uploadRealDocDesc: "Cargue facturas y documentos reales (PDF, JPEG, PNG) para transformarlos instantáneamente en misiones interactivas auditadas.",
    dragDropDoc: "Arrastre aquí su factura comercial o haga clic para examinar archivos",
    orSelectSample: "O seleccione un caso real preconfigurado:",
    sampleAutoParts: "Automoción Tanger Med (Valeo / Somaca)",
    sampleOliveOil: "Aceite de Oliva Extra Virgen (Meknès Agadir)",
    sampleElectronics: "Módulos Fotovoltaicos e Inversores (Noor Solar)",
    generateMissionBtn: "Generar Misión Jugable con IA",
    processingOcr: "Analizando documento mediante motor YAFFA Trade Flow...",
    ruleEngineYaffa: "Extracción y estructuración OCR garantizada según protocolo estricto YAFFA",
  },
  fr: {
    appTitle: "CUSTOMS TRANSIT SIMULATOR",
    appSubtitle: "Plateforme de Simulation et Dédouanement Marocain Haute Précision (ADII, PortNet, ADIL, DUM)",
    enterpriseBadge: "ÉDITION ENTREPRISE v4.2",
    uiLangLabel: "Langue Interface",
    docLangLabel: "Langue Documentaire",

    tabOverview: "Flux Logistique",
    tabControlTower: "Tour de Contrôle",
    tabDocViewer: "Visionneuse Documents",
    tabGetAccuracy: "Moteur GET ACCURACY",
    tabAdilClassifier: "Tarif ADIL HS-10",
    tabCustomsAI: "Inspecteur Virtuel IA & Voix",
    tabRealToMission: "Real-to-Mission (OCR)",
    tabEnterpriseB2B: "Tableau B2B Entreprise",

    levelCadet: "Cadet des Douanes",
    levelInspector: "Inspecteur ADII",
    levelDirector: "Directeur Régional ADII",
    xpPoints: "Points de Précision (XP)",
    reputation: "Réputation ADII",
    activeMissions: "Mission Active",
    demurrageTimer: "Délai Surestaries PortNet",
    demurrageWarning: "Alerte Surestaries !",
    penaltiesAccrued: "Pénalités Cumulées",

    canvasPortFlow: "Schéma du Transit Portuaire en Temps Réel",
    vesselApproaching: "Navire à Quai",
    containerYard: "Terre-plein Conteneurs",
    scannerXray: "Portique Scanner Rayons-X",
    customsGate: "Porte de Visite ADII",
    bondedWarehouse: "Entrepôt MEAD / Zone Franche",
    portnetStatus: "Passerelle PortNet Active",
    truckTransit: "Sortie Routière",
    clickToInspect: "Cliquez sur un nœud pour inspecter les détails",
    portTangerMed: "Hub Portuaire Tanger Med",
    portCasablanca: "Port de Casablanca",

    incidentRadar: "Radar des Incidents en Temps Réel",
    activeAlerts: "Alertes Critiques Actives",
    scannerAlertTitle: "Anomalie de Densité au Scanner X-Ray",
    scannerAlertDesc: "Densité suspecte au centre du conteneur. Suspicion de marchandise non déclarée.",
    scaleAlertTitle: "Écart de Poids au Pont-Bascule",
    scaleAlertDesc: "Le poids effectif dépasse de plus de 800 kg le poids brut figurant sur le B/L.",
    demurrageUrgency: "Urgence de Rétention et Frais de Surestaries",
    takeAction: "Exécuter l'Action Corrective",
    requestReweigh: "Demander un Repesage Officiel",
    orderPhysicalInspection: "Ordonner une Visite Douanière Intégrale (Écor)",
    rectifyDumDraft: "Déposer une DUM Rectificative",
    payGuaranteeDeposit: "Consigner une Caution de Garantie",
    requestOnssaSample: "Prélèvement Échantillon ONSSA",
    actionCompleted: "Action appliquée avec succès",

    commercialInvoice: "Facture Commerciale",
    packingList: "Packing List (Liste de Colisage)",
    billOfLading: "Bill of Lading (B/L)",
    certificateEur1: "Certificat d'Origine EUR.1",
    phytosanitaryDoc: "Certificat Phytosanitaire / Sanitaire",
    dumDeclaration: "Projet de DUM (Déclaration Unique)",
    scannerImaging: "Rapport Imagerie Scanner",
    scaleSlip: "Ticket de Pesée Entrée Port",
    highlightDiscrepancies: "Surligner les Incohérences",
    zoomIn: "Agrandir",
    zoomOut: "Réduire",
    extractedFields: "Métadonnées Extraites (OCR)",
    ocrConfidence: "Fiabilité OCR",
    supplier: "Fournisseur / Exportateur",
    importer: "Importateur / ICE",
    incoterm: "Incoterm",
    currency: "Devise de Transaction",
    invoiceTotal: "Total Facture",
    grossWeight: "Poids Brut Déclaré",
    netWeight: "Poids Net Déclaré",
    containerSeal: "N° Plomb (Seal)",
    carrier: "Armateur / Compagnie Maritime",

    triangularAuditTitle: "Audit Croisé Triangulaire (GET ACCURACY)",
    triangularAuditSubtitle: "Validation documentaire rigoureuse : Facture ↔ Packing List ↔ B/L ↔ DUM PortNet",
    statusValidated: "VALIDÉ (Aucune Incohérence)",
    statusNeedsReview: "NÉCESSITE RÉVISION (Écart Mineur)",
    statusFraudOrIncomplete: "DOC INCOMPLÈTE / SUSPICION FRAUDE",
    discrepancyDetection: "Détection des Divergences",
    detectedIssues: "Incohérences Détectées",
    noIssuesFound: "Tous les documents sont conformes aux règlements de l'ADII.",
    taxLiquidationTitle: "Liquidation et Calcul des Droits et Taxes (MAD)",
    cifValueCalculation: "Valeur CAF Imposable (MAD)",
    ddiTitle: "DDI (Droit de Douane à l'Importation)",
    tvaTitle: "TVA à l'Importation",
    taxeParafiscale: "Taxe Parafiscale (0,25%)",
    totalCustomsDuties: "Total Liquidation Douanière (MAD)",
    regulatoryCompliance: "Contrôle des Organismes Techniques",
    mcinetConformity: "MCINET (Certificat de Conformité CoC / NM)",
    onssaSanitary: "ONSSA (Contrôle Sanitaire / Phytosanitaire)",
    customsRegimeSelection: "Choix du Régime Douanier",
    regime10Desc: "Régime 10 : Mise à la consommation directe (Paiement immédiat)",
    regime21Desc: "Régime 21 : ATPA (Admission Temporaire pour Perfectionnement Actif avec suspension)",
    regime30Desc: "Régime 30 : Entrepôt de Douane (Stockage sous douane)",
    regime40Desc: "Régime 40 : Transit Douanier National / International",

    submitVerdict: "Émettre la Décision Douanière Finale",
    grantMainlevee: "Accorder la Mainlevée (BAE)",
    refuseClearance: "Bloquer / Procès-Verbal Contentieux",
    sendToVisite: "Basculer en Visite Physique (Circuit Rouge)",
    demandDUMRectification: "Exiger DUM Rectificative",
    auditReportTitle: "Certificat d'Audit et Jugement Douanier",
    officialMoroccanAuditScore: "Note d'Excellence ADII",
    verdictLabel: "Verdict Officiel",
    downloadReport: "Télécharger le Certificat",
    newMission: "Lancer une Nouvelle Mission",

    adilSearchPlaceholder: "Rechercher par code (ex: 8708.91) ou désignation (radiateurs, huile, textile)...",
    searchAdilTariff: "Consulter le Tarif Douanier ADIL (HS-10)",
    hsCode: "Nomenclature Tarifaire HS-10",
    designation: "Désignation des Marchandises",
    dutyRate: "Taux DDI / TVA / TP",
    requiredDocuments: "Documents Exigibles",
    technicalJustification: "Justification Technique (Règles RGI)",
    selectHsCode: "Appliquer à la Déclaration",
    rgiRulesGuide: "Règles Générales pour l'Interprétation (RGI 1 à 6)",

    voiceAssistantTitle: "Inspecteur Amin El Fassi (IA PortNet)",
    voiceAssistantSubtitle: "Reconnaissance vocale en temps réel et conseils experts de dédouanement",
    listeningSTT: "Écoute en cours... Parlez clairement",
    speakToInspector: "Parler au Micro",
    askInspectorPlaceholder: "Tapez ou parlez pour interroger l'inspecteur...",
    sendQuery: "Envoyer",
    speakResponse: "Écouter la Réponse Vocale",
    inspectorName: "Inspecteur en Chef ADII",
    quickPromptsTitle: "Requêtes Rapides",
    promptAtpaHint: "Quand appliquer le régime suspensif ATPA 21 ?",
    promptMcinetHint: "Quelles sont les normes MCINET applicables ?",
    promptWeightHint: "Quelle tolérance de pesée est admise en douane ?",
    promptScannerHint: "Quelle procédure suivre après alerte scanner ?",

    uploadRealDocTitle: "Module Real-to-Mission (Ingestion Documentaire)",
    uploadRealDocDesc: "Importez vos factures et documents réels (PDF, PNG, JPG) pour les transformer en missions jouables auditées.",
    dragDropDoc: "Glissez votre facture commerciale ou cliquez pour parcourir",
    orSelectSample: "Ou choisissez un dossier d'exemple :",
    sampleAutoParts: "Pièces Automobiles Tanger Med (Valeo / Somaca)",
    sampleOliveOil: "Huile d'Olive Vierge Extra (Export Agadir)",
    sampleElectronics: "Modules Photovoltaïques (Centrale Noor)",
    generateMissionBtn: "Générer la Mission avec IA",
    processingOcr: "Analyse OCR en cours via le moteur YAFFA...",
    ruleEngineYaffa: "Extraction et structuration selon les règles strictes YAFFA",
  },
  ar: {
    appTitle: "محاكي العبور الجمركي المغربي",
    appSubtitle: "المنصة الاحترافية لمحاكاة التخليص الجمركي وإدارة العمليات اللوجستية (ADII, PortNet, ADIL, DUM)",
    enterpriseBadge: "النسخة المؤسساتية المتقدمة v4.2",
    uiLangLabel: "لغة الواجهة",
    docLangLabel: "لغة الوثائق",

    tabOverview: "المسار اللوجستي",
    tabControlTower: "برج المراقبة",
    tabDocViewer: "عارض الوثائق",
    tabGetAccuracy: "محرك التدقيق الدقيق",
    tabAdilClassifier: "تعريفة عادل (ADIL)",
    tabCustomsAI: "المفتش الذكي والصوت",
    tabRealToMission: "تحويل الوثائق لمهام",
    tabEnterpriseB2B: "لوحة الشركات B2B",

    levelCadet: "متدرب جمركي",
    levelInspector: "مفتش جمارك معتمد",
    levelDirector: "مدير إقليمي للجمارك",
    xpPoints: "نقاط الدقة والخبرة",
    reputation: "السمعة المهنية الجمركية",
    activeMissions: "المهمة الجارية",
    demurrageTimer: "مهلة غرامات التأخير (PortNet)",
    demurrageWarning: "تحذير غرامات التأخير!",
    penaltiesAccrued: "الغرامات المترتبة",

    canvasPortFlow: "مخطط العبور المينائي المباشر",
    vesselApproaching: "السفينة في الرصيف",
    containerYard: "باحة الحاويات",
    scannerXray: "بوابة الماسح بالأشعة (Scanner)",
    customsGate: "بوابة المعاينة الجمركية",
    bondedWarehouse: "المستودع الجمركي / المنطقة الحرة",
    portnetStatus: "بوابة بورتنيت متصلة",
    truckTransit: "المغادرة عبر الشاحنات",
    clickToInspect: "انقر على أي محطة للاطلاع على تفاصيل التشغيل",
    portTangerMed: "ميناء طنجة المتوسط",
    portCasablanca: "ميناء الدار البيضاء",

    incidentRadar: "رادار الحوادث في الوقت الفعلي",
    activeAlerts: "التنبيهات العاجلة والحرجة",
    scannerAlertTitle: "إنذار تباين الكثافة في جهاز الماسح",
    scannerAlertDesc: "رصد كثافة غير اعتيادية بوسط الحاوية. احتمال وجود بضائع غير مصرح بها.",
    scaleAlertTitle: "فارق الوزن في ميزان الميناء",
    scaleAlertDesc: "الوزن الفعلي يتجاوز الوزن الإجمالي المصرح به في بوليصة الشحن بأكثر من 800 كغ.",
    demurrageUrgency: "ضغط الوقت وتكاليف الحراسة والتأخير",
    takeAction: "اتخاذ الإجراء التصحيحي",
    requestReweigh: "طلب إعادة الوزن الرسمية",
    orderPhysicalInspection: "إصدار أمر المعاينة الفعلية (Visite)",
    rectifyDumDraft: "تقديم تصريح جمركي تصحيحي (DUM)",
    payGuaranteeDeposit: "إيداع ضمانة مالية جمركية",
    requestOnssaSample: "أخذ عينات للتحليل (ONSSA)",
    actionCompleted: "تم تنفيذ الإجراء بنجاح",

    commercialInvoice: "الفاتورة التجارية",
    packingList: "قائمة التعبئة والشحن",
    billOfLading: "بوليصة الشحن البحري (B/L)",
    certificateEur1: "شهادة المنشأ التفضيلية EUR.1",
    phytosanitaryDoc: "الشهادة الصحية النباتية",
    dumDeclaration: "مسودة التصريح الموحد للبضائع (DUM)",
    scannerImaging: "تقرير فحص الأشعة السينية",
    scaleSlip: "وصل وزن الميناء",
    highlightDiscrepancies: "تمييز نقاط التناقض",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    extractedFields: "البيانات المستخرجة آلياً",
    ocrConfidence: "دقة التعرف الضوئي",
    supplier: "المزود / المصدر",
    importer: "المستورد / المعرف الموحد ICE",
    incoterm: "شرط الشحن الدولي (Incoterm)",
    currency: "عملة المعاملة",
    invoiceTotal: "إجمالي الفاتورة",
    grossWeight: "الوزن الإجمالي المصرح",
    netWeight: "الوزن الصافي المصرح",
    containerSeal: "رقم الختم الجمركي",
    carrier: "الناقل البحري / الشاحن",

    triangularAuditTitle: "التدقيق الثلاثي المتقاطع (GET ACCURACY)",
    triangularAuditSubtitle: "المطابقة الوثائقية الدقيقة: الفاتورة ↔ قائمة التعبئة ↔ بوليصة الشحن ↔ تصريح بورتنيت",
    statusValidated: "تم التحقق (مطابق تماماً)",
    statusNeedsReview: "يتطلب المراجعة (فارق بسيط)",
    statusFraudOrIncomplete: "وثائق ناقصة / اشتباه بمخالفة",
    discrepancyDetection: "كشف التناقضات والفروقات",
    detectedIssues: "الملاحظات المرصودة",
    noIssuesFound: "جميع الوثائق مطابقة لقوانين الجمارك والضرائب غير المباشرة المغربية.",
    taxLiquidationTitle: "تصفية الرسوم والضرائب الجمركية (بالدرهم)",
    cifValueCalculation: "القيمة الخاضعة للضريبة CIF (درهم)",
    ddiTitle: "رسم الاستيراد الجمركي (DDI)",
    tvaTitle: "الضريبة على القيمة المضافة (TVA)",
    taxeParafiscale: "الرسم شبه الجبائي (0.25%)",
    totalCustomsDuties: "إجمالي المستحقات الجمركية (درهم)",
    regulatoryCompliance: "مراقبة الهيئات التقنية المختصة",
    mcinetConformity: "وزارة الصناعة والتجارة (شهادة المطابقة MCINET)",
    onssaSanitary: "المكتب الوطني للسلامة الصحية (ONSSA)",
    customsRegimeSelection: "تحديد النظام الجمركي الواجب تطبيقه",
    regime10Desc: "النظام 10: الاستهلاك المباشر (أداء فوري لجميع الرسوم والضرائب)",
    regime21Desc: "النظام 21: القبول المؤقت لتحسين الصنع الفعال (ATPA مع تعليق الرسوم)",
    regime30Desc: "النظام 30: المستودع الجمركي الخاضع للمراقبة",
    regime40Desc: "النظام 40: العبور الجمركي الوطني والدولي",

    submitVerdict: "إصدار القرار الجمركي النهائي",
    grantMainlevee: "منح الإفراج ورفع اليد (Mainlevée)",
    refuseClearance: "حجز الشحنة / تحرير محضر مخالفة",
    sendToVisite: "التوجيه للمعاينة المادية (المسار الأحمر)",
    demandDUMRectification: "المطالبة بتصحيح التصريح مع غرامة",
    auditReportTitle: "شهادة التدقيق والقرار الجمركي الرسمي",
    officialMoroccanAuditScore: "معدل الكفاءة والامتثال الجمركي",
    verdictLabel: "القرار الجمركي",
    downloadReport: "تحميل التقرير الرسمي",
    newMission: "بدء مهمة جمركية جديدة",

    adilSearchPlaceholder: "البحث برمز البند (مثال: 8708.91) أو التسمية (قطع غيار، زيت، نسيج)...",
    searchAdilTariff: "استشارة التعريفة الجمركية عادل (ADIL HS-10)",
    hsCode: "رمز البند الجمركي (10 أرقام)",
    designation: "تسمية البضائع وتعريفها",
    dutyRate: "نسبة رسم الاستيراد / الضريبة / الرسم الإضافي",
    requiredDocuments: "الوثائق والشروط المطلوبة",
    technicalJustification: "التعليل الفني (القواعد العامة RGI)",
    selectHsCode: "اعتماد الرمز في التصريح",
    rgiRulesGuide: "القواعد العامة لتفسير النظام المنسق (RGI 1 إلى 6)",

    voiceAssistantTitle: "المفتش أمين الفاسي (المساعد الذكي)",
    voiceAssistantSubtitle: "التعرف الصوتي المباشر والاستشارة القانونية والتقنية في الجمارك المغربية",
    listeningSTT: "جارٍ الاستماع لصوتك... تفضل بالتحدث بوضوح",
    speakToInspector: "التحدث عبر الميكروفون",
    askInspectorPlaceholder: "اكتب أو تحدث لاستشارة المفتش...",
    sendQuery: "إرسال",
    speakResponse: "الاستماع للرد صوتياً",
    inspectorName: "رئيس مفتشي الجمارك",
    quickPromptsTitle: "استفسارات سريعة ومباشرة",
    promptAtpaHint: "متى نطبق نظام القبول المؤقت ATPA 21؟",
    promptMcinetHint: "ما هي شروط مطابقة الصناعة MCINET لقطع السيارات؟",
    promptWeightHint: "ما هي نسبة التفاوت المسموح بها في وزن الميزان؟",
    promptScannerHint: "كيف نتصرف عند ظهور تنبيه الماسح بالأشعة؟",

    uploadRealDocTitle: "وحدة تحويل الوثائق إلى مهام تفاعلية (OCR)",
    uploadRealDocDesc: "قم برفع فواتير ووثائق حقيقية لتحويلها فوراً إلى محاكاة جمركية متكاملة ومطابقة لقواعد YAFFA.",
    dragDropDoc: "اسحب الفاتورة التجارية هنا أو انقر لتصفح الملفات",
    orSelectSample: "أو اختر نموذجاً حقيقياً مُعداً مسبقاً:",
    sampleAutoParts: "أجزاء سيارات طنجة المتوسط (فاليو / سوماكا)",
    sampleOliveOil: "زيت زيتون بكر ممتاز (مكناس - أكادير)",
    sampleElectronics: "ألواح شمسية ومحولات كهروضوئية (مشروع نور)",
    generateMissionBtn: "توليد المهمة بالذكاء الاصطناعي",
    processingOcr: "جارٍ تحليل الوثيقة واستخراج البيانات عبر محرك YAFFA...",
    ruleEngineYaffa: "استخراج وتصنيف البيانات وفق المعايير الدقيقة الصارمة",
  },
  en: {
    appTitle: "CUSTOMS TRANSIT SIMULATOR",
    appSubtitle: "High-Precision Moroccan & International Customs Clearance Simulation Platform (ADII, PortNet, ADIL, DUM)",
    enterpriseBadge: "ENTERPRISE EDITION v4.2",
    uiLangLabel: "Interface Language",
    docLangLabel: "Document Language",

    tabOverview: "Logistics Flow",
    tabControlTower: "Control Tower",
    tabDocViewer: "Document Viewer",
    tabGetAccuracy: "GET ACCURACY Engine",
    tabAdilClassifier: "ADIL Tariff HS-10",
    tabCustomsAI: "AI Inspector & Voice",
    tabRealToMission: "Real-to-Mission (OCR)",
    tabEnterpriseB2B: "B2B Enterprise Dashboard",

    levelCadet: "Customs Cadet",
    levelInspector: "ADII Inspector",
    levelDirector: "Customs Director",
    xpPoints: "Accuracy Points (XP)",
    reputation: "ADII Reputation",
    activeMissions: "Active Mission",
    demurrageTimer: "PortNet Demurrage Timer",
    demurrageWarning: "Demurrage Alert!",
    penaltiesAccrued: "Accrued Penalties",

    canvasPortFlow: "Real-Time Port Transit Schematic",
    vesselApproaching: "Vessel at Berth",
    containerYard: "Container Yard",
    scannerXray: "X-Ray Scanner Gantry",
    customsGate: "ADII Inspection Gate",
    bondedWarehouse: "MEAD / Free Zone Warehouse",
    portnetStatus: "PortNet Gateway Active",
    truckTransit: "Highway Gate Out",
    clickToInspect: "Click any node to view operational telemetry",
    portTangerMed: "Tanger Med Port Hub",
    portCasablanca: "Port of Casablanca",

    incidentRadar: "Real-Time Incident Radar",
    activeAlerts: "Critical Active Alerts",
    scannerAlertTitle: "X-Ray Scanner Density Anomaly",
    scannerAlertDesc: "Suspicious density detected in container center. Suspected undeclared cargo or weight discrepancy.",
    scaleAlertTitle: "Port Weighbridge Scale Discrepancy",
    scaleAlertDesc: "Actual weighbridge weight exceeds the declared Bill of Lading gross weight by more than 800 kg.",
    demurrageUrgency: "Port Detention Urgency & Demurrage Charges",
    takeAction: "Execute Corrective Action",
    requestReweigh: "Request Official Re-Weighing",
    orderPhysicalInspection: "Order Full Physical Inspection (Visite Douanière)",
    rectifyDumDraft: "File Rectified DUM Declaration",
    payGuaranteeDeposit: "Consign Security Guarantee Deposit",
    requestOnssaSample: "Request ONSSA Lab Sample",
    actionCompleted: "Action successfully applied",

    commercialInvoice: "Commercial Invoice",
    packingList: "Packing List",
    billOfLading: "Bill of Lading (B/L)",
    certificateEur1: "EUR.1 Origin Certificate",
    phytosanitaryDoc: "Phytosanitary / Sanitary Cert",
    dumDeclaration: "Draft DUM Declaration",
    scannerImaging: "X-Ray Imaging Report",
    scaleSlip: "Port Entry Weighbridge Slip",
    highlightDiscrepancies: "Highlight Inconsistencies",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    extractedFields: "OCR Extracted Fields",
    ocrConfidence: "OCR Confidence",
    supplier: "Supplier / Exporter",
    importer: "Importer / ICE",
    incoterm: "Incoterm",
    currency: "Invoice Currency",
    invoiceTotal: "Invoice Total",
    grossWeight: "Declared Gross Weight",
    netWeight: "Declared Net Weight",
    containerSeal: "Container Seal No.",
    carrier: "Shipping Line / Carrier",

    triangularAuditTitle: "Triangular Cross-Audit (GET ACCURACY)",
    triangularAuditSubtitle: "Rigorous cross-validation: Invoice ↔ Packing List ↔ Bill of Lading ↔ PortNet DUM",
    statusValidated: "VALIDATED (No Inconsistencies)",
    statusNeedsReview: "NEEDS REVIEW (Minor Discrepancy)",
    statusFraudOrIncomplete: "INCOMPLETE / FRAUD SUSPICION",
    discrepancyDetection: "Discrepancy Detection",
    detectedIssues: "Detected Discrepancies",
    noIssuesFound: "All documents match Moroccan customs regulations.",
    taxLiquidationTitle: "ADII Duties & Tax Liquidation (MAD)",
    cifValueCalculation: "Taxable CIF Value (MAD)",
    ddiTitle: "DDI (Import Customs Duty)",
    tvaTitle: "Import VAT (TVA)",
    taxeParafiscale: "Parafiscale Tax (0.25%)",
    totalCustomsDuties: "Total Customs Liquidation (MAD)",
    regulatoryCompliance: "Technical Regulatory Compliance",
    mcinetConformity: "MCINET (Certificate of Conformity CoC / NM)",
    onssaSanitary: "ONSSA (Sanitary / Phytosanitary Control)",
    customsRegimeSelection: "Select Applicable Customs Regime",
    regime10Desc: "Regime 10: Direct Import for Consumption (Full duties & taxes paid)",
    regime21Desc: "Regime 21: ATPA (Inward Processing / Temporary Admission under duty suspension)",
    regime30Desc: "Regime 30: Customs Bonded Warehouse (MEAD with duty deferral)",
    regime40Desc: "Regime 40: National / International Customs Transit",

    submitVerdict: "Issue Final Customs Decision",
    grantMainlevee: "Grant Mainlevée (Release Order)",
    refuseClearance: "Hold Cargo / Issue Fraud Infraction",
    sendToVisite: "Route to Physical Inspection (Red Lane)",
    demandDUMRectification: "Require Rectified DUM with Surcharge",
    auditReportTitle: "Customs Audit Certificate & Verdict",
    officialMoroccanAuditScore: "ADII Compliance Score",
    verdictLabel: "Customs Verdict",
    downloadReport: "Download Official Certificate",
    newMission: "Start New Mission",

    adilSearchPlaceholder: "Search by code (e.g., 8708.91) or commodity (radiators, olive oil, solar)...",
    searchAdilTariff: "Search ADIL Tariff Database (HS-10)",
    hsCode: "HS-10 Tariff Code",
    designation: "Goods Description",
    dutyRate: "Duty Rates (DDI / TVA / TP)",
    requiredDocuments: "Mandatory Certificates",
    technicalJustification: "Technical Justification (GRI Rules)",
    selectHsCode: "Assign to Declaration",
    rgiRulesGuide: "General Rules for the Interpretation of the Harmonized System (GRI 1-6)",

    voiceAssistantTitle: "Inspector Amin El Fassi (AI Advisor)",
    voiceAssistantSubtitle: "Real-time speech recognition & expert Moroccan customs counseling",
    listeningSTT: "Listening to your voice... Please speak clearly",
    speakToInspector: "Speak with Mic",
    askInspectorPlaceholder: "Type or speak to consult the inspector...",
    sendQuery: "Consult",
    speakResponse: "Listen to Voice Verdict",
    inspectorName: "Senior ADII Inspector",
    quickPromptsTitle: "Quick Consultations",
    promptAtpaHint: "When should we apply the ATPA 21 suspensive regime?",
    promptMcinetHint: "What are MCINET conformity requirements for car parts?",
    promptWeightHint: "What weight tolerance is accepted at port weighbridge?",
    promptScannerHint: "What is the procedure following a yellow scanner alert?",

    uploadRealDocTitle: "Real-to-Mission Document Ingestion",
    uploadRealDocDesc: "Upload real invoices and logistics documents (PDF, PNG, JPG) to instantly transform them into audited simulation missions.",
    dragDropDoc: "Drop your commercial invoice here or click to browse files",
    orSelectSample: "Or select a pre-configured real mission scenario:",
    sampleAutoParts: "Automotive Components Tanger Med (Valeo / Somaca)",
    sampleOliveOil: "Extra Virgin Olive Oil (Meknès / Agadir Export)",
    sampleElectronics: "Photovoltaic Solar Modules (Noor Complex)",
    generateMissionBtn: "Generate Playable Mission with AI",
    processingOcr: "Analyzing document via YAFFA Trade Flow engine...",
    ruleEngineYaffa: "Structured OCR extraction following strict YAFFA protocols",
  },
};
