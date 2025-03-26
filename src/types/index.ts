
export interface CalculatorFormData {
  projectType: 'new' | 'renovation' | '';
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  electricalFixtures: {
    ledMirror: boolean;
    exhaustFan: boolean;
    waterHeater: boolean;
  };
  plumbingRequirements: 'complete' | 'fixtureOnly' | '';
  additionalFixtures: {
    showerPartition: boolean;
    vanity: boolean;
    bathtub: boolean;
    jacuzzi: boolean;
  };
  projectTimeline: 'standard' | 'flexible' | '';
  brandSelection: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  clientPrice: number;
  quotationPrice: number;
  margin: number;
}

export interface EstimateBreakdown {
  basePrice: number;
  electricalFixturesPrice: number;
  plumbingPrice: number;
  additionalFixturesPrice: number;
  brandPremium: number;
  timelineDiscount: number;
  // New fields for tiling and detailed calculations
  floorArea: number;
  wallArea: number;
  totalArea: number;
  tileQuantityInitial: number;
  tileQuantityWithBreakage: number;
  tileMaterialCost: number;
  tilingLaborCost: number;
  totalTilingCost: number;
  total: number;
}

export type FixtureType = 'ledMirror' | 'exhaustFan' | 'waterHeater' | 'showerPartition' | 'vanity' | 'bathtub' | 'jacuzzi';

export interface FixturePricing {
  [key: string]: {
    name: string;
    price: number;
    description?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'sales' | 'support';
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
  avatar?: string;
}

export interface CalcSubmission {
  id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  estimateAmount: number;
  formData: CalculatorFormData;
  breakdown: EstimateBreakdown;
  status: 'new' | 'contacted' | 'qualified' | 'not-interested';
  submittedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  brand_id: string;
  category: string;
  stock: number;
  image_url?: string;
  active: boolean;
}

export interface DataImportConfig {
  mapping: Record<string, string>;
  source: 'google_sheet' | 'excel' | 'csv';
  sourceId?: string;
  lastImport?: string;
  autoSync: boolean;
  syncInterval?: 'daily' | 'weekly' | 'monthly';
}

export interface CalculatorSettings {
  plumbingRatePerSqFt: number;
  tileCostPerUnit: number;
  tilingLaborRate: number;
}
