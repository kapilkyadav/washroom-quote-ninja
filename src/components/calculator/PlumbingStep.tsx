
import { CalculatorFormData } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Pipette, Wrench } from 'lucide-react';

interface PlumbingStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

const plumbingOptions = [
  {
    id: 'complete',
    title: 'Complete Plumbing',
    description: 'Full installation including pipes, fixtures, and connections',
    icon: <Pipette className="w-6 h-6 text-primary" />,
    price: 'Includes all plumbing work and materials'
  },
  {
    id: 'fixtureOnly',
    title: 'Fixture Installation Only',
    description: 'Installation of fixtures with existing plumbing connections',
    icon: <Wrench className="w-6 h-6 text-primary" />,
    price: 'Excludes new pipe installation and connections'
  }
];

const PlumbingStep = ({ formData, updateFormData }: PlumbingStepProps) => {
  const handlePlumbingChange = (value: string) => {
    updateFormData('plumbingRequirements', value as 'complete' | 'fixtureOnly');
  };
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">Plumbing Requirements</h2>
      
      <div className="max-w-3xl mx-auto">
        <RadioGroup 
          value={formData.plumbingRequirements} 
          onValueChange={handlePlumbingChange}
        >
          <div className="grid grid-cols-1 gap-6">
            {plumbingOptions.map((option) => (
              <div 
                key={option.id}
                className={`glass-card rounded-xl p-6 flex items-start gap-4 transition-all duration-300 ${
                  formData.plumbingRequirements === option.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:border-primary/30'
                }`}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                      {option.icon}
                    </div>
                    <Label htmlFor={option.id} className="text-lg font-medium cursor-pointer">
                      {option.title}
                    </Label>
                  </div>
                  <p className="text-muted-foreground mb-3">{option.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{option.price}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      option.id === 'complete' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {option.id === 'complete' ? 'Recommended' : 'Cost-Effective'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
        
        <div className="mt-8 p-5 bg-secondary/50 rounded-lg">
          <h3 className="font-medium mb-4">What's included?</h3>
          
          {formData.plumbingRequirements === 'complete' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">✓</div>
                <div>
                  <h4 className="font-medium">New Pipe Installation</h4>
                  <p className="text-sm text-muted-foreground">Complete water supply and drainage pipe installation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">✓</div>
                <div>
                  <h4 className="font-medium">Fixture Installation</h4>
                  <p className="text-sm text-muted-foreground">Installation of toilets, sinks, showers, and other fixtures</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">✓</div>
                <div>
                  <h4 className="font-medium">All Connections & Testing</h4>
                  <p className="text-sm text-muted-foreground">Water connections, pressure testing, and final quality checks</p>
                </div>
              </div>
            </div>
          ) : formData.plumbingRequirements === 'fixtureOnly' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">✓</div>
                <div>
                  <h4 className="font-medium">Fixture Installation Only</h4>
                  <p className="text-sm text-muted-foreground">Installation of toilets, sinks, showers, and other fixtures</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">✓</div>
                <div>
                  <h4 className="font-medium">Connection to Existing Plumbing</h4>
                  <p className="text-sm text-muted-foreground">Connecting fixtures to your existing plumbing lines</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-medium">✗</div>
                <div>
                  <h4 className="font-medium text-gray-400">New Pipe Installation</h4>
                  <p className="text-sm text-gray-400">Not included in this package</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Select a plumbing option to see what's included</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlumbingStep;
