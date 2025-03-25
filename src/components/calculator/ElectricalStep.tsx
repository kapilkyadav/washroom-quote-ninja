
import { CalculatorFormData, FixturePricing } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Lightbulb, Fan, Flame } from 'lucide-react';

interface ElectricalStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

// Mock fixture pricing - in a real app this would come from an API or admin settings
const fixtures: FixturePricing = {
  ledMirror: {
    name: 'LED Mirror',
    price: 150,
    description: 'Energy-efficient LED mirror with anti-fog technology'
  },
  exhaustFan: {
    name: 'Exhaust Fan',
    price: 120,
    description: 'Quiet operation with humidity sensor'
  },
  waterHeater: {
    name: 'Water Heater',
    price: 350,
    description: 'Energy-efficient instant water heating'
  }
};

const ElectricalStep = ({ formData, updateFormData }: ElectricalStepProps) => {
  const handleCheckboxChange = (fixture: keyof typeof formData.electricalFixtures) => {
    const updatedFixtures = {
      ...formData.electricalFixtures,
      [fixture]: !formData.electricalFixtures[fixture]
    };
    
    updateFormData('electricalFixtures', updatedFixtures);
  };
  
  const getIcon = (fixture: string) => {
    switch(fixture) {
      case 'ledMirror':
        return <Lightbulb className="w-6 h-6 text-primary" />;
      case 'exhaustFan':
        return <Fan className="w-6 h-6 text-primary" />;
      case 'waterHeater':
        return <Flame className="w-6 h-6 text-primary" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">Select Electrical Fixtures</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {Object.entries(fixtures).map(([id, fixture]) => (
          <div 
            key={id}
            className={`glass-card rounded-xl p-6 transition-all duration-300 ${
              formData.electricalFixtures[id as keyof typeof formData.electricalFixtures] 
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
                  checked={formData.electricalFixtures[id as keyof typeof formData.electricalFixtures]}
                  onCheckedChange={() => handleCheckboxChange(id as keyof typeof formData.electricalFixtures)}
                  className="mr-2"
                />
                <Label htmlFor={id} className="cursor-pointer">Select</Label>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-2">{fixture.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{fixture.description}</p>
            
            <div className="text-lg font-semibold">${fixture.price}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-5 bg-secondary/50 rounded-lg max-w-xl mx-auto">
        <h3 className="font-medium mb-2">Selected Items</h3>
        {Object.entries(formData.electricalFixtures).some(([_, isSelected]) => isSelected) ? (
          <ul className="space-y-2">
            {Object.entries(formData.electricalFixtures)
              .filter(([_, isSelected]) => isSelected)
              .map(([fixture]) => (
                <li key={fixture} className="flex justify-between">
                  <span>{fixtures[fixture].name}</span>
                  <span className="font-medium">${fixtures[fixture].price}</span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No electrical fixtures selected</p>
        )}
      </div>
    </div>
  );
};

export default ElectricalStep;
