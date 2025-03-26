
import { CalculatorFormData, FixturePricing } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Droplets, Square, Bath, Waves, IndianRupee } from 'lucide-react';

interface AdditionalFixturesStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

// Updated fixture pricing to match admin panel values
const fixtures: FixturePricing = {
  showerPartition: {
    name: 'Shower Partition',
    price: 450,
    description: 'Tempered glass shower enclosure with hardware'
  },
  vanity: {
    name: 'Vanity',
    price: 380,
    description: 'Stylish vanity unit with storage and mirror'
  },
  bathtub: {
    name: 'Bathtub',
    price: 650,
    description: 'Premium acrylic bathtub with fixtures'
  },
  jacuzzi: {
    name: 'Jacuzzi',
    price: 1200,
    description: 'Luxury jacuzzi with multiple jets and controls'
  }
};

const AdditionalFixturesStep = ({ formData, updateFormData }: AdditionalFixturesStepProps) => {
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
        return <Droplets className="w-6 h-6 text-primary" />;
      case 'vanity':
        return <Square className="w-6 h-6 text-primary" />;
      case 'bathtub':
        return <Bath className="w-6 h-6 text-primary" />;
      case 'jacuzzi':
        return <Waves className="w-6 h-6 text-primary" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">Additional Fixtures</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {Object.entries(fixtures).map(([id, fixture]) => (
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
                  checked={formData.additionalFixtures[id as keyof typeof formData.additionalFixtures]}
                  onCheckedChange={() => handleCheckboxChange(id as keyof typeof formData.additionalFixtures)}
                  className="mr-2"
                />
                <Label htmlFor={id} className="cursor-pointer">Select</Label>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-2">{fixture.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{fixture.description}</p>
            
            <div className="flex items-center text-sm font-medium">
              <IndianRupee className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{fixture.price.toLocaleString('en-IN')}</span>
            </div>
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
                  <span>{fixtures[fixture].name}</span>
                  <span className="flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {fixtures[fixture].price.toLocaleString('en-IN')}
                  </span>
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
