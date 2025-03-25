
import { useState } from 'react';
import { CalculatorFormData } from '@/types';
import { Building2, Hammer } from 'lucide-react';

interface ProjectTypeStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

const ProjectTypeStep = ({ formData, updateFormData }: ProjectTypeStepProps) => {
  const [selected, setSelected] = useState<'new' | 'renovation' | ''>(formData.projectType);
  
  const handleSelection = (type: 'new' | 'renovation') => {
    setSelected(type);
    updateFormData('projectType', type);
  };
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">What type of project are you planning?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div 
          className={`glass-card rounded-2xl p-8 text-center cursor-pointer hover-scale ${
            selected === 'new' ? 'ring-2 ring-primary shadow-md' : ''
          }`}
          onClick={() => handleSelection('new')}
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-primary/10 rounded-full">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="heading-3 mb-2">New Construction</h3>
          <p className="text-muted-foreground">Building a brand new washroom from scratch</p>
        </div>
        
        <div 
          className={`glass-card rounded-2xl p-8 text-center cursor-pointer hover-scale ${
            selected === 'renovation' ? 'ring-2 ring-primary shadow-md' : ''
          }`}
          onClick={() => handleSelection('renovation')}
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-primary/10 rounded-full">
            <Hammer className="w-8 h-8 text-primary" />
          </div>
          <h3 className="heading-3 mb-2">Renovation</h3>
          <p className="text-muted-foreground">Upgrading or remodeling an existing washroom</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeStep;
