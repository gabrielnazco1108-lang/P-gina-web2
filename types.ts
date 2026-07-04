export interface Company {
  id: string;
  name: string;
  legalRepresentative: string;
  taxId: string;
  constitutionDate: string;
  country: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "FLAGGED";
  riskScore: number | null; // 0-100
  kybReport?: string;
  documents: {
    taxRegistration: boolean;
    incorporationDeed: boolean;
    identityProof: boolean;
    bankReference: boolean;
  };
}

export interface TechnicalSpecs {
  enginePowerHP: number;
  operatingHours: number;
  weightTons: number;
  yearOfManufacture: number;
  certifications: string[]; // e.g. ["ISO 9001", "CE", "EPA Tier 4", "ROPS Cab"]
  maintenanceLogUrl: string;
  serialNumber: string;
  lastInspectionDate: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  condition: "NUEVA" | "RECONSTRUIDA" | "USADA_EXCELENTE" | "USADA_OPERATIVA";
  location: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  specs: TechnicalSpecs;
  description: string;
}

export interface EscrowTimelineStep {
  status: string;
  label: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface EscrowTransaction {
  id: string;
  item: CatalogItem;
  buyerName: string;
  sellerName: string;
  amount: number;
  status: "CREATED" | "FUNDS_DEPOSITED" | "EQUIPMENT_SHIPPED" | "IN_INSPECTION" | "FUNDS_RELEASED" | "DISPUTE_OPENED" | "REFUNDED";
  paymentMethod: "ESCROW_TRANS" | "COMMERCIAL_CREDIT" | "BANK_WIRE";
  deliveryTerm: string; // e.g., "FCA", "DDP"
  inspectionPeriodDays: number;
  timeline: EscrowTimelineStep[];
  disputeNotes?: {
    buyerClaim: string;
    sellerResponse?: string;
    aiArbitration?: string;
    resolvedAt?: string;
    resolutionOutcome?: string;
  };
}
