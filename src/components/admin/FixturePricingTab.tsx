
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FixturePricing } from '@/types';
import { supabase } from '@/lib/supabase';
import FixtureTypeTab from './fixtures/FixtureTypeTab';

interface FixturePricingTabProps {
  searchQuery: string;
}

const FixturePricingTab = ({ searchQuery }: FixturePricingTabProps) => {
  const [activeTab, setActiveTab] = useState('electrical');
  const [electricalFixtures, setElectricalFixtures] = useState<FixturePricing>({});
  const [bathroomFixtures, setBathroomFixtures] = useState<FixturePricing>({});
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', price: 0, description: '' });
  const [newFixture, setNewFixture] = useState({ id: '', name: '', price: 0, description: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    setIsLoading(true);
    try {
      const { data: electricalData, error: electricalError } = await supabase
        .from('fixtures')
        .select('*')
        .eq('type', 'electrical');

      if (electricalError) throw electricalError;

      const { data: bathroomData, error: bathroomError } = await supabase
        .from('fixtures')
        .select('*')
        .eq('type', 'bathroom');

      if (bathroomError) throw bathroomError;

      const electricalMap: FixturePricing = {};
      if (electricalData) {
        electricalData.forEach(item => {
          electricalMap[item.fixture_id] = {
            name: item.name,
            price: item.price,
            description: item.description || undefined
          };
        });
      }

      const bathroomMap: FixturePricing = {};
      if (bathroomData) {
        bathroomData.forEach(item => {
          bathroomMap[item.fixture_id] = {
            name: item.name,
            price: item.price,
            description: item.description || undefined
          };
        });
      }

      setElectricalFixtures(electricalMap);
      setBathroomFixtures(bathroomMap);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      toast({
        title: "Error",
        description: "Failed to load fixture data.",
        variant: "destructive",
      });
      
      // Fallback data
      setElectricalFixtures({
        ledMirror: { name: 'LED Mirror', price: 3500, description: 'Modern LED mirror with touch controls' },
        exhaustFan: { name: 'Exhaust Fan', price: 1800, description: 'High-quality silent exhaust fan' },
        waterHeater: { name: 'Water Heater', price: 8000, description: 'Energy-efficient water heater' },
      });
      
      setBathroomFixtures({
        showerPartition: { name: 'Shower Partition', price: 15000, description: 'Glass shower partition with frame' },
        vanity: { name: 'Vanity', price: 25000, description: 'Modern bathroom vanity with storage' },
        bathtub: { name: 'Bathtub', price: 35000, description: 'Luxurious freestanding bathtub' },
        jacuzzi: { name: 'Jacuzzi', price: 55000, description: 'Premium jacuzzi with massage jets' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredElectricalFixtures = Object.entries(electricalFixtures).filter(([id, fixture]) => 
    fixture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fixture.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBathroomFixtures = Object.entries(bathroomFixtures).filter(([id, fixture]) => 
    fixture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fixture.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStart = (id: string, fixture: { name: string, price: number, description?: string }) => {
    setIsEditing(id);
    setEditValues({
      name: fixture.name,
      price: fixture.price,
      description: fixture.description || '',
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const fixtureType = activeTab === 'electrical' ? 'electrical' : 'bathroom';
      
      // Fixed query chain: build the complete query before awaiting
      const { error } = await supabase
        .from('fixtures')
        .update({
          name: editValues.name,
          price: editValues.price,
          description: editValues.description
        })
        .eq('fixture_id', id)
        .eq('type', fixtureType);
      
      if (error) throw error;

      if (activeTab === 'electrical') {
        setElectricalFixtures(prev => ({
          ...prev,
          [id]: {
            name: editValues.name,
            price: editValues.price,
            description: editValues.description,
          },
        }));
      } else {
        setBathroomFixtures(prev => ({
          ...prev,
          [id]: {
            name: editValues.name,
            price: editValues.price,
            description: editValues.description,
          },
        }));
      }

      setIsEditing(null);
      toast({
        title: "Fixture Updated",
        description: `${editValues.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating fixture:', error);
      toast({
        title: "Error",
        description: "Failed to update fixture.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setEditValues(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleNewFixtureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewFixture(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddFixture = async () => {
    if (!newFixture.id || !newFixture.name) {
      toast({
        title: "Error",
        description: "ID and Name are required fields.",
        variant: "destructive",
      });
      return;
    }

    const fixtureType = activeTab === 'electrical' ? 'electrical' : 'bathroom';
    
    try {
      if (
        (activeTab === 'electrical' && electricalFixtures[newFixture.id]) ||
        (activeTab === 'bathroom' && bathroomFixtures[newFixture.id])
      ) {
        toast({
          title: "Error",
          description: "A fixture with this ID already exists.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('fixtures')
        .insert({
          fixture_id: newFixture.id,
          name: newFixture.name,
          price: newFixture.price,
          description: newFixture.description,
          type: fixtureType
        });
      
      if (error) throw error;

      if (activeTab === 'electrical') {
        setElectricalFixtures(prev => ({
          ...prev,
          [newFixture.id]: {
            name: newFixture.name,
            price: newFixture.price,
            description: newFixture.description,
          },
        }));
      } else {
        setBathroomFixtures(prev => ({
          ...prev,
          [newFixture.id]: {
            name: newFixture.name,
            price: newFixture.price,
            description: newFixture.description,
          },
        }));
      }

      setNewFixture({ id: '', name: '', price: 0, description: '' });
      setIsAddingNew(false);
      
      toast({
        title: "Fixture Added",
        description: `${newFixture.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding fixture:', error);
      toast({
        title: "Error",
        description: "Failed to add new fixture.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFixture = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const fixtureType = activeTab === 'electrical' ? 'electrical' : 'bathroom';
        
        // Fixed query chain: build the complete query before awaiting
        const { error } = await supabase
          .from('fixtures')
          .delete()
          .eq('fixture_id', id)
          .eq('type', fixtureType);
        
        if (error) throw error;

        if (activeTab === 'electrical') {
          const { [id]: _, ...restFixtures } = electricalFixtures;
          setElectricalFixtures(restFixtures as FixturePricing);
        } else {
          const { [id]: _, ...restFixtures } = bathroomFixtures;
          setBathroomFixtures(restFixtures as FixturePricing);
        }
        
        toast({
          title: "Fixture Deleted",
          description: `${name} has been deleted successfully.`,
          variant: "destructive",
        });
      } catch (error) {
        console.error('Error deleting fixture:', error);
        toast({
          title: "Error",
          description: "Failed to delete fixture.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Fixture Pricing Management</h3>
          <p className="text-sm text-muted-foreground">Configure pricing for electrical and bathroom fixtures</p>
        </div>
        
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddingNew(true)}
        >
          <Plus size={16} />
          Add Fixture
        </Button>
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
