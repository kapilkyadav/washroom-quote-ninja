
import { useState } from 'react';
import { CalculatorFormData } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerDetailsStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

const CustomerDetailsStep = ({ formData, updateFormData }: CustomerDetailsStepProps) => {
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate inputs
    let error = '';
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address';
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    
    // Update form data
    updateFormData('customerDetails', {
      ...formData.customerDetails,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Your Contact Information</h2>
        <p className="text-muted-foreground">
          We need your details to provide you with a personalized quote.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            value={formData.customerDetails.name}
            onChange={handleInputChange}
            required
          />
          {validationErrors.name && (
            <p className="text-sm text-destructive">{validationErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.customerDetails.email}
            onChange={handleInputChange}
            required
          />
          {validationErrors.email && (
            <p className="text-sm text-destructive">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.customerDetails.phone}
            onChange={handleInputChange}
            required
          />
          {validationErrors.phone && (
            <p className="text-sm text-destructive">{validationErrors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="City, State"
            value={formData.customerDetails.location}
            onChange={handleInputChange}
            required
          />
          {validationErrors.location && (
            <p className="text-sm text-destructive">{validationErrors.location}</p>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>
          By providing your contact information, you agree to our{' '}
          <a href="#" className="text-primary underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default CustomerDetailsStep;
