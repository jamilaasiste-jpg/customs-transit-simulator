import { AdilTariffEntry } from '../types';

export const ADIL_TARIFF_DATABASE: AdilTariffEntry[] = [
  {
    hsCode10: "8708.91.90.00",
    hsCode6: "8708.91",
    chapter: "87",
    heading: "8708",
    descriptionEs: "Radiadores de refrigeración de agua y sus partes para vehículos automóviles de las partidas 8701 a 8705",
    descriptionFr: "Radiateurs pour véhicules automobiles des n° 8701 à 8705 et leurs parties",
    descriptionAr: "مشعات تبريد (مبردات الماء) وأجزاؤها للسيارات والعربات",
    descriptionEn: "Radiators and parts thereof for motor vehicles of headings 8701 to 8705",
    ddiPercent: 17.5,
    tvaPercent: 20.0,
    tpPercent: 0.25,
    agenciesRequired: ['MCINET'],
    rgiNotes: "RGI 1 (Texte de la position 8708) & RGI 6 (Sous-position spécifique 8708.91.90.00). Contrôle obligatoire de la conformité aux normes marocaines NM.",
    unit: "U"
  },
  {
    hsCode10: "8481.80.30.00",
    hsCode6: "8481.80",
    chapter: "84",
    heading: "8481",
    descriptionEs: "Válvulas termostáticas para circuitos de refrigeración de motores térmicos",
    descriptionFr: "Clapets et vannes thermostatiques pour régulation thermique",
    descriptionAr: "صمامات حرارية لتنظيم دارات التبريد بالمحركات",
    descriptionEn: "Thermostatic valves and regulators for engine cooling systems",
    ddiPercent: 2.5,
    tvaPercent: 20.0,
    tpPercent: 0.25,
    agenciesRequired: ['MCINET'],
    rgiNotes: "RGI 1 (Texte de la position 8481) & RGI 3(a) (Position la plus spécifique pour organes de régulation).",
    unit: "U"
  },
  {
    hsCode10: "1509.20.00.00",
    hsCode6: "1509.20",
    chapter: "15",
    heading: "1509",
    descriptionEs: "Aceite de oliva virgen extra, obtenido directamente de aceitunas por procedimientos mecánicos (acidez libre ≤ 0.8%)",
    descriptionFr: "Huile d'olive vierge extra, obtenue uniquement par des procédés mécaniques",
    descriptionAr: "زيت زيتون بكر ممتاز ناتج عن عصر ميكانيكي مباشر",
    descriptionEn: "Extra virgin olive oil, obtained solely by mechanical processes",
    ddiPercent: 40.0,
    tvaPercent: 10.0,
    tpPercent: 0.25,
    agenciesRequired: ['ONSSA'],
    rgiNotes: "RGI 1 & Note de chapitre 15. Contrôle sanitaire et phytosanitaire ONSSA obligatoire avec certificat d'analyse d'acidité.",
    unit: "KG"
  },
  {
    hsCode10: "8541.43.00.00",
    hsCode6: "8541.43",
    chapter: "85",
    heading: "8541",
    descriptionEs: "Células fotovoltaicas ensambladas en módulos o paneles solares fotovoltaicos",
    descriptionFr: "Cellules photovoltaïques assemblées en modules ou constituées en panneaux",
    descriptionAr: "خلايا كهروضوئية مجمعة في وحدات أو ألواح شمسية",
    descriptionEn: "Photovoltaic cells assembled in modules or made up into panels",
    ddiPercent: 2.5,
    tvaPercent: 20.0,
    tpPercent: 0.25,
    agenciesRequired: ['MCINET', 'ANRT'],
    rgiNotes: "RGI 1 (Position 8541) et RGI 6. Taux préférentiel dans le cadre de la transition énergétique marocaine (MASEN).",
    unit: "U"
  },
  {
    hsCode10: "8504.40.80.00",
    hsCode6: "8504.40",
    chapter: "85",
    heading: "8504",
    descriptionEs: "Inversores de corriente continua a alterna (Onduladores solares de potencia > 10 kW)",
    descriptionFr: "Onduleurs statiques pour installations solaires et industrielles",
    descriptionAr: "محولات كهربائية استاتيكية (موجات شمسية صناعية)",
    descriptionEn: "Static converters (Solar inverters and power conditioning units)",
    ddiPercent: 10.0,
    tvaPercent: 20.0,
    tpPercent: 0.25,
    agenciesRequired: ['MCINET'],
    rgiNotes: "RGI 1 & RGI 3(b).",
    unit: "U"
  },
  {
    hsCode10: "3004.90.00.90",
    hsCode6: "3004.90",
    chapter: "30",
    heading: "3004",
    descriptionEs: "Medicamentos constituidos por productos mezclados o sin mezclar, preparados para usos terapéuticos dosificados",
    descriptionFr: "Médicaments constitués par des produits mélangés ou non, présentés sous forme de doses",
    descriptionAr: "أدوية علاجية مكونة من منتجات مجهزة على شكل جرعات",
    descriptionEn: "Medicaments consisting of mixed or unmixed products for therapeutic uses, in measured doses",
    ddiPercent: 2.5,
    tvaPercent: 7.0,
    tpPercent: 0.25,
    agenciesRequired: ['MIN_SANTE'],
    rgiNotes: "RGI 1 & Note légale du Chapitre 30. Autorisation de Mise sur le Marché (AMM) du Ministère de la Santé requise.",
    unit: "KG"
  },
  {
    hsCode10: "8471.30.00.00",
    hsCode6: "8471.30",
    chapter: "84",
    heading: "8471",
    descriptionEs: "Máquinas automáticas para tratamiento o procesamiento de datos, portátiles, de peso inferior o igual a 10 kg",
    descriptionFr: "Machines automatiques de traitement de l'information, portatives, d'un poids ≤ 10 kg",
    descriptionAr: "حواسيب آلية لمعالجة المعلومات محمولة بوزن لا يتعدى 10 كغ",
    descriptionEn: "Portable automatic data processing machines, weighing not more than 10 kg",
    ddiPercent: 2.5,
    tvaPercent: 20.0,
    tpPercent: 0.25,
    agenciesRequired: ['ANRT'],
    rgiNotes: "RGI 1 (Position 8471) et RGI 6. Agrément technique ANRT pour les équipements de télécommunication sans fil intégrés.",
    unit: "U"
  },
  {
    hsCode10: "5208.11.00.00",
    hsCode6: "5208.11",
    chapter: "52",
    heading: "5208",
    descriptionEs: "Tejidos de algodón sin blanquear de ligamento tafetán, de peso inferior o igual a 100 g/m²",
    descriptionFr: "Tissus de coton non blanchis, à armure toile, d'un poids n'excédant pas 100 g/m²",
    descriptionAr: "أقمشة قطنية خام غير مبيضة بوزن لا يتجاوز 100 غ/م²",
    descriptionEn: "Unbleached woven fabrics of cotton, plain weave, weighing not more than 100 g/m²",
    ddiPercent: 17.5,
    tvaPercent: 20.0,
    tpPercent: 0.25,
    agenciesRequired: ['MCINET'],
    rgiNotes: "RGI 1 & Section XI (Matières textiles). Soumis aux mesures de sauvegarde textile si non accompagné du certificat EUR.1.",
    unit: "M2"
  },
  {
    hsCode10: "1001.99.00.19",
    hsCode6: "1001.99",
    chapter: "10",
    heading: "1001",
    descriptionEs: "Trigo blando y morcajo o tranquillón (para panificación y molienda industrial)",
    descriptionFr: "Froment (blé tendre) et méteil pour minoterie industrielle",
    descriptionAr: "قمح طري ومخلط مخصص للمطاحن الصناعية وإنتاج الدقيق",
    descriptionEn: "Common wheat and meslin for industrial milling",
    ddiPercent: 10.0,
    tvaPercent: 0.0,
    tpPercent: 0.25,
    agenciesRequired: ['ONSSA'],
    rgiNotes: "RGI 1 & ONICL (Office National Interprofessionnel des Céréales et Légumineuses). Taux flottant selon campagne agricole marocaine.",
    unit: "T"
  },
  {
    hsCode10: "7210.49.00.00",
    hsCode6: "7210.49",
    chapter: "72",
    heading: "7210",
    descriptionEs: "Productos laminados planos de hierro o acero sin alear, galvanizados por otro procedimiento, de anchura ≥ 600 mm",
    descriptionFr: "Produits laminés plats en fer ou aciers non alliés, galvanisés, de largeur ≥ 600 mm",
    descriptionAr: "منتجات مسطحة مدلفنة من حديد أو صلب مغلفنة بعرض 600 مم فما فوق",
    descriptionEn: "Flat-rolled products of iron or non-alloy steel, otherwise plated or coated with zinc, width >= 600 mm",
    ddiPercent: 2.5,
    tvaPercent: 20.0,
    tpPercent: 0.25,
    agenciesRequired: ['MCINET'],
    rgiNotes: "RGI 1 & Section XV. Mesure antidumping et certificat de conformité sidérurgique.",
    unit: "KG"
  }
];

export const RGI_RULES_GUIDE = [
  {
    rule: "RGI 1",
    title: "Texte des positions et Notes de Section/Chapitre",
    description: "La classification est déterminée légalement par le libellé des positions à 4 chiffres et des notes de sections ou de chapitres correspondantes."
  },
  {
    rule: "RGI 2(a)",
    title: "Articles incomplets, non montés ou démontés",
    description: "Tout article incomplet ou non fini est classé comme l'article complet s'il en présente les caractéristiques essentielles."
  },
  {
    rule: "RGI 2(b)",
    title: "Mélanges et associations de matières",
    description: "Toute référence à une matière s'applique à cette matière pure ou mélangée avec d'autres matières."
  },
  {
    rule: "RGI 3(a)",
    title: "Position la plus spécifique",
    description: "La position la plus spécifique doit être préférée aux positions de portée plus générale."
  },
  {
    rule: "RGI 3(b)",
    title: "Caractère essentiel (Mélanges & Assortiments)",
    description: "Les articles composites et assortiments vendus au détail sont classés d'après la matière ou l'article qui leur confère leur caractère essentiel."
  },
  {
    rule: "RGI 3(c)",
    title: "Dernier numéro par ordre de numérotation",
    description: "Lorsque les règles 3(a) et 3(b) ne permettent pas d'opérer le classement, l'article est classé dans la position placée la dernière par ordre de numérotation."
  },
  {
    rule: "RGI 4",
    title: "Marchandises les plus analogues",
    description: "Les marchandises qui ne peuvent pas être classées en vertu des règles 1 à 3 sont classées dans la position afférente aux articles les plus analogues."
  },
  {
    rule: "RGI 5",
    title: "Étuis, emballages et contenants spécifiques",
    description: "Les étuis pour appareils, instruments de musique, armes et emballages usuels suivent le régime des marchandises qu'ils contiennent."
  },
  {
    rule: "RGI 6",
    title: "Classement dans les sous-positions (6 à 10 chiffres)",
    description: "Le classement dans les sous-positions d'une même position est déterminé légalement par les termes de ces sous-positions et les règles 1 à 5."
  }
];
