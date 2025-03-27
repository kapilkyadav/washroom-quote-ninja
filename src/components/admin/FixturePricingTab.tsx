
import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFixtures } from '@/hooks/use-fixtures';
import { useFixtureEditing } from '@/hooks/use-fixture-editing';
import { useAddFixture } from '@/hooks/use-add-fixture';
import FixtureTypeTab from './fixtures/FixtureTypeTab';

interface FixturePricingTabProps {
  searchQuery: string;
}

const FixturePricingTab = ({ searchQuery }: FixturePricingTabProps) => {
  const { 
    electricalFixtures, 
    bathroomFixtures, 
    setElectricalFixtures, 
    setBathroomFixtures, 
    isLoading,
    hasUnsavedChanges,
    saveAllChanges
  } = useFixtures();

  const {
    isEditing,
    editValues,
    activeTab,
    setActiveTab,
    handleEditStart,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteFixture
  } = useFixtureEditing({ 
    electricalFixtures,
    bathroomFixtures,
    setElectricalFixtures, 
    setBathroomFixtures 
  });

  const {
    newFixture,
    isAddingNew,
    setIsAddingNew,
    handleNewFixtureChange,
    handleAddFixture
  } = useAddFixture({
    electricalFixtures,
    bathroomFixtures,
    setElectricalFixtures,
    setBathroomFixtures,
    activeTab
  });

  const filteredElectricalFixtures = Object.entries(electricalFixtures).filter(([id, fixture]) => 
    fixture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fixture.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBathroomFixtures = Object.entries(bathroomFixtures).filter(([id, fixture]) => 
    fixture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fixture.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Fixture Pricing Management</h3>
          <p className="text-sm text-muted-foreground">Configure pricing for electrical and bathroom fixtures</p>
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button 
              variant="default"
              className="flex items-center gap-2"
              onClick={saveAllChanges}
            >
              <Save size={16} />
              Save All Changes
            </Button>
          )}
          
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
