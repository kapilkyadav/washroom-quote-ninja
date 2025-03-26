
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { FixturePricing } from '@/types';
import AddFixtureForm from './AddFixtureForm';
import FixturesTable from './FixturesTable';

interface FixtureTypeTabProps {
  tabValue: string;
  isAddingNew: boolean;
  fixtures: [string, { name: string; price: number; description?: string }][];
  isEditing: string | null;
  editValues: { name: string; price: number; description: string };
  newFixture: { id: string; name: string; price: number; description: string };
  handleNewFixtureChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddFixture: () => void;
  setIsAddingNew: (value: boolean) => void;
  handleEditStart: (id: string, fixture: { name: string; price: number; description?: string }) => void;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveEdit: (id: string) => void;
  handleCancelEdit: () => void;
  handleDeleteFixture: (id: string, name: string) => void;
}

const FixtureTypeTab = ({
  tabValue,
  isAddingNew,
  fixtures,
  isEditing,
  editValues,
  newFixture,
  handleNewFixtureChange,
  handleAddFixture,
  setIsAddingNew,
  handleEditStart,
  handleEditChange,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteFixture
}: FixtureTypeTabProps) => {
  return (
    <TabsContent value={tabValue}>
      {isAddingNew && (
        <AddFixtureForm 
          fixtureType={tabValue}
          newFixture={newFixture}
          handleNewFixtureChange={handleNewFixtureChange}
          handleAddFixture={handleAddFixture}
          onCancel={() => setIsAddingNew(false)}
        />
      )}
      
      <FixturesTable 
        fixtures={fixtures}
        isEditing={isEditing}
        editValues={editValues}
        handleEditStart={handleEditStart}
        handleEditChange={handleEditChange}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        handleDeleteFixture={handleDeleteFixture}
      />
    </TabsContent>
  );
};

export default FixtureTypeTab;
