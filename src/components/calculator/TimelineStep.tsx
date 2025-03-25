
import { CalculatorFormData } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Calendar } from 'lucide-react';

interface TimelineStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

const timelineOptions = [
  {
    id: 'standard',
    title: 'Standard Timeline',
    description: 'Complete project within 4 weeks',
    icon: <Clock className="w-6 h-6 text-primary" />,
    details: ['Quick turnaround', 'Dedicated team', 'Priority scheduling'],
    note: 'Our standard timeline ensures efficient completion without compromising quality'
  },
  {
    id: 'flexible',
    title: 'Flexible Timeline',
    description: 'Extended timeline beyond 4 weeks',
    icon: <Calendar className="w-6 h-6 text-primary" />,
    details: ['Relaxed schedule', 'Cost savings', 'Flexible coordination'],
    note: 'Choose this option for a 5% discount on your total project cost'
  }
];

const TimelineStep = ({ formData, updateFormData }: TimelineStepProps) => {
  const handleTimelineChange = (value: string) => {
    updateFormData('projectTimeline', value as 'standard' | 'flexible');
  };
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">Project Timeline</h2>
      
      <div className="max-w-3xl mx-auto">
        <RadioGroup 
          value={formData.projectTimeline} 
          onValueChange={handleTimelineChange}
        >
          <div className="grid grid-cols-1 gap-6">
            {timelineOptions.map((option) => (
              <div 
                key={option.id}
                className={`glass-card rounded-xl p-6 transition-all duration-300 ${
                  formData.projectTimeline === option.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-4">
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
                    <p className="text-muted-foreground mb-4">{option.description}</p>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg mb-3">
                      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {option.details.map((detail, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{option.note}</p>
                    
                    {option.id === 'flexible' && (
                      <div className="mt-3 px-3 py-2 bg-primary/10 rounded-lg inline-block">
                        <span className="text-sm font-medium text-primary">Save 5% on total cost</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
        
        <div className="mt-8 p-5 bg-secondary/50 rounded-lg">
          <h3 className="font-medium mb-3">Timeline Impact</h3>
          
          {formData.projectTimeline === 'standard' ? (
            <p className="text-sm">
              The standard timeline ensures your project is completed within 4 weeks. This includes all installation, 
              finishing work, and final inspections. Our team will work efficiently to deliver high-quality results 
              within this timeframe.
            </p>
          ) : formData.projectTimeline === 'flexible' ? (
            <p className="text-sm">
              By choosing the flexible timeline, you'll receive a 5% discount on your total project cost. This option 
              allows for more relaxed scheduling and coordination, with completion extending beyond the standard 
              4-week timeline based on your preferences and our team's availability.
            </p>
          ) : (
            <p className="text-muted-foreground">Select a timeline option to see the impact</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineStep;
