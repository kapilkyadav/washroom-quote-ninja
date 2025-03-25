
import { useState, useEffect } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Calculate percentage and add animation
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep, totalSteps]);
  
  return (
    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-8">
      <div 
        className="h-full bg-primary transition-all duration-700 ease-in-out" 
        style={{ width: `${width}%` }} 
      />
    </div>
  );
};

export default ProgressBar;
