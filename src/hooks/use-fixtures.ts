
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { FixturePricing } from '@/types';
import { supabase } from '@/lib/supabase';

export const useFixtures = () => {
  const [electricalFixtures, setElectricalFixtures] = useState<FixturePricing>({});
  const [bathroomFixtures, setBathroomFixtures] = useState<FixturePricing>({});
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchFixtures();
  }, []);

  return {
    electricalFixtures,
    bathroomFixtures,
    setElectricalFixtures,
    setBathroomFixtures,
    isLoading
  };
};
