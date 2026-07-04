import { Company, CatalogItem, EscrowTransaction } from "./types";

export const COMPLIANCE_STANDARDS = [
  {
    id: "gdpr",
    name: "GDPR / RGPD",
    type: "Protección de Datos",
    scope: "Internacional (UE y aplicabilidad extraterritorial)",
    description: "Cifrado end-to-end de documentos corporativos y firmas. Derecho al olvido aplicado a datos de representantes legales y logs de auditoría inmutables.",
    checks: ["Cifrado AES-256 en reposo", "Minimización de datos de personas físicas", "Consentimiento explícito de onboarding"]
  },
  {
    id: "aml",
    name: "Prevención de Lavado de Activos (AML)",
    type: "Cumplimiento Financiero",
    scope: "Global",
    description: "Monitoreo obligatorio de transacciones financieras complejas. Verificación contra listas de sanciones (OFAC, PEPs, Interpol) en tiempo real previo a depósitos escrow.",
    checks: ["Screening de beneficiario final (UBO)", "Detección de PEPs (Personas Expuestas Políticamente)", "Reporte de Actividad Sospechosa (SAR)"]
  },
  {
    id: "iso9001",
    name: "ISO 9001 & ISO 14001",
    type: "Calidad y Medio Ambiente",
    scope: "Industrial",
    description: "Garantiza que el vendedor cumple con protocolos de control de calidad en la reconstrucción y reacondicionamiento de maquinaria pesada.",
    checks: ["Verificación de certificador acreditado", "Historial de calibración del equipo", "Auditoría de huella de carbono en logística"]
  }
];

export const PRESET_COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "Aceros del Atlántico S.A. de C.V.",
    legalRepresentative: "Ing. Carlos Mendoza Ruiz",
    taxId: "MX-AAT950812-H8",
    constitutionDate: "1995-08-12",
    country: "México",
    status: "APPROVED",
    riskScore: 12,
    documents: {
      taxRegistration: true,
      incorporationDeed: true,
      identityProof: true,
      bankReference: true
    },
    kybReport: "### INFORME DE AUDITORÍA KYB - APROBADO\n\n- **Empresa:** Aceros del Atlántico S.A. de C.V.\n- **Puntaje de Riesgo:** 12/100 (Riesgo Muy Bajo)\n- **Análisis Legal:** La documentación fiscal coincide perfectamente con el registro oficial de la Secretaría de Hacienda. El representante legal cuenta con poderes generales vigentes para actos de administración y dominio.\n- **Cumplimiento AML:** Sin coincidencias en listas de sanciones (OFAC/UN).\n- **Dictamen:** Aprobación inmediata para transacciones B2B ilimitadas."
  },
  {
    id: "comp-2",
    name: "Heidelberg Industrial Logistics GmbH",
    legalRepresentative: "Dr. Hans-Dieter Weber",
    taxId: "DE-811123456",
    constitutionDate: "2008-04-30",
    country: "Alemania",
    status: "APPROVED",
    riskScore: 8,
    documents: {
      taxRegistration: true,
      incorporationDeed: true,
      identityProof: true,
      bankReference: true
    },
    kybReport: "### KYB COMPLIANCE REPORT - VERIFIED\n\n- **Company:** Heidelberg Industrial Logistics GmbH\n- **Risk Score:** 8/100 (Extremely Low)\n- **Legal Check:** Incorporation deed registered in Frankfurt Commercial Register (HRB). Authorized capital verified.\n- **AML/Sanctions Check:** Cleared. UBO (Ultimate Beneficial Owner) identified and verified.\n- **Recommendation:** Fully certified for global escrow buying and selling."
  },
  {
    id: "comp-3",
    name: "Minería y Excavaciones del Ande S.A.C.",
    legalRepresentative: "Sra. Lucía Albarracín",
    taxId: "PE-20541189623",
    constitutionDate: "2015-11-22",
    country: "Perú",
    status: "PENDING",
    riskScore: null,
    documents: {
      taxRegistration: true,
      incorporationDeed: true,
      identityProof: false,
      bankReference: true
    }
  },
  {
    id: "comp-4",
    name: "Vostok Machinery Trade Ltd",
    legalRepresentative: "Alexei Volkov",
    taxId: "RU-7701234567",
    constitutionDate: "2021-01-10",
    country: "Federación Rusa",
    status: "FLAGGED",
    riskScore: 85,
    documents: {
      taxRegistration: true,
      incorporationDeed: true,
      identityProof: true,
      bankReference: false
    },
    kybReport: "### ALERTA DE COMPLIANCE KYB - RECHAZADO / BLOQUEADO\n\n- **Empresa:** Vostok Machinery Trade Ltd\n- **Puntaje de Riesgo:** 85/100 (Riesgo Crítico)\n- **Motivo de Alerta:** El país de origen y los directivos están listados en los regímenes de sanciones económicas internacionales vigentes (Directivas de Cumplimiento UE/OFAC).\n- **Dictamen:** Se prohíbe el onboarding de esta entidad para mitigar riesgos de lavado de activos y penalizaciones internacionales en el procesador de pagos Escrow."
  }
];

export const PRESET_CATALOG: CatalogItem[] = [
  {
    id: "cat-1",
    name: "Excavadora Hidráulica Caterpillar 320 GC",
    category: "Maquinaria de Excavación",
    brand: "Caterpillar",
    price: 145000,
    condition: "USADA_EXCELENTE",
    location: "Sinaloa, México",
    imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
    sellerId: "comp-1",
    sellerName: "Aceros del Atlántico S.A. de C.V.",
    sellerRating: 4.8,
    description: "Excavadora de bajo consumo de combustible en perfecto estado operativo. Solo un dueño corporativo previo, mantenimientos preventivos rigurosos realizados por distribuidor certificado CAT.",
    specs: {
      enginePowerHP: 145,
      operatingHours: 4200,
      weightTons: 20.5,
      yearOfManufacture: 2021,
      certifications: ["ISO 9001", "Certificado de Distribuidor Autorizado CAT", "Normativa de Emisiones Tier 4 EPA"],
      maintenanceLogUrl: "CAT-320GC-Maint-Log.pdf",
      serialNumber: "CAT0320GCP2021A9X",
      lastInspectionDate: "2026-05-15"
    }
  },
  {
    id: "cat-2",
    name: "Grúa Telescópica Liebherr LTM 1050-3.1",
    category: "Equipos de Elevación",
    brand: "Liebherr",
    price: 290000,
    condition: "RECONSTRUIDA",
    location: "Frankfurt, Alemania",
    imageUrl: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=600",
    sellerId: "comp-2",
    sellerName: "Heidelberg Industrial Logistics GmbH",
    sellerRating: 4.9,
    description: "Grúa telescópica totalmente reconstruida (Overhauled) en fábrica Liebherr en 2024. Chasis revisado, cableado eléctrico renovado, certificación de integridad estructural por tercera parte certificada.",
    specs: {
      enginePowerHP: 367,
      operatingHours: 8900,
      weightTons: 36.0,
      yearOfManufacture: 2018,
      certifications: ["Marcado CE", "Inspección de Carga TÜV", "ISO 9001", "Certificado Estructural DGUV V52"],
      maintenanceLogUrl: "LIEBHERR-LTM1050-Overhaul-2024.pdf",
      serialNumber: "LBH1050T2018X75",
      lastInspectionDate: "2026-04-10"
    }
  },
  {
    id: "cat-3",
    name: "Generador Eléctrico diésel Cummins C110 D5",
    category: "Energía y Generación",
    brand: "Cummins",
    price: 32000,
    condition: "NUEVA",
    location: "Querétaro, México",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
    sellerId: "comp-1",
    sellerName: "Aceros del Atlántico S.A. de C.V.",
    sellerRating: 4.8,
    description: "Grupo electrógeno industrial sin uso. Cabina insonorizada de fábrica, panel de control digital PowerCommand, garantía internacional Cummins por 2 años.",
    specs: {
      enginePowerHP: 110,
      operatingHours: 5,
      weightTons: 1.4,
      yearOfManufacture: 2025,
      certifications: ["ISO 9001", "CE", "EPA Tier 3 Emissions", "Garantía de Fábrica Cummins"],
      maintenanceLogUrl: "CUMMINS-C110-Manual.pdf",
      serialNumber: "CUMM854122025G",
      lastInspectionDate: "2026-06-01"
    }
  }
];

export const PRESET_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: "tx-1001",
    item: PRESET_CATALOG[0],
    buyerName: "Heidelberg Industrial Logistics GmbH",
    sellerName: "Aceros del Atlántico S.A. de C.V.",
    amount: 145000,
    status: "IN_INSPECTION",
    paymentMethod: "ESCROW_TRANS",
    deliveryTerm: "FCA (Laredo Customs Hub)",
    inspectionPeriodDays: 5,
    timeline: [
      { status: "CREATED", label: "Contrato Firmado", date: "2026-06-15", description: "Comprador y vendedor firman el acuerdo digital.", completed: true },
      { status: "FUNDS_DEPOSITED", label: "Fondos en Escrow", date: "2026-06-18", description: "Comprador transfiere 145,000 USD a la cuenta de custodia neutra. Fondos verificados.", completed: true },
      { status: "EQUIPMENT_SHIPPED", label: "Equipo Despachado", date: "2026-06-25", description: "El vendedor despacha la excavadora CAT con documentación aduanera.", completed: true },
      { status: "IN_INSPECTION", label: "Periodo de Inspección", date: "2026-07-01", description: "El comprador recibe el equipo y cuenta con 5 días hábiles para auditoría técnica de conformidad.", completed: true },
      { status: "FUNDS_RELEASED", label: "Liberación de Fondos", date: "", description: "Tras confirmación del inspector, los fondos se transfieren al vendedor.", completed: false }
    ]
  },
  {
    id: "tx-1002",
    item: PRESET_CATALOG[1],
    buyerName: "Aceros del Atlántico S.A. de C.V.",
    sellerName: "Heidelberg Industrial Logistics GmbH",
    amount: 290000,
    status: "FUNDS_RELEASED",
    paymentMethod: "COMMERCIAL_CREDIT",
    deliveryTerm: "DDP (Puerto de Veracruz)",
    inspectionPeriodDays: 7,
    timeline: [
      { status: "CREATED", label: "Contrato Firmado", date: "2026-05-01", description: "Borrador firmado bajo Incoterm DDP.", completed: true },
      { status: "FUNDS_DEPOSITED", label: "Crédito Asegurado", date: "2026-05-04", description: "Línea de crédito comercial sindicada y asegurada por COFACE.", completed: true },
      { status: "EQUIPMENT_SHIPPED", label: "Tránsito Marítimo", date: "2026-05-12", description: "Zarpa buque portacontenedores desde Hamburgo.", completed: true },
      { status: "IN_INSPECTION", label: "Inspección de Tercera Parte", date: "2026-06-05", description: "Auditoría por SGS México aprobada al 100%.", completed: true },
      { status: "FUNDS_RELEASED", label: "Liquidado al Vendedor", date: "2026-06-08", description: "Escrow liquidado con éxito y traspaso de propiedad.", completed: true }
    ]
  }
];
