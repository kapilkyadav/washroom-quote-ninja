import type { Json } from './database.types';

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

export interface DbSubmission {
  id?: number;
  customer_details: Json;
  estimate_amount: number;
  form_data: Json;
  breakdown: Json;
  status?: string;
  submitted_at: string;
  created_at?: string | null;
  updated_at?: string | null;
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

export interface BrandData {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductData {
  id: number;
  brand_id: number;
  name: string;
  sku?: string;
  description?: string;
  client_price: number;
  quotation_price: number;
  margin: number;
  extra_data?: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportConfiguration {
  id: number;
  name: string;
  source_type: 'google_sheet' | 'excel' | 'csv';
  source_url?: string;
  column_mappings: Record<string, string>;
  last_used: string;
  created_at: string;
  updated_at: string;
}

export interface ColumnMapping {
  sourceColumn: string;
  targetField: keyof ProductData | 'extra_data';
  isRequired?: boolean;
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

// Export the Database types
export type { Database, Json } from './database.types';
