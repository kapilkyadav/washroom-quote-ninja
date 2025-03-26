
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddFixtureFormProps {
  fixtureType: string;
  newFixture: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  handleNewFixtureChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddFixture: () => void;
  onCancel: () => void;
}

const AddFixtureForm = ({
  fixtureType,
  newFixture,
  handleNewFixtureChange,
  handleAddFixture,
  onCancel
}: AddFixtureFormProps) => {
  const typeLabel = fixtureType === 'electrical' ? 'Electrical' : 'Bathroom';
  const placeholder = fixtureType === 'electrical' ? 'ledLight' : 'showerHead';
  const nameExample = fixtureType === 'electrical' ? 'LED Light' : 'Shower Head';
  const priceExample = fixtureType === 'electrical' ? '1000' : '5000';

  return (
    <div className="p-4 border rounded-md mb-4 bg-muted/30">
      <h4 className="text-sm font-semibold mb-3">Add New {typeLabel} Fixture</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="id">Fixture ID</Label>
          <Input 
            id="id"
            name="id"
            value={newFixture.id}
            onChange={handleNewFixtureChange}
            placeholder={placeholder}
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
            placeholder={nameExample}
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
            placeholder={priceExample}
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
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleAddFixture}>Add Fixture</Button>
        </div>
      </div>
    </div>
  );
};

export default AddFixtureForm;
