
import { useEffect } from 'react';
import { CalculatorFormData } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Droplets, Bath, ShowerHead, Waves } from 'lucide-react';
import { useFixtures } from '@/hooks/use-fixtures';

interface AdditionalFixturesStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

const AdditionalFixturesStep = ({ formData, updateFormData }: AdditionalFixturesStepProps) => {
  // Use the fixtures hook to fetch bathroom fixtures
  const { fixtures, isLoading, fixturePricing } = useFixtures({ type: 'bathroom' });

  const handleCheckboxChange = (fixture: keyof typeof formData.additionalFixtures) => {
    const updatedFixtures = {
      ...formData.additionalFixtures,
      [fixture]: !formData.additionalFixtures[fixture]
    };
    
    updateFormData('additionalFixtures', updatedFixtures);
  };
  
  const getIcon = (fixture: string) => {
    switch(fixture) {
      case 'showerPartition':
        return <ShowerHead className="w-6 h-6 text-primary" />;
      case 'vanity':
        return <Droplets className="w-6 h-6 text-primary" />;
      case 'bathtub':
        return <Bath className="w-6 h-6 text-primary" />;
      case 'jacuzzi':
        return <Waves className="w-6 h-6 text-primary" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">Additional Fixtures</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {Object.entries(fixturePricing).map(([id, fixture]) => (
          <div 
            key={id}
            className={`glass-card rounded-xl p-6 transition-all duration-300 ${
              formData.additionalFixtures[id as keyof typeof formData.additionalFixtures] 
                ? 'ring-2 ring-primary shadow-md' 
                : 'hover:border-primary/30'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                {getIcon(id)}
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id={id}
                  checked={formData.additionalFixtures[id as keyof typeof formData.additionalFixtures] || false}
                  onCheckedChange={() => handleCheckboxChange(id as keyof typeof formData.additionalFixtures)}
                  className="mr-2"
                />
                <Label htmlFor={id} className="cursor-pointer">Select</Label>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-2">{fixture.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{fixture.description}</p>
            
            {/* Don't show actual backend pricing to customers */}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-5 bg-secondary/50 rounded-lg max-w-xl mx-auto">
        <h3 className="font-medium mb-2">Selected Items</h3>
        {Object.entries(formData.additionalFixtures).some(([_, isSelected]) => isSelected) ? (
          <ul className="space-y-2">
            {Object.entries(formData.additionalFixtures)
              .filter(([_, isSelected]) => isSelected)
              .map(([fixture]) => (
                <li key={fixture} className="flex justify-between">
                  <span>{fixturePricing[fixture]?.name || fixture}</span>
                  {/* Don't show prices to customers */}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No additional fixtures selected</p>
        )}
      </div>
    </div>
  );
};

export default AdditionalFixturesStep;
