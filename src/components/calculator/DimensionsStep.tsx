
import { useState, useEffect } from 'react';
import { CalculatorFormData } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DimensionsStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

const DimensionsStep = ({ formData, updateFormData }: DimensionsStepProps) => {
  const [length, setLength] = useState<string>(formData.dimensions.length.toString() || '');
  const [width, setWidth] = useState<string>(formData.dimensions.width.toString() || '');
  const [error, setError] = useState<{length?: string; width?: string}>({});
  
  const validateAndUpdate = (
    field: 'length' | 'width', 
    value: string
  ) => {
    // Clear previous errors
    setError(prev => ({...prev, [field]: undefined}));
    
    // Check if it's a valid number
    if (value && !/^\d*\.?\d*$/.test(value)) {
      setError(prev => ({...prev, [field]: 'Please enter a valid number'}));
      return;
    }
    
    // Convert to number and validate
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setError(prev => ({...prev, [field]: 'Please enter a valid number'}));
      return;
    }
    
    if (numValue <= 0) {
      setError(prev => ({...prev, [field]: 'Value must be greater than 0'}));
      return;
    }
    
    if (numValue > 100) {
      setError(prev => ({...prev, [field]: 'Value must be less than 100'}));
      return;
    }
    
    // Update state
    if (field === 'length') {
      setLength(value);
    } else {
      setWidth(value);
    }
    
    // Update form data if both values are valid
    const newDimensions = {
      ...formData.dimensions,
      [field]: numValue,
      height: 9 // Fixed at 9 feet
    };
    
    updateFormData('dimensions', newDimensions);
  };
  
  // Animation for the washroom preview
  useEffect(() => {
    const timer = setTimeout(() => {
      const previewElement = document.getElementById('dimensions-preview');
      if (previewElement) {
        previewElement.classList.add('scale-100', 'opacity-100');
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const areaSquareFeet = (parseFloat(length) || 0) * (parseFloat(width) || 0);
  const wallArea = 2 * ((parseFloat(length) || 0) + (parseFloat(width) || 0)) * 9; // Wall area calculation
  const totalArea = areaSquareFeet + wallArea;
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">What are your washroom dimensions?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="length">Length (feet)</Label>
            <Input
              id="length"
              type="text"
              inputMode="decimal"
              placeholder="Enter length"
              value={length}
              onChange={(e) => validateAndUpdate('length', e.target.value)}
              className="input-field"
            />
            {error.length && <p className="text-destructive text-sm">{error.length}</p>}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="width">Width (feet)</Label>
            <Input
              id="width"
              type="text"
              inputMode="decimal"
              placeholder="Enter width"
              value={width}
              onChange={(e) => validateAndUpdate('width', e.target.value)}
              className="input-field"
            />
            {error.width && <p className="text-destructive text-sm">{error.width}</p>}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="height">Height (feet)</Label>
            <Input
              id="height"
              type="number"
              value="9"
              disabled
              className="input-field opacity-70"
            />
            <p className="text-sm text-muted-foreground">Standard height is fixed at 9 feet</p>
          </div>
          
          {isNaN(areaSquareFeet) || areaSquareFeet <= 0 ? (
            <p className="text-muted-foreground mt-4">Enter valid dimensions to see the total area</p>
          ) : (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg space-y-2">
              <p className="text-base">Floor Area: <span className="font-semibold text-primary">{areaSquareFeet.toFixed(2)} sq ft</span></p>
              <p className="text-base">Wall Area: <span className="font-semibold text-primary">{wallArea.toFixed(2)} sq ft</span></p>
              <p className="text-lg font-medium pt-2 border-t">Total Area: <span className="font-semibold text-primary">{totalArea.toFixed(2)} sq ft</span></p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <div 
            id="dimensions-preview"
            className="relative w-full h-64 border-2 border-dashed border-primary/40 rounded-lg overflow-hidden transform scale-95 opacity-0 transition-all duration-700"
            style={{
              width: `${Math.min(parseFloat(length) || 1, 10) * 30}px`,
              height: `${Math.min(parseFloat(width) || 1, 10) * 20}px`,
              maxWidth: '100%',
              maxHeight: '300px',
              minWidth: '200px',
              minHeight: '150px'
            }}
          >
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm"></div>
            
            {parseFloat(length) > 0 && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 text-xs font-medium rounded-full">
                {parseFloat(length).toFixed(1)}ft
              </div>
            )}
            
            {parseFloat(width) > 0 && (
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-white px-2 py-1 text-xs font-medium rounded-full">
                {parseFloat(width).toFixed(1)}ft
              </div>
            )}
            
            <div className="flex items-center justify-center h-full text-primary/70">
              <p className="text-xs md:text-sm font-medium">Washroom Layout Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionsStep;
