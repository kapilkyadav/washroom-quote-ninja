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
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };
  
  const handleInputChange = (field: keyof typeof formData.customerDetails, value: string) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
    
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    }
    
    if (field === 'phone' && value && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
    }
    
    const updatedDetails = {
      ...formData.customerDetails,
      [field]: value
    };
    
    updateFormData('customerDetails', updatedDetails);
  };
  
  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const limitedDigits = digitsOnly.slice(0, 10);
    
    if (limitedDigits.length === 0) {
      return '+91 ';
    } else {
      return `+91 ${limitedDigits}`;
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    if (!inputValue.startsWith('+91')) {
      inputValue = '+91 ' + inputValue.replace(/^\+91\s?/, '');
    }
    
    const formattedValue = formatPhoneNumber(inputValue);
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
              placeholder="+91 "
              value={formData.customerDetails.phone || '+91 '}
              onChange={handlePhoneChange}
              className="input-field h-12"
            />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
            <p className="text-xs text-muted-foreground">Enter a 10-digit Indian mobile number</p>
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
