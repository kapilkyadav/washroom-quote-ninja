
import { render, screen, fireEvent } from '@testing-library/react';
import ElectricalStep from '../ElectricalStep';

describe('ElectricalStep', () => {
  const mockFormData = {
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
      <ElectricalStep 
        formData={mockFormData} 
        updateFormData={mockUpdateFormData} 
      />
    );

    expect(screen.getByText('Select Electrical Fixtures')).toBeInTheDocument();
    expect(screen.getByText('LED Mirror')).toBeInTheDocument();
    expect(screen.getByText('Exhaust Fan')).toBeInTheDocument();
    expect(screen.getByText('Water Heater')).toBeInTheDocument();
    expect(screen.getByText('No electrical fixtures selected')).toBeInTheDocument();
  });

  test('updates form data when fixtures are selected', () => {
    render(
      <ElectricalStep 
        formData={mockFormData} 
        updateFormData={mockUpdateFormData} 
      />
    );

    // Select LED Mirror
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('electricalFixtures', {
      ledMirror: true,
      exhaustFan: false,
      waterHeater: false,
    });

    // Select Exhaust Fan
    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    
    expect(mockUpdateFormData).toHaveBeenCalledWith('electricalFixtures', {
      ledMirror: false,
      exhaustFan: true,
      waterHeater: false,
    });
  });
});
