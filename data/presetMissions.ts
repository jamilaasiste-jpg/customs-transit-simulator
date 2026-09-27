import { CustomsMission } from '../types';

export const PRESET_MISSIONS: CustomsMission[] = [
  {
    id: "MISSION_TM_8821_VALEO",
    title: "Expediente Tanger Med: Componentes de Automoción para Zona Franca TAC",
    level: "cadete",
    portOfEntry: "TANGER_MED",
    clientCompany: "SOMACA / RENAULT GROUP MAROC",
    importerICE: "001524398000042",
    recommendedRegime: "21_ATPA",
    scaleWeighbridgeWeightKg: 14250, // Match exact: 14,250 kg
    scannerAnomalyDetected: false,
    demurrageTimerSeconds: 420, // 7 minutes
    penaltyPerMinuteMAD: 250,
    storyContext: "Contenedor de 40 pies procedente de Valencia (España) con destino a la planta de ensamblaje en la Zona de Aceleración Industrial de Tánger. El declarante solicita régimen ATPA con suspensión de aranceles.",
    resolutionExplanation: "Para piezas destinadas a transformación industrial con posterior reexportación de vehículos ensamblados, el régimen correcto es ATPA (Régimen 21). Exige certificado de conformidad MCINET NM.",
    items: [
      {
        id: "ITM_01",
        description: "Radiadores de refrigeración de agua en aluminio para turismos",
        quantity: 450,
        unit: "U",
        unitPrice: 85.0,
        totalPrice: 38250.0,
        declaredHsCode: "8708.91.90.00",
        correctHsCode: "8708.91.90.00",
        distractorHsCodes: ["8419.50.00.00", "7616.99.90.00"],
        ddiRate: 0.175,
        tvaRate: 0.20,
        tpRate: 0.0025,
        isMcinetRequired: true,
        isOnssaRequired: false,
        originCountry: "ES",
        preferentialDutyEligible: true
      },
      {
        id: "ITM_02",
        description: "Válvulas termostáticas de regulación térmica para motor",
        quantity: 900,
        unit: "U",
        unitPrice: 22.0,
        totalPrice: 19800.0,
        declaredHsCode: "8481.80.30.00",
        correctHsCode: "8481.80.30.00",
        distractorHsCodes: ["8409.91.00.00", "9032.10.00.00"],
        ddiRate: 0.025,
        tvaRate: 0.20,
        tpRate: 0.0025,
        isMcinetRequired: true,
        isOnssaRequired: false,
        originCountry: "ES",
        preferentialDutyEligible: true
      }
    ],
    invoice: {
      invoiceNumber: "INV-VAL-2026-9041",
      date: "2026-09-18",
      supplierName: "VALEO THERMAL SYSTEMS ESPAÑA S.A. (Martorelles, Barcelona)",
      supplierAddress: "Polígono Industrial Can Roca, Carrer de la Verneda, 08107 Barcelona",
      importerName: "SOMACA - SOCIETE MAROCAINE DE CONSTRUCTIONS AUTOMOBILES",
      importerAddress: "Km 12, Route de Rabat, Ain Sebaa, Casablanca",
      importerICE: "001524398000042",
      importerIF: "01084532",
      incoterm: "CIF TANGER MED",
      currency: "EUR",
      exchangeRateToMAD: 10.85,
      totalInvoiceAmount: 58050.0,
      freightCost: 2200.0,
      insuranceCost: 450.0,
      suggestedRegimeHint: "Régimen ATPA (21) - Piezas para ensamblaje automovilístico en Marruecos."
    },
    packingList: {
      docNumber: "PL-VAL-9041",
      date: "2026-09-18",
      containerNumber: "MRKU-948102-4",
      sealNumber: "MA-TM-773192",
      packagesCount: 42,
      packageType: "Pallets Europalet Madera Tratada NIMF-15",
      declaredNetWeightKg: 12800,
      declaredGrossWeightKg: 14250,
      volumeCbm: 58.4
    },
    billOfLading: {
      blNumber: "MAEU-2026-BCN-TM-0091",
      bookingRef: "BKG-7718290",
      carrierName: "MAERSK LINE MOROCCO S.A.",
      vesselName: "MAERSK TANGER V.2609",
      voyageNumber: "2609W",
      portOfLoading: "Port of Barcelona (ESBCN)",
      portOfDischarge: "Tanger Med Port (MAPTM)",
      notifyParty: "TRANS-MAROC LOGISTICS SARL (Declarant PortNet)",
      containerNumber: "MRKU-948102-4",
      sealNumber: "MA-TM-773192",
      shippersWeightKg: 14250,
      freightPaymentStatus: "PREPAID",
      badStatus: "DELIVERED"
    },
    certificates: [
      {
        type: "EUR1",
        certificateNumber: "ES-2026-0049281",
        issuingAuthority: "Aduana de Barcelona (AEAT - Reino de España)",
        issueDate: "2026-09-18",
        status: "VALID",
        remarks: "Tratado de Libre Comercio Marruecos - Unión Europea (Acuerdo de Asociación)."
      },
      {
        type: "MCINET_COC",
        certificateNumber: "COC-MCINET-2026-8819",
        issuingAuthority: "Bureau Veritas Maroc (Délégation MCINET)",
        issueDate: "2026-09-17",
        status: "VALID",
        remarks: "Conforme a las Normas Marroquíes NM 08.0.010 de componentes de automoción."
      }
    ],
    dumDraft: {
      dumNumber: "400/2026/01/18921",
      bureauDouane: "Bureau de Tanger Med Port (400)",
      regimeDouanier: "21_ATPA",
      declarantICE: "001899321000078",
      dateEnregistrement: "2026-09-20",
      cifValueMAD: 629842.5,
      calculatedDDI: 0.0, // Exonerado bajo ATPA
      calculatedTVA: 0.0, // Suspendido bajo ATPA
      calculatedTP: 1574.6, // 0.25% TP
      totalLiquidationMAD: 1574.6,
      statutCircuit: "VERT"
    },
    discrepancies: [] // Clean mission for beginner learning
  },
  {
    id: "MISSION_CASA_4419_SOLAR",
    title: "Expediente Casablanca: Módulos Fotovoltaicos y Alerta de Escáner",
    level: "inspector",
    portOfEntry: "CASABLANCA",
    clientCompany: "NOOR RENEWABLES ATLAS SARL",
    importerICE: "002894102000089",
    recommendedRegime: "10_IMPORT_CONSOMMATION",
    scaleWeighbridgeWeightKg: 21850, // Discrepancy: declared was 20,400 kg (+1,450 kg!)
    scannerAnomalyDetected: true,
    scannerAnomalyLocation: "Pallet 18 a 22 - Zona posterior derecha (Densidad Metálica Anómala)",
    demurrageTimerSeconds: 300, // 5 minutes
    penaltyPerMinuteMAD: 450,
    storyContext: "Contenedor de 40 pies High Cube procedente de Ningbo (China) con paneles solares y convertidores. La báscula de pesaje de Casablanca arroja un sobrepeso de 1.450 kg y el escáner X-Ray de la ADII reporta anomalía en la parte posterior.",
    resolutionExplanation: "Existe una discrepancia de peso evidente y anomalía de escáner. El inspector debe ordenar una 'Visite Douanière Physique (Circuit Rouge)'. No puede otorgar Mainlevée directa. Además, los inversores fueron declarados erróneamente con la partida de paneles para eludir el 10% de DDI.",
    items: [
      {
        id: "ITM_01",
        description: "Paneles solares fotovoltaicos monocristalinos 550W (Solar Modules)",
        quantity: 680,
        unit: "U",
        unitPrice: 110.0,
        totalPrice: 74800.0,
        declaredHsCode: "8541.43.00.00",
        correctHsCode: "8541.43.00.00",
        distractorHsCodes: ["8501.31.00.00", "8541.40.10.00"],
        ddiRate: 0.025,
        tvaRate: 0.20,
        tpRate: 0.0025,
        isMcinetRequired: true,
        isOnssaRequired: false,
        originCountry: "CN",
        preferentialDutyEligible: false
      },
      {
        id: "ITM_02",
        description: "Inversores de corriente continua a alterna 50kW (Onduladores)",
        quantity: 12,
        unit: "U",
        unitPrice: 1850.0,
        totalPrice: 22200.0,
        declaredHsCode: "8541.43.00.00", // Fraud trap: declared under solar panels to pay 2.5% instead of 10%
        correctHsCode: "8504.40.80.00",
        distractorHsCodes: ["8504.40.80.00", "8504.31.00.00"],
        ddiRate: 0.10,
        tvaRate: 0.20,
        tpRate: 0.0025,
        isMcinetRequired: true,
        isOnssaRequired: false,
        originCountry: "CN",
        preferentialDutyEligible: false
      }
    ],
    invoice: {
      invoiceNumber: "INV-CH-SOLAR-2026-88",
      date: "2026-09-12",
      supplierName: "ZHEJIANG SUNSHINE ENERGY CO., LTD (Ningbo, China)",
      supplierAddress: "No. 88 Longpan Road, Hi-Tech Industrial Zone, Ningbo, China",
      importerName: "NOOR RENEWABLES ATLAS SARL",
      importerAddress: "Boulevard Zerktouni, Résidence Les Fleurs, Casablanca",
      importerICE: "002894102000089",
      importerIF: "04910283",
      incoterm: "CIF CASABLANCA",
      currency: "USD",
      exchangeRateToMAD: 10.15,
      totalInvoiceAmount: 97000.0,
      freightCost: 3800.0,
      insuranceCost: 650.0,
      suggestedRegimeHint: "Régimen 10 - Puesta a consumo directo con pago de DDI e IVA."
    },
    packingList: {
      docNumber: "PL-SOLAR-88",
      date: "2026-09-12",
      containerNumber: "CMAU-882910-1",
      sealNumber: "CN-NB-448102",
      packagesCount: 26,
      packageType: "Pallets Reforzados",
      declaredNetWeightKg: 19200,
      declaredGrossWeightKg: 20400, // Discrepancy with 21,850 kg
      volumeCbm: 68.0
    },
    billOfLading: {
      blNumber: "CMACGM-2026-NGB-CAS-994",
      bookingRef: "BKG-992104",
      carrierName: "CMA CGM MAROC S.A.",
      vesselName: "CMA CGM TANGER V.104",
      voyageNumber: "104E",
      portOfLoading: "Ningbo Port (CNNGB)",
      portOfDischarge: "Casablanca Port (MACAS)",
      notifyParty: "NOOR RENEWABLES ATLAS SARL",
      containerNumber: "CMAU-882910-1",
      sealNumber: "CN-NB-448102",
      shippersWeightKg: 20400,
      freightPaymentStatus: "PREPAID",
      badStatus: "DELIVERED"
    },
    certificates: [
      {
        type: "MCINET_COC",
        certificateNumber: "COC-MCINET-2026-4410",
        issuingAuthority: "TÜV Rheinland Maroc",
        issueDate: "2026-09-10",
        status: "VALID",
        remarks: "Certificado de conformidad para módulos fotovoltaicos."
      }
    ],
    dumDraft: {
      dumNumber: "300/2026/01/55291",
      bureauDouane: "Bureau de Casablanca Port (300)",
      regimeDouanier: "10_IMPORT_CONSOMMATION",
      declarantICE: "001994820000055",
      dateEnregistrement: "2026-09-20",
      cifValueMAD: 984550.0,
      calculatedDDI: 24613.75,
      calculatedTVA: 201832.75,
      calculatedTP: 2461.38,
      totalLiquidationMAD: 228907.88,
      statutCircuit: "ORANGE"
    },
    discrepancies: [
      {
        id: "DISC_WEIGHT_01",
        type: "WEIGHT_MISMATCH",
        title: "Discrepancia de Peso Báscula vs Declarado (+1.450 kg)",
        description: "El ticket de pesaje oficial en el puerto marca 21.850 kg mientras que el Packing List y el B/L solo declaran 20.400 kg (+7.1% de error).",
        detectedByPlayer: false,
        severity: "high",
        impactMAD: 35000,
        expectedAction: "REWEIGH"
      },
      {
        id: "DISC_SCANNER_02",
        type: "SCANNER_DENSITY_ALERT",
        title: "Alerta de Densidad en Escáner X-Ray (Rayos X)",
        description: "El informe de radioscopia de la ADII muestra bultos de alta densidad metálica no homogénea en la zona posterior.",
        detectedByPlayer: false,
        severity: "high",
        impactMAD: 50000,
        expectedAction: "PHYSICAL_INSPECTION"
      },
      {
        id: "DISC_HS_03",
        type: "HS_CODE_ERROR",
        title: "Falsa Clasificación Arancelaria de Inversores (Partida 8504.40 vs 8541.43)",
        description: "Los inversores de 50kW se clasificaron fraudulentamente bajo la partida 8541.43 (2.5% DDI) en lugar de la partida correcta 8504.40.80.00 (10% DDI), evadiendo 16.900 MAD de aranceles.",
        detectedByPlayer: false,
        severity: "high",
        impactMAD: 16900,
        expectedAction: "RECTIFY_DUM"
      }
    ]
  },
  {
    id: "MISSION_AGADIR_7720_FOOD",
    title: "Expediente Agadir: Aceite de Oliva y Control Fitosanitario ONSSA",
    level: "director",
    portOfEntry: "AGADIR",
    clientCompany: "AGRO-SOUSS EXPORT & IMPORT SA",
    importerICE: "003119028000012",
    recommendedRegime: "10_IMPORT_CONSOMMATION",
    scaleWeighbridgeWeightKg: 18600,
    scannerAnomalyDetected: false,
    demurrageTimerSeconds: 240, // 4 minutes
    penaltyPerMinuteMAD: 600,
    storyContext: "Carga agroalimentaria a granel en flexitank y bidones alimentarios que arriba al puerto de Agadir. Se trata de Aceite de Oliva con tipo arancelario máximo DDI del 40% para protección agrícola nacional, sujeto a rigurosa inspección ONSSA.",
    resolutionExplanation: "Al tratarse de aceite de oliva, la posición arancelaria marroquí aplica un DDI del 40% y exige inspección y toma de muestras microbiológicas por parte de la ONSSA. El certificado fitosanitario presentado tiene fecha de validez expirada.",
    items: [
      {
        id: "ITM_01",
        description: "Aceite de oliva virgen extra en envases de uso industrial (Extra Virgin Olive Oil)",
        quantity: 16500,
        unit: "KG",
        unitPrice: 4.80,
        totalPrice: 79200.0,
        declaredHsCode: "1509.20.00.00",
        correctHsCode: "1509.20.00.00",
        distractorHsCodes: ["1509.90.00.00", "1510.00.00.00"],
        ddiRate: 0.40,
        tvaRate: 0.10,
        tpRate: 0.0025,
        isMcinetRequired: false,
        isOnssaRequired: true,
        originCountry: "TN",
        preferentialDutyEligible: false
      }
    ],
    invoice: {
      invoiceNumber: "INV-TN-OLIVE-991",
      date: "2026-09-14",
      supplierName: "HUILES DU NORD TUNISIE SARL (Sfax, Tunisie)",
      supplierAddress: "Route de Gabès Km 3, Sfax, Tunisie",
      importerName: "AGRO-SOUSS EXPORT & IMPORT SA",
      importerAddress: "Zone Industrielle Anza, Agadir",
      importerICE: "003119028000012",
      importerIF: "08910471",
      incoterm: "CIF AGADIR",
      currency: "EUR",
      exchangeRateToMAD: 10.85,
      totalInvoiceAmount: 79200.0,
      freightCost: 2600.0,
      insuranceCost: 750.0,
      suggestedRegimeHint: "Puesta a consumo régimen 10 con control fitosanitario ONSSA."
    },
    packingList: {
      docNumber: "PL-OLIVE-991",
      date: "2026-09-14",
      containerNumber: "TGHU-771920-3",
      sealNumber: "TN-SF-881920",
      packagesCount: 1,
      packageType: "Flexitank 24.000 Litros en Contenedor 20ft",
      declaredNetWeightKg: 16500,
      declaredGrossWeightKg: 18600,
      volumeCbm: 33.0
    },
    billOfLading: {
      blNumber: "MSCU-2026-SFX-AGA-771",
      bookingRef: "BKG-881920",
      carrierName: "MSC MEDITERRANEAN SHIPPING COMPANY MAROC",
      vesselName: "MSC AGADIR V.2608",
      voyageNumber: "2608S",
      portOfLoading: "Port de Sfax (TNSFA)",
      portOfDischarge: "Port d'Agadir (MAAGA)",
      notifyParty: "AGRO-SOUSS EXPORT & IMPORT SA",
      containerNumber: "TGHU-771920-3",
      sealNumber: "TN-SF-881920",
      shippersWeightKg: 18600,
      freightPaymentStatus: "PREPAID",
      badStatus: "DELIVERED"
    },
    certificates: [
      {
        type: "PHYTOSANITARY",
        certificateNumber: "PHYTO-TN-2026-00381",
        issuingAuthority: "Direction Générale de la Protection et du Contrôle Sanitaire (Tunisie)",
        issueDate: "2026-08-01", // EXPIRED (More than 45 days ago)
        status: "EXPIRED",
        remarks: "Certificado Fitosanitario con fecha de emisión anterior a 45 días sin revalidación oficial."
      }
    ],
    dumDraft: {
      dumNumber: "500/2026/01/33910",
      bureauDouane: "Bureau d'Agadir Port (500)",
      regimeDouanier: "10_IMPORT_CONSOMMATION",
      declarantICE: "002771820000044",
      dateEnregistrement: "2026-09-20",
      cifValueMAD: 859320.0,
      calculatedDDI: 343728.0, // 40% DDI
      calculatedTVA: 120304.8, // 10% TVA
      calculatedTP: 2148.3,
      totalLiquidationMAD: 466181.1,
      statutCircuit: "ROUGE"
    },
    discrepancies: [
      {
        id: "DISC_ONSSA_CERT_01",
        type: "MISSING_CERTIFICATE",
        title: "Certificado Fitosanitario ONSSA Expirado o No Revalidado",
        description: "El certificado fitosanitario emitido en origen superó el plazo máximo de validez (más de 45 días). No se puede emitir Mainlevée sin informe favorable de muestreo microbiológico de la ONSSA Agadir.",
        detectedByPlayer: false,
        severity: "high",
        impactMAD: 45000,
        expectedAction: "REQUEST_SAMPLE"
      }
    ]
  }
];

export const PRESET_CUSTOMS_MISSIONS = PRESET_MISSIONS;
