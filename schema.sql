-- Customs Transit Simulator - Moroccan Customs (ADII / PortNet) Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Customs Declarations (DUM)
CREATE TABLE IF NOT EXISTS customs_declarations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dum_number VARCHAR(50) UNIQUE NOT NULL,
    office_code VARCHAR(10) NOT NULL, -- e.g. "300" (Tanger Med)
    regime VARCHAR(10) NOT NULL,      -- "10", "21", "30", "40"
    importer_tax_id VARCHAR(50) NOT NULL,
    exporter_name VARCHAR(255) NOT NULL,
    incoterm VARCHAR(20) NOT NULL,
    declared_cif_mad NUMERIC(14, 2) NOT NULL,
    duties_ddi_mad NUMERIC(14, 2) NOT NULL,
    taxes_tva_mad NUMERIC(14, 2) NOT NULL,
    taxes_tp_mad NUMERIC(14, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'EN_CIRCUITO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Containers & Weighbridge Scale readings
CREATE TABLE IF NOT EXISTS container_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    container_number VARCHAR(20) NOT NULL,
    manifest_bl VARCHAR(50) NOT NULL,
    tare_weight_kg NUMERIC(10, 2) NOT NULL,
    declared_gross_kg NUMERIC(10, 2) NOT NULL,
    weighbridge_scale_kg NUMERIC(10, 2),
    weight_variance_kg NUMERIC(10, 2),
    scanner_anomaly_flag BOOLEAN DEFAULT FALSE,
    demurrage_start_time TIMESTAMP WITH TIME ZONE,
    mead_terminal VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for ADIL Tariff Nomenclature (Moroccan Customs 10-digit codes)
CREATE TABLE IF NOT EXISTS adil_tariffs (
    hs_code VARCHAR(14) PRIMARY KEY,
    description TEXT NOT NULL,
    duty_rate_pct NUMERIC(5, 2) NOT NULL,
    vat_rate_pct NUMERIC(5, 2) NOT NULL,
    parafiscal_tax_pct NUMERIC(5, 2) DEFAULT 0.25,
    technical_control VARCHAR(100),
    requires_coc BOOLEAN DEFAULT FALSE,
    requires_onssa BOOLEAN DEFAULT FALSE
);

-- ADII Tariff Nomenclature with Moroccan 10-digit specification (hs10_tariff_schedule)
CREATE TABLE IF NOT EXISTS hs10_tariff_schedule (
    hs10_code VARCHAR(10) PRIMARY KEY,
    description_fr TEXT NOT NULL,
    description_es TEXT,
    ddi_rate NUMERIC(5, 2) NOT NULL DEFAULT 2.50,
    tva_rate NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
    parafiscale_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.25,
    mcinet_control_required BOOLEAN DEFAULT FALSE,
    onssa_control_required BOOLEAN DEFAULT FALSE,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial ADIL tariff codes
INSERT INTO adil_tariffs (hs_code, description, duty_rate_pct, vat_rate_pct, parafiscal_tax_pct, technical_control, requires_coc, requires_onssa)
VALUES 
    ('7204.49.00.00', 'Autres déchets et débris d''aciers alliés et tournures', 2.50, 20.00, 0.25, 'MCINET Homologation & Analyse', TRUE, FALSE),
    ('8424.82.00.00', 'Appareils mécaniques pour l''agriculture ou l''horticulture (Fertirrigation)', 2.50, 20.00, 0.25, 'MCINET CoC', TRUE, FALSE),
    ('8481.80.90.00', 'Autres articles de robinetterie et organes similaires', 17.50, 20.00, 0.25, 'MCINET CoC', TRUE, FALSE),
    ('7208.51.00.00', 'Produits laminés plats en fer ou aciers non alliés (épaisseur > 10 mm)', 40.00, 20.00, 0.25, 'MCINET Droit Antidumping', TRUE, FALSE),
    ('0702.00.00.00', 'Tomates fraîches ou réfrigérées', 40.00, 20.00, 0.25, 'ONSSA Phytosanitaire', FALSE, TRUE)
ON CONFLICT (hs_code) DO NOTHING;

-- Seed hs10_tariff_schedule
INSERT INTO hs10_tariff_schedule (
    hs10_code, description_fr, description_es, ddi_rate, tva_rate, parafiscale_rate, mcinet_control_required, onssa_control_required, special_requirements
)
VALUES
    ('7204490000', 'Autres déchets et débris de fonte, fer ou acier (ferraille et tournures)', 'Chatarra y desperdicios de fundición, hierro o acero', 2.50, 20.00, 0.25, TRUE, FALSE, 'Certificat de Conformité MCINET + Contrôle physique radiologique'),
    ('8424820000', 'Appareils pour l''agriculture ou l''horticulture (goutte-à-goutte, fertirrigation)', 'Sistemas de riego por goteo y fertirrigación', 2.50, 20.00, 0.25, TRUE, FALSE, 'Norme Marocaine NM ISO 9261'),
    ('8481809000', 'Robinetterie industrielle et vannes de régulation haute pression', 'Válvulas de control y regulación industrial', 17.50, 20.00, 0.25, TRUE, FALSE, 'Certificat MCINET'),
    ('7208510000', 'Produits laminés plats en fer ou aciers non alliés (> 10 mm)', 'Chapas y laminados planos de acero al carbono', 40.00, 20.00, 0.25, TRUE, FALSE, 'Taxe antidumping applicable'),
    ('0702000000', 'Tomates fraîches ou réfrigérées', 'Tomates frescos o refrigerados', 40.00, 20.00, 0.25, FALSE, TRUE, 'Certificat Phytosanitaire ONSSA')
ON CONFLICT (hs10_code) DO NOTHING;

