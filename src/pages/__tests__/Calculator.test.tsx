
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Calculator from '../Calculator';

// Mock the header and footer components
jest.mock('@/components/layout/Header', () => () => <div>Header</div>);
jest.mock('@/components/layout/Footer', () => () => <div>Footer</div>);

// Mock the calculator step components
jest.mock('@/components/calculator/ProjectTypeStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="project-type-step">
      <button 
        onClick={() => updateFormData('projectType', 'new')}
        data-testid="select-new"
      >
        New Construction
      </button>
    </div>
  )
}));

jest.mock('@/components/calculator/DimensionsStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="dimensions-step">
      <button 
        onClick={() => updateFormData('dimensions', { length: 10, width: 8, height: 9 })}
        data-testid="update-dimensions"
      >
        Set Dimensions
      </button>
    </div>
  )
}));

jest.mock('@/components/calculator/ElectricalStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="electrical-step">
      <button 
        onClick={() => updateFormData('electricalFixtures', { ledMirror: true, exhaustFan: false, waterHeater: false })}
        data-testid="select-fixture"
      >
        Select LED Mirror
      </button>
    </div>
  )
}));

jest.mock('@/components/calculator/PlumbingStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="plumbing-step">
      <button 
        onClick={() => updateFormData('plumbingRequirements', 'complete')}
        data-testid="select-plumbing"
      >
        Complete Plumbing
      </button>
    </div>
  )
}));

// Mock the other steps similarly
jest.mock('@/components/calculator/AdditionalFixturesStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="fixtures-step">
      <button 
        onClick={() => updateFormData('additionalFixtures', { showerPartition: true, vanity: false, bathtub: false, jacuzzi: false })}
        data-testid="select-additional-fixture"
      >
        Select Shower Partition
      </button>
    </div>
  )
}));

jest.mock('@/components/calculator/TimelineStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="timeline-step">
      <button 
        onClick={() => updateFormData('projectTimeline', 'standard')}
        data-testid="select-timeline"
      >
        Standard Timeline
      </button>
    </div>
  )
}));

jest.mock('@/components/calculator/BrandSelectionStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="brand-step">
      <button 
        onClick={() => updateFormData('brandSelection', 'brand1')}
        data-testid="select-brand"
      >
        Select Brand
      </button>
    </div>
  )
}));

jest.mock('@/components/calculator/CustomerDetailsStep', () => ({
  __esModule: true,
  default: ({ formData, updateFormData }) => (
    <div data-testid="customer-step">
      <button 
        onClick={() => updateFormData('customerDetails', { 
          name: 'John Doe', 
          email: 'john@example.com', 
          phone: '1234567890', 
          location: 'New York' 
        })}
        data-testid="set-customer-details"
      >
        Set Customer Details
      </button>
    </div>
  )
}));

jest.mock('@/components/calculator/EstimateResultStep', () => ({
  __esModule: true,
  default: ({ formData, onReset }) => (
    <div data-testid="result-step">
      <div data-testid="estimate-amount">₹12345.00</div>
      <button onClick={onReset} data-testid="reset-button">Start New</button>
    </div>
  )
}));

jest.mock('@/components/calculator/ProgressBar', () => ({
  __esModule: true,
  default: ({ currentStep, totalSteps }) => (
    <div data-testid="progress-bar">
      Step {currentStep} of {totalSteps}
    </div>
  )
}));

describe('Calculator Page', () => {
  test('allows user to navigate through all steps and get an estimate', async () => {
    render(
      <BrowserRouter>
        <Calculator />
      </BrowserRouter>
    );

    // Step 1: Project Type
    expect(screen.getByTestId('project-type-step')).toBeInTheDocument();
    
    // Select project type and move to next step
    fireEvent.click(screen.getByTestId('select-new'));
    fireEvent.click(screen.getByText('Next'));
    
    // Step 2: Dimensions
    expect(screen.getByTestId('dimensions-step')).toBeInTheDocument();
    
    // Set dimensions and move to next step
    fireEvent.click(screen.getByTestId('update-dimensions'));
    fireEvent.click(screen.getByText('Next'));
    
    // Step 3: Electrical Fixtures
    expect(screen.getByTestId('electrical-step')).toBeInTheDocument();
    
    // Select fixture and move to next step
    fireEvent.click(screen.getByTestId('select-fixture'));
    fireEvent.click(screen.getByText('Next'));
    
    // Step 4: Plumbing Requirements
    expect(screen.getByTestId('plumbing-step')).toBeInTheDocument();
    
    // Select plumbing and move to next step
    fireEvent.click(screen.getByTestId('select-plumbing'));
    fireEvent.click(screen.getByText('Next'));
    
    // Continue through all steps
    fireEvent.click(screen.getByTestId('select-additional-fixture'));
    fireEvent.click(screen.getByText('Next'));
    
    fireEvent.click(screen.getByTestId('select-timeline'));
    fireEvent.click(screen.getByText('Next'));
    
    fireEvent.click(screen.getByTestId('select-brand'));
    fireEvent.click(screen.getByText('Next'));
    
    fireEvent.click(screen.getByTestId('set-customer-details'));
    
    // Final step - get estimate
    fireEvent.click(screen.getByText('Next'));
    
    // Result step should be visible
    expect(screen.getByTestId('result-step')).toBeInTheDocument();
    expect(screen.getByTestId('estimate-amount')).toBeInTheDocument();
    
    // Test reset functionality
    fireEvent.click(screen.getByTestId('reset-button'));
    
    // Should be back at step 1
    expect(screen.getByTestId('project-type-step')).toBeInTheDocument();
  });
});
