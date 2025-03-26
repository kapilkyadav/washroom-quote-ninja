import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FixturePricing, FixtureType } from '@/types';
import { supabase } from '@/lib/supabase';

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
      const { data: electricalData, error: electricalError } = await supabase.rpc('fixtures')
        .select('*')
        .eq('type', 'electrical');

      if (electricalError) throw electricalError;

      const { data: bathroomData, error: bathroomError } = await supabase.rpc('fixtures')
        .select('*')
        .eq('type', 'bathroom');

      if (bathroomError) throw bathroomError;

      const electricalMap: FixturePricing = {};
      electricalData.forEach(item => {
        electricalMap[item.fixture_id] = {
          name: item.name,
          price: item.price,
          description: item.description
        };
      });

      const bathroomMap: FixturePricing = {};
      bathroomData.forEach(item => {
        bathroomMap[item.fixture_id] = {
          name: item.name,
          price: item.price,
          description: item.description
        };
      });

      setElectricalFixtures(electricalMap);
      setBathroomFixtures(bathroomMap);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      toast({
        title: "Error",
        description: "Failed to load fixture data.",
        variant: "destructive",
      });
      
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
      
      const { error } = await supabase.rpc('fixtures')
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

      const { error } = await supabase.rpc('fixtures')
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
        
        const { error } = await supabase.rpc('fixtures')
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
          
          <TabsContent value="electrical">
            {isAddingNew && (
              <div className="p-4 border rounded-md mb-4 bg-muted/30">
                <h4 className="text-sm font-semibold mb-3">Add New Electrical Fixture</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="id">Fixture ID</Label>
                    <Input 
                      id="id"
                      name="id"
                      value={newFixture.id}
                      onChange={handleNewFixtureChange}
                      placeholder="ledLight"
                    />
                    <p className="text-xs text-muted-foreground">Unique identifier, used in code</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Fixture Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={newFixture.name}
                      onChange={handleNewFixtureChange}
                      placeholder="LED Light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      value={newFixture.price}
                      onChange={handleNewFixtureChange}
                      placeholder="1000"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={newFixture.description}
                      onChange={handleNewFixtureChange}
                      placeholder="Describe the fixture..."
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                    <Button onClick={handleAddFixture}>Add Fixture</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElectricalFixtures.length > 0 ? (
                    filteredElectricalFixtures.map(([id, fixture]) => (
                      <TableRow key={id}>
                        <TableCell>
                          {isEditing === id ? (
                            <Input 
                              name="name"
                              value={editValues.name}
                              onChange={handleEditChange}
                            />
                          ) : (
                            fixture.name
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{id}</TableCell>
                        <TableCell className="text-right">
                          {isEditing === id ? (
                            <Input 
                              name="price"
                              type="number"
                              value={editValues.price}
                              onChange={handleEditChange}
                              className="w-24 ml-auto"
                            />
                          ) : (
                            `₹${fixture.price.toLocaleString()}`
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {isEditing === id ? (
                            <Textarea 
                              name="description"
                              value={editValues.description}
                              onChange={handleEditChange}
                              rows={2}
                            />
                          ) : (
                            fixture.description
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === id ? (
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSaveEdit(id)}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                                <span className="sr-only">Save</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleCancelEdit}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditStart(id, fixture)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteFixture(id, fixture.name)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No electrical fixtures found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="bathroom">
            {isAddingNew && (
              <div className="p-4 border rounded-md mb-4 bg-muted/30">
                <h4 className="text-sm font-semibold mb-3">Add New Bathroom Fixture</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="id">Fixture ID</Label>
                    <Input 
                      id="id"
                      name="id"
                      value={newFixture.id}
                      onChange={handleNewFixtureChange}
                      placeholder="showerHead"
                    />
                    <p className="text-xs text-muted-foreground">Unique identifier, used in code</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Fixture Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={newFixture.name}
                      onChange={handleNewFixtureChange}
                      placeholder="Shower Head"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      value={newFixture.price}
                      onChange={handleNewFixtureChange}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={newFixture.description}
                      onChange={handleNewFixtureChange}
                      placeholder="Describe the fixture..."
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                    <Button onClick={handleAddFixture}>Add Fixture</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBathroomFixtures.length > 0 ? (
                    filteredBathroomFixtures.map(([id, fixture]) => (
                      <TableRow key={id}>
                        <TableCell>
                          {isEditing === id ? (
                            <Input 
                              name="name"
                              value={editValues.name}
                              onChange={handleEditChange}
                            />
                          ) : (
                            fixture.name
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{id}</TableCell>
                        <TableCell className="text-right">
                          {isEditing === id ? (
                            <Input 
                              name="price"
                              type="number"
                              value={editValues.price}
                              onChange={handleEditChange}
                              className="w-24 ml-auto"
                            />
                          ) : (
                            `₹${fixture.price.toLocaleString()}`
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {isEditing === id ? (
                            <Textarea 
                              name="description"
                              value={editValues.description}
                              onChange={handleEditChange}
                              rows={2}
                            />
                          ) : (
                            fixture.description
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === id ? (
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSaveEdit(id)}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                                <span className="sr-only">Save</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleCancelEdit}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditStart(id, fixture)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteFixture(id, fixture.name)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No bathroom fixtures found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FixturePricingTab;
