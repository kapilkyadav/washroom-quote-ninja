
import { useEffect, useState } from 'react';
import { CalculatorFormData, Brand, FixturePricing, EstimateBreakdown } from '@/types';
import { Button } from '@/components/ui/button';
import { Check, Printer, Mail, Download, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface EstimateResultStepProps {
  formData: CalculatorFormData;
  onReset: () => void;
}

// Mock pricing data - in a real app this would come from an API
const electricalFixturePricing: FixturePricing = {
  ledMirror: { name: 'LED Mirror', price: 150 },
  exhaustFan: { name: 'Exhaust Fan', price: 120 },
  waterHeater: { name: 'Water Heater', price: 350 }
};

const additionalFixturePricing: FixturePricing = {
  showerPartition: { name: 'Shower Partition', price: 450 },
  vanity: { name: 'Vanity', price: 380 },
  bathtub: { name: 'Bathtub', price: 650 },
  jacuzzi: { name: 'Jacuzzi', price: 1200 }
};

const brands: Brand[] = [
  { id: 'brand1', name: 'Luxe Bathware', clientPrice: 1500, quotationPrice: 1200, margin: 20 },
  { id: 'brand2', name: 'Modern Plumbing', clientPrice: 1200, quotationPrice: 950, margin: 15 },
  { id: 'brand3', name: 'Premium Fixtures', clientPrice: 2000, quotationPrice: 1600, margin: 25 },
  { id: 'brand4', name: 'Elegant Washrooms', clientPrice: 1800, quotationPrice: 1450, margin: 22 },
  { id: 'brand5', name: 'Eco Bath Solutions', clientPrice: 1350, quotationPrice: 1100, margin: 18 },
  { id: 'brand6', name: 'Designer Washrooms', clientPrice: 2200, quotationPrice: 1750, margin: 30 },
];

const BASE_RATE_PER_SQFT = 50; // $50 per sq ft base rate
const PLUMBING_RATES = {
  complete: 1500,
  fixtureOnly: 800
};

const EstimateResultStep = ({ formData, onReset }: EstimateResultStepProps) => {
  const [breakdown, setBreakdown] = useState<EstimateBreakdown>({
    basePrice: 0,
    electricalFixturesPrice: 0,
    plumbingPrice: 0,
    additionalFixturesPrice: 0,
    brandPremium: 0,
    timelineDiscount: 0,
    total: 0
  });
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Calculate estimate
  useEffect(() => {
    setTimeout(() => {
      calculateEstimate();
      setIsGenerating(false);
      
      // Simulate success state after calculation
      setTimeout(() => {
        setIsSuccess(true);
      }, 500);
    }, 1500);
  }, []);
  
  const calculateEstimate = () => {
    // Area calculation
    const { length, width } = formData.dimensions;
    const area = length * width;
    const basePrice = area * BASE_RATE_PER_SQFT;
    
    // Electrical fixtures
    const electricalFixturesPrice = Object.entries(formData.electricalFixtures)
      .filter(([_, isSelected]) => isSelected)
      .reduce((sum, [fixture]) => {
        return sum + electricalFixturePricing[fixture].price;
      }, 0);
    
    // Plumbing
    const plumbingPrice = formData.plumbingRequirements ? 
      PLUMBING_RATES[formData.plumbingRequirements] : 0;
    
    // Additional fixtures
    const additionalFixturesPrice = Object.entries(formData.additionalFixtures)
      .filter(([_, isSelected]) => isSelected)
      .reduce((sum, [fixture]) => {
        return sum + additionalFixturePricing[fixture].price;
      }, 0);
    
    // Brand premium
    const selectedBrand = brands.find(brand => brand.id === formData.brandSelection);
    const brandPremium = selectedBrand ? selectedBrand.clientPrice : 0;
    
    // Timeline discount
    const subtotal = basePrice + electricalFixturesPrice + plumbingPrice + additionalFixturesPrice + brandPremium;
    const timelineDiscount = formData.projectTimeline === 'flexible' ? subtotal * 0.05 : 0;
    
    // Total
    const total = subtotal - timelineDiscount;
    
    setBreakdown({
      basePrice,
      electricalFixturesPrice,
      plumbingPrice,
      additionalFixturesPrice,
      brandPremium,
      timelineDiscount,
      total
    });
  };
  
  const handlePrint = () => {
    window.print();
    toast.success('Preparing document for printing');
  };
  
  const handleEmailEstimate = () => {
    toast.success('Estimate sent to your email');
  };
  
  const handleDownload = () => {
    toast.success('Estimate PDF downloaded');
  };
  
  const handleStartNew = () => {
    onReset();
  };
  
  // Format currency in INR
  const formatINR = (amount: number) => {
    return amount.toFixed(2);
  };
  
  return (
    <div className="py-4 animate-slide-in max-w-4xl mx-auto">
      <h2 className="heading-2 text-center mb-8">Your Estimate</h2>
      
      {isGenerating ? (
        <div className="glass-card rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-lg">Generating your estimate...</p>
          <p className="text-muted-foreground">We're calculating the perfect solution for your washroom project.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="glass-card rounded-xl p-8 relative overflow-hidden">
            {isSuccess && (
              <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Estimate Ready
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-4">Estimate Breakdown</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price ({formData.dimensions.length} × {formData.dimensions.width} sq ft)</span>
                    <span className="flex items-center">
                      <IndianRupee size={16} className="mr-1" />
                      {formatINR(breakdown.basePrice)}
                    </span>
                  </div>
                  
                  {breakdown.electricalFixturesPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Electrical Fixtures</span>
                      <span className="flex items-center">
                        <IndianRupee size={16} className="mr-1" />
                        {formatINR(breakdown.electricalFixturesPrice)}
                      </span>
                    </div>
                  )}
                  
                  {breakdown.plumbingPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plumbing ({formData.plumbingRequirements === 'complete' ? 'Complete' : 'Fixture Only'})</span>
                      <span className="flex items-center">
                        <IndianRupee size={16} className="mr-1" />
                        {formatINR(breakdown.plumbingPrice)}
                      </span>
                    </div>
                  )}
                  
                  {breakdown.additionalFixturesPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional Fixtures</span>
                      <span className="flex items-center">
                        <IndianRupee size={16} className="mr-1" />
                        {formatINR(breakdown.additionalFixturesPrice)}
                      </span>
                    </div>
                  )}
                  
                  {breakdown.brandPremium > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand Premium ({brands.find(b => b.id === formData.brandSelection)?.name})</span>
                      <span className="flex items-center">
                        <IndianRupee size={16} className="mr-1" />
                        {formatINR(breakdown.brandPremium)}
                      </span>
                    </div>
                  )}
                  
                  {breakdown.timelineDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Timeline Discount (5%)</span>
                      <span className="flex items-center">
                        <IndianRupee size={16} className="mr-1" />
                        {formatINR(breakdown.timelineDiscount)}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg">
                    <span>Total Estimate</span>
                    <span className="flex items-center">
                      <IndianRupee size={16} className="mr-1" />
                      {formatINR(breakdown.total)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Project Type</p>
                    <p className="font-medium">{formData.projectType === 'new' ? 'New Construction' : 'Renovation'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Dimensions</p>
                    <p className="font-medium">{formData.dimensions.length} × {formData.dimensions.width} × {formData.dimensions.height} feet</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="font-medium">{formData.projectTimeline === 'standard' ? 'Standard (4 Weeks)' : 'Flexible (>4 Weeks)'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Brand</p>
                    <p className="font-medium">{brands.find(b => b.id === formData.brandSelection)?.name || 'Not selected'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{formData.customerDetails.name}</p>
                    <p className="text-sm">{formData.customerDetails.email}</p>
                    <p className="text-sm">{formData.customerDetails.phone}</p>
                    <p className="text-sm">{formData.customerDetails.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button onClick={handlePrint} className="flex-1 gap-2">
              <Printer className="w-4 h-4" />
              Print Estimate
            </Button>
            <Button onClick={handleEmailEstimate} className="flex-1 gap-2">
              <Mail className="w-4 h-4" />
              Email Estimate
            </Button>
            <Button onClick={handleDownload} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
          
          <div className="text-center">
            <Button onClick={handleStartNew} variant="outline">
              Start New Estimate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimateResultStep;
