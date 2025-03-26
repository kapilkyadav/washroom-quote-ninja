
import { render, screen, fireEvent } from '@testing-library/react';
import PlumbingStep from '../PlumbingStep';
import { CalculatorFormData } from '@/types';

describe('PlumbingStep', () => {
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
      <PlumbingStep 
        formData={mockFormData} 
        updateFormData={mockUpdateFormData} 
      />
    );

    expect(screen.getByText('Plumbing Requirements')).toBeInTheDocument();
    expect(screen.getByText('Complete Plumbing')).toBeInTheDocument();
    expect(screen.getByText('Fixture Installation Only')).toBeInTheDocument();
    expect(screen.getByText('Select a plumbing option to see what\'s included')).toBeInTheDocument();
  });

  test('updates form data when a plumbing option is selected', () => {
    render(
      <PlumbingStep 
        formData={mockFormData} 
        updateFormData={mockUpdateFormData} 
      />
    );

    // Select Complete Plumbing
    fireEvent.click(screen.getByLabelText('Complete Plumbing'));
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('plumbingRequirements', 'complete');

    // Select Fixture Installation Only
    fireEvent.click(screen.getByLabelText('Fixture Installation Only'));
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('plumbingRequirements', 'fixtureOnly');
  });

  test('displays what\'s included when an option is selected', async () => {
    const formDataWithSelection: CalculatorFormData = {
      ...mockFormData,
      plumbingRequirements: 'complete'
    };

    render(
      <PlumbingStep 
        formData={formDataWithSelection} 
        updateFormData={mockUpdateFormData} 
      />
    );

    expect(screen.getByText('New Pipe Installation')).toBeInTheDocument();
    expect(screen.getByText('Fixture Installation')).toBeInTheDocument();
    expect(screen.getByText('All Connections & Testing')).toBeInTheDocument();
  });
});
