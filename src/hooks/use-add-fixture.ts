
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { FixturePricing } from '@/types';
import { supabase } from '@/lib/supabase';

interface UseAddFixtureProps {
  electricalFixtures: FixturePricing;
  bathroomFixtures: FixturePricing;
  setElectricalFixtures: React.Dispatch<React.SetStateAction<FixturePricing>>;
  setBathroomFixtures: React.Dispatch<React.SetStateAction<FixturePricing>>;
  activeTab: string;
}

export const useAddFixture = ({ 
  electricalFixtures,
  bathroomFixtures,
  setElectricalFixtures, 
  setBathroomFixtures,
  activeTab
}: UseAddFixtureProps) => {
  const [newFixture, setNewFixture] = useState({ id: '', name: '', price: 0, description: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);

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

  return {
    newFixture,
    isAddingNew,
    setIsAddingNew,
    handleNewFixtureChange,
    handleAddFixture
  };
};
