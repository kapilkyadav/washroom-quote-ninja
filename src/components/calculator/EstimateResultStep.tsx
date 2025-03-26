import { useEffect, useState } from 'react';
import { CalculatorFormData, Brand, FixturePricing, EstimateBreakdown, CalcSubmission } from '@/types';
import { Button } from '@/components/ui/button';
import { Check, Printer, Mail, Download, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface EstimateResultStepProps {
  formData: CalculatorFormData;
  onReset: () => void;
}

const EstimateResultStep = ({ formData, onReset }: EstimateResultStepProps) => {
  const [electricalFixturePricing, setElectricalFixturePricing] = useState<FixturePricing>({});
  const [additionalFixturePricing, setAdditionalFixturePricing] = useState<FixturePricing>({});
  const [calculatorSettings, setCalculatorSettings] = useState({
    PLUMBING_RATE_PER_SQFT: 50,
    TILE_COST_PER_UNIT: 80,
    TILING_LABOR_RATE: 85,
    TILE_SIZE_SQFT: 4
  });
  const [brands, setBrands] = useState<Brand[]>([
    { id: 'brand1', name: 'Luxe Bathware', clientPrice: 1500, quotationPrice: 1200, margin: 20 },
    { id: 'brand2', name: 'Modern Plumbing', clientPrice: 1200, quotationPrice: 950, margin: 15 },
    { id: 'brand3', name: 'Premium Fixtures', clientPrice: 2000, quotationPrice: 1600, margin: 25 },
    { id: 'brand4', name: 'Elegant Washrooms', clientPrice: 1800, quotationPrice: 1450, margin: 22 },
    { id: 'brand5', name: 'Eco Bath Solutions', clientPrice: 1350, quotationPrice: 1100, margin: 18 },
    { id: 'brand6', name: 'Designer Washrooms', clientPrice: 2200, quotationPrice: 1750, margin: 30 },
  ]);
  
  const [breakdown, setBreakdown] = useState<EstimateBreakdown>({
    basePrice: 0,
    electricalFixturesPrice: 0,
    plumbingPrice: 0,
    additionalFixturesPrice: 0,
    brandPremium: 0,
    timelineDiscount: 0,
    floorArea: 0,
    wallArea: 0,
    totalArea: 0,
    tileQuantityInitial: 0,
    tileQuantityWithBreakage: 0,
    tileMaterialCost: 0,
    tilingLaborCost: 0,
    totalTilingCost: 0,
    total: 0
  });
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    Promise.all([
      fetchFixtures(),
      fetchCalculatorSettings()
    ]).then(() => {
      setTimeout(() => {
        calculateEstimate();
        setIsGenerating(false);
        
        setTimeout(() => {
          setIsSuccess(true);
        }, 500);
      }, 1500);
    });
  }, []);
  
  const fetchFixtures = async () => {
    try {
      const { data: electricalData, error: electricalError } = await supabase
        .from('fixtures')
        .select('*')
        .eq('type', 'electrical');

      if (electricalError) throw electricalError;

      const { data: bathroomData, error: bathroomError } = await supabase
        .from('fixtures')
        .select('*')
        .eq('type', 'bathroom');

      if (bathroomError) throw bathroomError;

      if (electricalData && electricalData.length > 0) {
        const fixturesObj: FixturePricing = {};
        electricalData.forEach(item => {
          fixturesObj[item.fixture_id] = {
            name: item.name,
            price: item.price,
            description: item.description
          };
        });
        setElectricalFixturePricing(fixturesObj);
      }

      if (bathroomData && bathroomData.length > 0) {
        const fixturesObj: FixturePricing = {};
        bathroomData.forEach(item => {
          fixturesObj[item.fixture_id] = {
            name: item.name,
            price: item.price,
            description: item.description
          };
        });
        setAdditionalFixturePricing(fixturesObj);
      }
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setElectricalFixturePricing({
        ledMirror: { name: 'LED Mirror', price: 3500 },
        exhaustFan: { name: 'Exhaust Fan', price: 1800 },
        waterHeater: { name: 'Water Heater', price: 8000 }
      });
      
      setAdditionalFixturePricing({
        showerPartition: { name: 'Shower Partition', price: 15000, description: 'Glass shower partition with frame' },
        vanity: { name: 'Vanity', price: 25000, description: 'Modern bathroom vanity with storage' },
        bathtub: { name: 'Bathtub', price: 35000, description: 'Premium acrylic bathtub with fixtures' },
        jacuzzi: { name: 'Jacuzzi', price: 55000, description: 'Premium jacuzzi with massage jets' },
      });
    }
  };
  
  const fetchCalculatorSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('category', 'calculator')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCalculatorSettings({
          PLUMBING_RATE_PER_SQFT: data.settings.plumbingRatePerSqFt || 50,
          TILE_COST_PER_UNIT: data.settings.tileCostPerUnit || 80,
          TILING_LABOR_RATE: data.settings.tilingLaborRate || 85,
          TILE_SIZE_SQFT: 4
        });
      }
    } catch (error) {
      console.error('Error fetching calculator settings:', error);
    }
  };
  
  const calculateEstimate = () => {
    const { length, width, height } = formData.dimensions;
    
    const floorArea = length * width;
    const wallArea = 2 * (length + width) * height;
    const totalArea = floorArea + wallArea;
    
    const tileQuantityInitial = Math.ceil(totalArea / calculatorSettings.TILE_SIZE_SQFT);
    const tileQuantityWithBreakage = Math.ceil(tileQuantityInitial * 1.1);
    
    const tileMaterialCost = tileQuantityWithBreakage * calculatorSettings.TILE_COST_PER_UNIT;
    const tilingLaborCost = totalArea * calculatorSettings.TILING_LABOR_RATE;
    const totalTilingCost = tileMaterialCost + tilingLaborCost;
    
    const electricalFixturesPrice = Object.entries(formData.electricalFixtures)
      .filter(([_, isSelected]) => isSelected)
      .reduce((sum, [fixture]) => {
        return sum + (electricalFixturePricing[fixture]?.price || 0);
      }, 0);
    
    const PLUMBING_RATES = {
      complete: 1500,
      fixtureOnly: 800
    };
    const plumbingFixturePrice = formData.plumbingRequirements ? 
      PLUMBING_RATES[formData.plumbingRequirements] : 0;
    const plumbingAreaPrice = floorArea * calculatorSettings.PLUMBING_RATE_PER_SQFT;
    const plumbingPrice = plumbingFixturePrice + plumbingAreaPrice;
    
    const additionalFixturesPrice = Object.entries(formData.additionalFixtures)
      .filter(([_, isSelected]) => isSelected)
      .reduce((sum, [fixture]) => {
        return sum + (additionalFixturePricing[fixture]?.price || 0);
      }, 0);
    
    const selectedBrand = brands.find(brand => brand.id === formData.brandSelection);
    const brandPremium = selectedBrand ? selectedBrand.clientPrice : 0;
    
    const basePrice = 0;
    
    const subtotal = electricalFixturesPrice + plumbingPrice + additionalFixturesPrice + brandPremium + totalTilingCost;
    const timelineDiscount = formData.projectTimeline === 'flexible' ? subtotal * 0.05 : 0;
    
    const total = subtotal - timelineDiscount;
    
    setBreakdown({
      basePrice,
      electricalFixturesPrice,
      plumbingPrice,
      additionalFixturesPrice,
      brandPremium,
      timelineDiscount,
      floorArea,
      wallArea,
      totalArea,
      tileQuantityInitial,
      tileQuantityWithBreakage,
      tileMaterialCost,
      tilingLaborCost,
      totalTilingCost,
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
  
  const handleSaveSubmission = async () => {
    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          customer_details: formData.customerDetails,
          estimate_amount: breakdown.total,
          form_data: formData,
          breakdown: breakdown,
          status: 'new',
          submitted_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success('Submission saved successfully!');
    } catch (error) {
      console.error('Error saving submission:', error);
      toast.error('Failed to save submission. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleStartNew = () => {
    onReset();
  };
  
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
                
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h4 className="font-medium mb-2">Fixture Costs</h4>
                    <div className="space-y-2">
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
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <h4 className="font-medium mb-2">Tiling Work</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Floor Area</span>
                        <span>{formatINR(breakdown.floorArea)} sq ft</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Wall Area</span>
                        <span>{formatINR(breakdown.wallArea)} sq ft</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Area</span>
                        <span>{formatINR(breakdown.totalArea)} sq ft</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Initial Tile Quantity</span>
                        <span>{breakdown.tileQuantityInitial} tiles</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tile Quantity with 10% Breakage</span>
                        <span>{breakdown.tileQuantityWithBreakage} tiles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tile Material Cost</span>
                        <span className="flex items-center">
                          <IndianRupee size={16} className="mr-1" />
                          {formatINR(breakdown.tileMaterialCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiling Labor Cost</span>
                        <span className="flex items-center">
                          <IndianRupee size={16} className="mr-1" />
                          {formatINR(breakdown.tilingLaborCost)}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Tiling Cost</span>
                        <span className="flex items-center">
                          <IndianRupee size={16} className="mr-1" />
                          {formatINR(breakdown.totalTilingCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
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
            <Button onClick={handleSaveSubmission} className="flex-1 gap-2" variant="default" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Submission
                </>
              )}
            </Button>
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
