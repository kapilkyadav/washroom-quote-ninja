
import { CalculatorFormData } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface CustomerDetailsStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

const CustomerDetailsStep = ({ formData, updateFormData }: CustomerDetailsStepProps) => {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  }>({});
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePhone = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone.replace(/[^\d]/g, ''));
  };
  
  const handleInputChange = (field: keyof typeof formData.customerDetails, value: string) => {
    // Clear previous error
    setErrors(prev => ({ ...prev, [field]: undefined }));
    
    // Validate input
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    }
    
    if (field === 'phone' && value && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit phone number' }));
    }
    
    // Update form data
    const updatedDetails = {
      ...formData.customerDetails,
      [field]: value
    };
    
    updateFormData('customerDetails', updatedDetails);
  };
  
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    handleInputChange('phone', formattedValue);
  };
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">Your Details</h2>
      
      <div className="max-w-lg mx-auto glass-card rounded-xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.customerDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-field h-12"
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.customerDetails.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="input-field h-12"
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base">Phone Number</Label>
            <Input
              id="phone"
              placeholder="(123) 456-7890"
              value={formData.customerDetails.phone}
              onChange={handlePhoneChange}
              className="input-field h-12"
            />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">Location</Label>
            <Input
              id="location"
              placeholder="City, State"
              value={formData.customerDetails.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="input-field h-12"
            />
            {errors.location && <p className="text-destructive text-sm">{errors.location}</p>}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            By submitting this form, you agree to receive your personalized washroom estimate.
            We'll securely store your information in accordance with our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsStep;
