
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerDetailsStep from '../CustomerDetailsStep';
import { CalculatorFormData } from '@/types';

describe('CustomerDetailsStep', () => {
  const mockFormData: CalculatorFormData = {
    projectType: 'new',
    dimensions: { length: 10, width: 8, height: 9 },
    electricalFixtures: { ledMirror: false, exhaustFan: false, waterHeater: false },
    plumbingRequirements: 'complete',
    additionalFixtures: { showerPartition: false, vanity: false, bathtub: false, jacuzzi: false },
    projectTimeline: 'standard',
    brandSelection: 'brand1',
    customerDetails: {
      name: '',
      email: '',
      phone: '',
      location: ''
    }
  };
  
  const mockUpdateFormData = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders all form fields', () => {
    render(
      <CustomerDetailsStep 
        formData={mockFormData}
        updateFormData={mockUpdateFormData}
      />
    );
    
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  });
  
  test('validates email input correctly', () => {
    render(
      <CustomerDetailsStep 
        formData={mockFormData}
        updateFormData={mockUpdateFormData}
      />
    );
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    
    // Invalid email
    fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email' } });
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    
    // Valid email
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
  });
  
  test('accepts valid mobile number formats', () => {
    render(
      <CustomerDetailsStep 
        formData={mockFormData}
        updateFormData={mockUpdateFormData}
      />
    );
    
    const phoneInput = screen.getByLabelText(/Mobile Number/i);
    
    // Test various valid formats
    const validPhoneNumbers = [
      '+919876543210',
      '+91 9876543210',
      '9876543210',
      '(91) 98765-43210',
      '+1-123-456-7890',
      '123.456.7890'
    ];
    
    validPhoneNumbers.forEach(phoneNumber => {
      fireEvent.change(phoneInput, { target: { name: 'phone', value: phoneNumber } });
      expect(screen.queryByText(/Please enter a valid phone number/i)).not.toBeInTheDocument();
    });
  });
  
  test('rejects invalid mobile number formats', () => {
    render(
      <CustomerDetailsStep 
        formData={mockFormData}
        updateFormData={mockUpdateFormData}
      />
    );
    
    const phoneInput = screen.getByLabelText(/Mobile Number/i);
    
    // Invalid phone number (contains letters)
    fireEvent.change(phoneInput, { target: { name: 'phone', value: '98765ABC10' } });
    expect(screen.getByText(/Please enter a valid phone number/i)).toBeInTheDocument();
    
    // Too short
    fireEvent.change(phoneInput, { target: { name: 'phone', value: '123' } });
    expect(screen.getByText(/Please enter a valid phone number/i)).toBeInTheDocument();
  });
  
  test('calls updateFormData with correct values', () => {
    render(
      <CustomerDetailsStep 
        formData={mockFormData}
        updateFormData={mockUpdateFormData}
      />
    );
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { 
      target: { name: 'name', value: 'John Doe' } 
    });
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('customerDetails', {
      ...mockFormData.customerDetails,
      name: 'John Doe'
    });
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), { 
      target: { name: 'email', value: 'john@example.com' } 
    });
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('customerDetails', {
      ...mockFormData.customerDetails,
      email: 'john@example.com'
    });
  });
});
