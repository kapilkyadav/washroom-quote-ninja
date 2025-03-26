import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculatorFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProgressBar from '@/components/calculator/ProgressBar';
import ProjectTypeStep from '@/components/calculator/ProjectTypeStep';
import DimensionsStep from '@/components/calculator/DimensionsStep';
import ElectricalStep from '@/components/calculator/ElectricalStep';
import PlumbingStep from '@/components/calculator/PlumbingStep';
import AdditionalFixturesStep from '@/components/calculator/AdditionalFixturesStep';
import TimelineStep from '@/components/calculator/TimelineStep';
import BrandSelectionStep from '@/components/calculator/BrandSelectionStep';
import CustomerDetailsStep from '@/components/calculator/CustomerDetailsStep';
import EstimateResultStep from '@/components/calculator/EstimateResultStep';
import { toast } from 'sonner';

const Calculator = () => {
  const navigate = useNavigate();
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<CalculatorFormData>({
    projectType: '',
    dimensions: {
      length: 0,
      width: 0,
      height: 9, // Fixed at 9 feet
    },
    electricalFixtures: {
      ledMirror: false,
      exhaustFan: false,
      waterHeater: false,
    },
    plumbingRequirements: '',
    additionalFixtures: {
      showerPartition: false,
      vanity: false,
      bathtub: false,
      jacuzzi: false,
    },
    projectTimeline: '',
    brandSelection: '',
    customerDetails: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9; // Including the results step
  
  // Update form data for a specific field
  const updateFormData = (field: keyof CalculatorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Check if the current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Project Type
        return !!formData.projectType;
      case 2: // Dimensions
        return formData.dimensions.length > 0 && formData.dimensions.width > 0;
      case 3: // Electrical Fixtures
        return true; // Optional selection
      case 4: // Plumbing Requirements
        return !!formData.plumbingRequirements;
      case 5: // Additional Fixtures
        return true; // Optional selection
      case 6: // Project Timeline
        return !!formData.projectTimeline;
      case 7: // Brand Selection
        return !!formData.brandSelection;
      case 8: // Customer Details
        return (
          !!formData.customerDetails.name &&
          !!formData.customerDetails.email &&
          !!formData.customerDetails.phone &&
          !!formData.customerDetails.location
        );
      default:
        return true;
    }
  };
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Save form progress to local storage
      try {
        localStorage.setItem('calculatorFormData', JSON.stringify(formData));
        localStorage.setItem('calculatorStep', String(currentStep + 1));
      } catch (error) {
        console.error('Error saving form data to local storage:', error);
      }
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update step in local storage
      try {
        localStorage.setItem('calculatorStep', String(currentStep - 1));
      } catch (error) {
        console.error('Error saving step to local storage:', error);
      }
    }
  };
  
  // Reset form and start over
  const handleReset = () => {
    setFormData({
      projectType: '',
      dimensions: {
        length: 0,
        width: 0,
        height: 9,
      },
      electricalFixtures: {
        ledMirror: false,
        exhaustFan: false,
        waterHeater: false,
      },
      plumbingRequirements: '',
      additionalFixtures: {
        showerPartition: false,
        vanity: false,
        bathtub: false,
        jacuzzi: false,
      },
      projectTimeline: '',
      brandSelection: '',
      customerDetails: {
        name: '',
        email: '',
        phone: '',
        location: '',
      },
    });
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Clear saved data from local storage
    try {
      localStorage.removeItem('calculatorFormData');
      localStorage.removeItem('calculatorStep');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
    
    toast.success('Started a new quote calculation');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectTypeStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <DimensionsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <ElectricalStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PlumbingStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <AdditionalFixturesStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <TimelineStep formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <BrandSelectionStep formData={formData} updateFormData={updateFormData} />;
      case 8:
        return <CustomerDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 9:
        return <EstimateResultStep formData={formData} onSubmitAnother={handleReset} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="heading-1 mb-4">Washroom Quote Calculator</h1>
            <p className="subtitle max-w-2xl mx-auto">
              Get an accurate estimate for your custom washroom project in just a few steps.
            </p>
          </div>
          
          {currentStep < totalSteps && (
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          )}
          
          <div className="glass-card rounded-xl p-6 md:p-10 mb-10">
            {renderStep()}
          </div>
          
          {currentStep < totalSteps && (
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="gap-2"
                disabled={currentStep === 1}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="gap-2"
                disabled={!isStepValid()}
              >
                {currentStep === totalSteps - 1 ? 'Get Estimate' : 'Next'}
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calculator;
