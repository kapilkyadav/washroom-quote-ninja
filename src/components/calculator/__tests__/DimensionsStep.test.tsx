
import { render, screen, fireEvent } from '@testing-library/react';
import DimensionsStep from '../DimensionsStep';
import { CalculatorFormData } from '@/types';

describe('DimensionsStep', () => {
  const mockFormData: CalculatorFormData = {
    projectType: 'new',
    dimensions: {
      length: 10,
      width: 8,
      height: 9,
    },
    electricalFixtures: {
      ledMirror: false,
      exhaustFan: false,
      waterHeater: false,
    },
    plumbingRequirements: '',
    additionalFixtures: {
      showerPartition: false,
      vanity: false,
      bathtub: false,
      jacuzzi: false,
    },
    projectTimeline: '',
    brandSelection: '',
    customerDetails: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
  };

  const mockUpdateFormData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with initial values', () => {
    render(
      <DimensionsStep 
        formData={mockFormData} 
        updateFormData={mockUpdateFormData} 
      />
    );

    expect(screen.getByText('What are your washroom dimensions?')).toBeInTheDocument();
    expect(screen.getByLabelText('Length (feet)')).toHaveValue(10);
    expect(screen.getByLabelText('Width (feet)')).toHaveValue(8);
    expect(screen.getByLabelText('Height (feet)')).toBeDisabled();
    expect(screen.getByText('Total Area:')).toBeInTheDocument();
    expect(screen.getByText('80.00 sq ft')).toBeInTheDocument();
  });

  test('updates form data when dimensions change', () => {
    render(
      <DimensionsStep 
        formData={mockFormData} 
        updateFormData={mockUpdateFormData} 
      />
    );

    // Change length value
    fireEvent.change(screen.getByLabelText('Length (feet)'), { target: { value: '12' } });
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('dimensions', {
      length: 12,
      width: 8,
      height: 9,
    });

    // Change width value
    fireEvent.change(screen.getByLabelText('Width (feet)'), { target: { value: '10' } });
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('dimensions', {
      length: 10,
      width: 10,
      height: 9,
    });
  });

  test('shows error when invalid dimensions are entered', () => {
    render(
      <DimensionsStep 
        formData={mockFormData} 
        updateFormData={mockUpdateFormData} 
      />
    );

    // Enter invalid value
    fireEvent.change(screen.getByLabelText('Length (feet)'), { target: { value: '-1' } });
    
    expect(screen.getByText('Value must be greater than 0')).toBeInTheDocument();
  });
});
