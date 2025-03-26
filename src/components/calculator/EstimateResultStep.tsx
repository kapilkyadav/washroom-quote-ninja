
import { useEffect, useState } from 'react';
import { Copy, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { CalculatorFormData, Brand, EstimateBreakdown, CalcSubmission, DbSubmission, Json } from '@/types';
import { supabase } from '@/lib/supabase';

interface EstimateResultStepProps {
  formData: CalculatorFormData;
  onSubmitAnother: () => void;
}

const EstimateResultStep = ({ formData, onSubmitAnother }: EstimateResultStepProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimate, setEstimate] = useState<EstimateBreakdown>({
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
  const [brands, setBrands] = useState<Record<string, Brand>>({
    'premium': { id: 'premium', name: 'Premium', clientPrice: 1.3, quotationPrice: 1.35, margin: 1.05 },
    'standard': { id: 'standard', name: 'Standard', clientPrice: 1, quotationPrice: 1.05, margin: 1.05 },
    'budget': { id: 'budget', name: 'Budget', clientPrice: 0.9, quotationPrice: 0.95, margin: 1.05 }
  });
  const [electricalFixtures, setElectricalFixtures] = useState<Record<string, number>>({});
  const [bathroomFixtures, setBathroomFixtures] = useState<Record<string, number>>({});
  const [calculatorSettings, setCalculatorSettings] = useState({
    plumbingRatePerSqFt: 50,
    tileCostPerUnit: 80,
    tilingLaborRate: 85
  });

  // Fetch all required data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate estimate when data is loaded and when form data changes
  useEffect(() => {
    calculateEstimate();
  }, [formData, electricalFixtures, bathroomFixtures, calculatorSettings]);

  const fetchData = async () => {
    try {
      // Fetch calculator settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select()
        .eq('category', 'calculator')
        .single();
      
      if (!settingsError && settingsData) {
        const settings = settingsData.settings as any;
        setCalculatorSettings({
          plumbingRatePerSqFt: settings.plumbingRatePerSqFt || 50,
          tileCostPerUnit: settings.tileCostPerUnit || 80,
          tilingLaborRate: settings.tilingLaborRate || 85,
        });
      }

      // Fetch electrical fixtures
      const { data: electricalData, error: electricalError } = await supabase
        .from('fixtures')
        .select()
        .eq('type', 'electrical');
      
      if (!electricalError && electricalData) {
        const fixtures: Record<string, number> = {};
        electricalData.forEach(item => {
          fixtures[item.fixture_id] = item.price;
        });
        setElectricalFixtures(fixtures);
      }

      // Fetch bathroom fixtures
      const { data: bathroomData, error: bathroomError } = await supabase
        .from('fixtures')
        .select()
        .eq('type', 'bathroom');
      
      if (!bathroomError && bathroomData) {
        const fixtures: Record<string, number> = {};
        bathroomData.forEach(item => {
          fixtures[item.fixture_id] = item.price;
        });
        setBathroomFixtures(fixtures);
      }
    } catch (error) {
      console.error('Error fetching data for estimate calculation:', error);
    }
  };

  const calculateEstimate = () => {
    const { length, width, height } = formData.dimensions;
    
    // Calculate areas
    const floorArea = length * width;
    const wallArea = 2 * (length + width) * height;
    const totalArea = floorArea + wallArea;
    
    // Calculate tile quantities with 10% extra for breakage
    const tileQuantityInitial = Math.ceil(totalArea / 4); // Each tile covers 4 sq ft
    const tileQuantityWithBreakage = Math.ceil(tileQuantityInitial * 1.1);
    
    // Calculate material and labor costs for tiling
    const tileMaterialCost = tileQuantityWithBreakage * calculatorSettings.tileCostPerUnit;
    const tilingLaborCost = totalArea * calculatorSettings.tilingLaborRate;
    const totalTilingCost = tileMaterialCost + tilingLaborCost;
    
    // Calculate base price
    const basePrice = totalTilingCost;
    
    // Calculate other components
    let electricalFixturesPrice = 0;
    Object.entries(formData.electricalFixtures).forEach(([key, isSelected]) => {
      if (isSelected && electricalFixtures[key]) {
        electricalFixturesPrice += electricalFixtures[key];
      }
    });
    
    let additionalFixturesPrice = 0;
    Object.entries(formData.additionalFixtures).forEach(([key, isSelected]) => {
      if (isSelected && bathroomFixtures[key]) {
        additionalFixturesPrice += bathroomFixtures[key];
      }
    });
    
    // Calculate plumbing price
    let plumbingPrice = 0;
    if (formData.plumbingRequirements === 'complete') {
      plumbingPrice = floorArea * calculatorSettings.plumbingRatePerSqFt;
    } else if (formData.plumbingRequirements === 'fixtureOnly') {
      plumbingPrice = floorArea * calculatorSettings.plumbingRatePerSqFt * 0.6;
    }
    
    // Apply brand premium
    const brandMultiplier = brands[formData.brandSelection]?.clientPrice || 1;
    const brandPremium = (basePrice + electricalFixturesPrice + plumbingPrice + additionalFixturesPrice) * (brandMultiplier - 1);
    
    // Apply timeline discount
    let timelineDiscount = 0;
    if (formData.projectTimeline === 'flexible') {
      timelineDiscount = (basePrice + electricalFixturesPrice + plumbingPrice + additionalFixturesPrice + brandPremium) * 0.05;
    }
    
    // Calculate total
    const total = basePrice + electricalFixturesPrice + plumbingPrice + additionalFixturesPrice + brandPremium - timelineDiscount;
    
    // Set the complete estimate breakdown
    setEstimate({
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

  const handleSaveQuote = async () => {
    if (isSubmitted) {
      onSubmitAnother();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submission: DbSubmission = {
        customer_details: formData.customerDetails as unknown as Json,
        estimate_amount: estimate.total,
        form_data: formData as unknown as Json,
        breakdown: estimate as unknown as Json,
        status: 'new',
        submitted_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('submissions')
        .insert(submission);
      
      if (error) throw error;
      
      toast({
        title: "Estimate saved!",
        description: "Your estimate has been saved. You will hear from us soon.",
        variant: "default",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving submission:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToClipboard = () => {
    // Format estimate details
    const estimateText = `
      Bathroom Renovation Estimate
      --------------------------
      Customer: ${formData.customerDetails.name}
      Email: ${formData.customerDetails.email}
      Phone: ${formData.customerDetails.phone}
      Location: ${formData.customerDetails.location}
      
      Project Details:
      - Type: ${formData.projectType === 'new' ? 'New Construction' : 'Renovation'}
      - Dimensions: ${formData.dimensions.length}ft x ${formData.dimensions.width}ft x ${formData.dimensions.height}ft
      - Brand: ${brands[formData.brandSelection]?.name || formData.brandSelection}
      - Timeline: ${formData.projectTimeline === 'standard' ? 'Standard' : 'Flexible'}
      
      Estimate Breakdown:
      - Tiling: ₹${Math.round(estimate.totalTilingCost).toLocaleString()}
      - Electrical Fixtures: ₹${Math.round(estimate.electricalFixturesPrice).toLocaleString()}
      - Plumbing: ₹${Math.round(estimate.plumbingPrice).toLocaleString()}
      - Additional Fixtures: ₹${Math.round(estimate.additionalFixturesPrice).toLocaleString()}
      - Brand Premium: ₹${Math.round(estimate.brandPremium).toLocaleString()}
      - Timeline Discount: -₹${Math.round(estimate.timelineDiscount).toLocaleString()}
      
      Total Estimate: ₹${Math.round(estimate.total).toLocaleString()}
    `.replace(/      /g, '');
    
    navigator.clipboard.writeText(estimateText);
    
    toast({
      title: "Copied to clipboard",
      description: "Estimate details have been copied to your clipboard.",
      variant: "default",
    });
  };

  // Function to format currency amounts
  const formatCurrency = (amount: number) => {
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  return (
    <div className="space-y-8 py-4 animate-slide-in">
      <div className="text-center">
        <h2 className="heading-2 mb-2">Your Bathroom Estimate</h2>
        <p className="text-muted-foreground">
          Below is the estimate for your bathroom project based on the information provided
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span>Estimate Summary</span>
              <span className="text-2xl font-bold">{formatCurrency(estimate.total)}</span>
            </CardTitle>
            <CardDescription>
              For {formData.dimensions.length}ft x {formData.dimensions.width}ft x {formData.dimensions.height}ft bathroom
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Tiling (Material & Labor)</TableCell>
                  <TableCell className="text-right">{formatCurrency(estimate.totalTilingCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Electrical Fixtures</TableCell>
                  <TableCell className="text-right">{formatCurrency(estimate.electricalFixturesPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Plumbing</TableCell>
                  <TableCell className="text-right">{formatCurrency(estimate.plumbingPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Additional Fixtures</TableCell>
                  <TableCell className="text-right">{formatCurrency(estimate.additionalFixturesPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand Premium ({brands[formData.brandSelection]?.name || 'Standard'})</TableCell>
                  <TableCell className="text-right">{formatCurrency(estimate.brandPremium)}</TableCell>
                </TableRow>
                {estimate.timelineDiscount > 0 && (
                  <TableRow>
                    <TableCell>Flexible Timeline Discount</TableCell>
                    <TableCell className="text-right text-green-600">-{formatCurrency(estimate.timelineDiscount)}</TableCell>
                  </TableRow>
                )}
                <TableRow className="font-bold">
                  <TableCell>Total Estimate</TableCell>
                  <TableCell className="text-right text-lg">{formatCurrency(estimate.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-6 space-y-3 text-sm">
              <p><span className="font-medium">Notes:</span> This estimate is valid for 30 days from today.</p>
              <p>A site visit will be conducted before finalizing the quote to address specific requirements.</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
            
            <Button 
              disabled={isSubmitting}
              onClick={handleSaveQuote}
              className="gap-2"
            >
              {isSubmitting ? (
                <>Saving...</>
              ) : isSubmitted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Start New Estimate
                </>
              ) : (
                <>Save Estimate</>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-lg">Customer Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
              <p>{formData.customerDetails.name}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
              <p>{formData.customerDetails.email}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
              <p>{formData.customerDetails.phone}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
              <p>{formData.customerDetails.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateResultStep;
