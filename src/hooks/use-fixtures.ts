
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { FixturePricing } from '@/types';
import { supabase } from '@/lib/supabase';

export const useFixtures = () => {
  const [electricalFixtures, setElectricalFixtures] = useState<FixturePricing>({});
  const [bathroomFixtures, setBathroomFixtures] = useState<FixturePricing>({});
  const [isLoading, setIsLoading] = useState(true);
  const [originalElectricalFixtures, setOriginalElectricalFixtures] = useState<FixturePricing>({});
  const [originalBathroomFixtures, setOriginalBathroomFixtures] = useState<FixturePricing>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
      // Store original fixtures for change tracking
      setOriginalElectricalFixtures({...electricalMap});
      setOriginalBathroomFixtures({...bathroomMap});
      setHasUnsavedChanges(false);
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

  // Track changes by comparing current fixtures with original fixtures
  useEffect(() => {
    // Skip the initial render
    if (isLoading) return;
    
    const hasElectricalChanges = JSON.stringify(electricalFixtures) !== JSON.stringify(originalElectricalFixtures);
    const hasBathroomChanges = JSON.stringify(bathroomFixtures) !== JSON.stringify(originalBathroomFixtures);
    
    setHasUnsavedChanges(hasElectricalChanges || hasBathroomChanges);
  }, [electricalFixtures, bathroomFixtures, originalElectricalFixtures, originalBathroomFixtures, isLoading]);

  // Save all changes to database
  const saveAllChanges = async () => {
    try {
      const allPromises = [];
      
      // Find and save all changed electrical fixtures
      for (const [id, fixture] of Object.entries(electricalFixtures)) {
        const originalFixture = originalElectricalFixtures[id];
        
        if (!originalFixture || 
            fixture.name !== originalFixture.name || 
            fixture.price !== originalFixture.price ||
            fixture.description !== originalFixture.description) {
          
          const promise = supabase
            .from('fixtures')
            .update({
              name: fixture.name,
              price: fixture.price,
              description: fixture.description || null
            })
            .eq('fixture_id', id)
            .eq('type', 'electrical');
            
          allPromises.push(promise);
        }
      }
      
      // Find and save all changed bathroom fixtures
      for (const [id, fixture] of Object.entries(bathroomFixtures)) {
        const originalFixture = originalBathroomFixtures[id];
        
        if (!originalFixture || 
            fixture.name !== originalFixture.name || 
            fixture.price !== originalFixture.price ||
            fixture.description !== originalFixture.description) {
          
          const promise = supabase
            .from('fixtures')
            .update({
              name: fixture.name,
              price: fixture.price,
              description: fixture.description || null
            })
            .eq('fixture_id', id)
            .eq('type', 'bathroom');
            
          allPromises.push(promise);
        }
      }
      
      if (allPromises.length === 0) {
        toast({
          title: "No Changes",
          description: "No changes to save.",
        });
        return;
      }
      
      await Promise.all(allPromises);
      
      // Update original fixtures to match current state
      setOriginalElectricalFixtures({...electricalFixtures});
      setOriginalBathroomFixtures({...bathroomFixtures});
      setHasUnsavedChanges(false);
      
      toast({
        title: "Success",
        description: `Saved ${allPromises.length} fixture changes.`,
      });
    } catch (error) {
      console.error('Error saving fixtures:', error);
      toast({
        title: "Error",
        description: "Failed to save fixture changes.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  return {
    electricalFixtures,
    bathroomFixtures,
    setElectricalFixtures,
    setBathroomFixtures,
    isLoading,
    hasUnsavedChanges,
    saveAllChanges,
    fetchFixtures
  };
};
