
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { FixturePricing } from '@/types';
import { supabase } from '@/lib/supabase';

interface UseFixtureEditingProps {
  setElectricalFixtures: React.Dispatch<React.SetStateAction<FixturePricing>>;
  setBathroomFixtures: React.Dispatch<React.SetStateAction<FixturePricing>>;
}

export const useFixtureEditing = ({ 
  setElectricalFixtures, 
  setBathroomFixtures 
}: UseFixtureEditingProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', price: 0, description: '' });
  const [activeTab, setActiveTab] = useState('electrical');

  const handleEditStart = (id: string, fixture: { name: string, price: number, description?: string }) => {
    setIsEditing(id);
    setEditValues({
      name: fixture.name,
      price: fixture.price,
      description: fixture.description || '',
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setEditValues(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const fixtureType = activeTab === 'electrical' ? 'electrical' : 'bathroom';
      
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

  const handleDeleteFixture = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const fixtureType = activeTab === 'electrical' ? 'electrical' : 'bathroom';
        
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

  return {
    isEditing,
    editValues,
    activeTab,
    setActiveTab,
    handleEditStart,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteFixture
  };
};
