
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { FixturePricing } from '@/types';

// Define interface for fixture data
interface Fixture {
  id: number;
  name: string;
  fixture_id: string;
  type: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string | null;
}

interface UseFixturesProps {
  type?: string;
  search?: string;
}

// Format fixtures by type
const formatFixturesByType = (fixtures: Fixture[] | null): Record<string, Fixture[]> => {
  if (!fixtures || fixtures.length === 0) {
    return {};
  }

  // Group fixtures by type
  return fixtures.reduce((grouped, fixture) => {
    if (!grouped[fixture.type]) {
      grouped[fixture.type] = [];
    }
    grouped[fixture.type].push(fixture);
    return grouped;
  }, {} as Record<string, Fixture[]>);
};

// Function to convert fixtures to fixture pricing format
export const toFixturePricing = (fixtures: Fixture[] | null): FixturePricing => {
  if (!fixtures || fixtures.length === 0) {
    return {};
  }

  return fixtures.reduce((pricing, fixture) => {
    pricing[fixture.fixture_id] = {
      name: fixture.name,
      price: fixture.price,
      description: fixture.description || undefined
    };
    return pricing;
  }, {} as FixturePricing);
};

export function useFixtures({ type, search }: UseFixturesProps = {}) {
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch fixtures from Supabase
  const { data: fixtures, isLoading, error, refetch } = useQuery({
    queryKey: ['fixtures', type, search],
    queryFn: async () => {
      let query = supabase.from('fixtures').select('*');
      
      // Apply type filter if provided
      if (type) {
        query = query.eq('type', type);
      }
      
      // Apply search filter if provided
      if (search && search.trim() !== '') {
        query = query.ilike('name', `%${search}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        throw error;
      }
      
      return data as Fixture[];
    }
  });
  
  // Delete a fixture
  const deleteFixture = useMutation({
    mutationFn: async (fixtureId: number) => {
      const { error } = await supabase
        .from('fixtures')
        .delete()
        .eq('id', fixtureId);
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Fixture deleted",
        description: "The fixture has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting fixture",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Bulk update fixtures
  const bulkUpdateFixtures = useMutation({
    mutationFn: async (fixtures: Partial<Fixture>[]) => {
      const { data, error } = await supabase
        .from('fixtures')
        .upsert(fixtures)
        .select();
        
      if (error) {
        throw error;
      }
      
      return data as Fixture[];
    },
    onSuccess: () => {
      toast({
        title: "Fixtures updated",
        description: "All fixtures have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating fixtures",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Derived values
  const fixturesByType = formatFixturesByType(fixtures || null);
  const fixtureTypes = Object.keys(fixturesByType);
  const fixturePricing = toFixturePricing(fixtures || null);
  
  return {
    fixtures: fixtures || [],
    fixturesByType,
    fixtureTypes,
    fixturePricing,
    isLoading,
    error,
    deleteFixture,
    bulkUpdateFixtures,
    refetch,
    editingFixture,
    isEditDialogOpen,
    openEditDialog: (fixture: Fixture) => {
      setEditingFixture(fixture);
      setIsEditDialogOpen(true);
    },
    closeEditDialog: () => {
      setEditingFixture(null);
      setIsEditDialogOpen(false);
    },
  };
}
