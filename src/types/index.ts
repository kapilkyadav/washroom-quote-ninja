
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
