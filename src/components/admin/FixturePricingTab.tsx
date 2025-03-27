
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFixtures } from '@/hooks/use-fixtures';
import { useFixtureEditing } from '@/hooks/use-fixture-editing';
import FixtureTypeTab from './fixtures/FixtureTypeTab';

interface FixturePricingTabProps {
  searchQuery: string;
}

const FixturePricingTab = ({ searchQuery }: FixturePricingTabProps) => {
  const { 
    fixtures, 
    fixturesByType,
    isLoading,
    deleteFixture
  } = useFixtures({ search: searchQuery });

  const {
    createFixture,
    updateFixture,
    isSubmitting
  } = useFixtureEditing();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', price: 0, description: '' });
  const [activeTab, setActiveTab] = useState('electrical');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFixture, setNewFixture] = useState({
    id: '',
    name: '',
    price: 0,
    description: ''
  });

  // Handle starting edit mode
  const handleEditStart = (id: string, fixture: { name: string; price: number; description?: string }) => {
    setIsEditing(id);
    setEditValues({
      name: fixture.name,
      price: fixture.price,
      description: fixture.description || ''
    });
  };

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle saving edited fixture
  const handleSaveEdit = async (id: string) => {
    if (!isEditing) return;
    
    const fixtureType = activeTab;
    
    const fixture = fixtures?.find(f => f.fixture_id === id);
    if (!fixture) return;
    
    await updateFixture.mutateAsync({
      id: fixture.id,
      formData: {
        name: editValues.name,
        fixture_id: id,
        type: fixtureType,
        description: editValues.description,
        price: editValues.price
      }
    });
    
    setIsEditing(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  // Handle new fixture changes
  const handleNewFixtureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFixture(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle adding new fixture
  const handleAddFixture = async () => {
    if (!newFixture.id || !newFixture.name) return;
    
    const fixtureType = activeTab;
    
    await createFixture.mutateAsync({
      name: newFixture.name,
      fixture_id: newFixture.id,
      type: fixtureType,
      description: newFixture.description,
      price: newFixture.price
    });
    
    setNewFixture({ id: '', name: '', price: 0, description: '' });
    setIsAddingNew(false);
  };

  // Handle deleting fixture
  const handleDeleteFixture = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    const fixture = fixtures?.find(f => f.fixture_id === id);
    if (!fixture) return;
    
    await deleteFixture.mutateAsync(fixture.id);
  };

  // Get fixtures by type and filter by search query
  const getFilteredFixtures = (type: string) => {
    const fixturesOfType = fixturesByType[type] || [];
    
    const filteredFixtures = fixturesOfType
      .filter(fixture => 
        fixture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fixture.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
      
    // Convert to the expected format for FixtureTypeTab
    return filteredFixtures.map(fixture => [
      fixture.fixture_id,
      {
        name: fixture.name,
        price: fixture.price,
        description: fixture.description || undefined
      }
    ]) as [string, { name: string; price: number; description?: string }][];
  };

  const filteredElectricalFixtures = getFilteredFixtures('electrical');
  const filteredBathroomFixtures = getFilteredFixtures('bathroom');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Fixture Pricing Management</h3>
          <p className="text-sm text-muted-foreground">Configure pricing for electrical and bathroom fixtures</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddingNew(true)}
          >
            <Plus size={16} />
            Add Fixture
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Tabs defaultValue="electrical" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="electrical">Electrical Fixtures</TabsTrigger>
            <TabsTrigger value="bathroom">Bathroom Fixtures</TabsTrigger>
          </TabsList>
          
          <FixtureTypeTab 
            tabValue="electrical"
            isAddingNew={isAddingNew && activeTab === 'electrical'}
            fixtures={filteredElectricalFixtures}
            isEditing={isEditing}
            editValues={editValues}
            newFixture={newFixture}
            handleNewFixtureChange={handleNewFixtureChange}
            handleAddFixture={handleAddFixture}
            setIsAddingNew={setIsAddingNew}
            handleEditStart={handleEditStart}
            handleEditChange={handleEditChange}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleDeleteFixture={handleDeleteFixture}
          />
          
          <FixtureTypeTab 
            tabValue="bathroom"
            isAddingNew={isAddingNew && activeTab === 'bathroom'}
            fixtures={filteredBathroomFixtures}
            isEditing={isEditing}
            editValues={editValues}
            newFixture={newFixture}
            handleNewFixtureChange={handleNewFixtureChange}
            handleAddFixture={handleAddFixture}
            setIsAddingNew={setIsAddingNew}
            handleEditStart={handleEditStart}
            handleEditChange={handleEditChange}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleDeleteFixture={handleDeleteFixture}
          />
        </Tabs>
      )}
    </div>
  );
};

export default FixturePricingTab;
