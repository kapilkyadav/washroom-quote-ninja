
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
  if (!fixtures) return {};
  
  return fixtures.reduce((acc, fixture) => {
    if (!acc[fixture.type]) {
      acc[fixture.type] = [];
    }
    acc[fixture.type].push(fixture);
    return acc;
  }, {} as Record<string, Fixture[]>);
};

// Function to convert fixtures to fixture pricing format
export const toFixturePricing = (fixtures: Fixture[] | null): FixturePricing => {
  if (!fixtures) return {};
  
  return fixtures.reduce((acc, fixture) => {
    acc[fixture.fixture_id] = {
      name: fixture.name,
      price: fixture.price,
      description: fixture.description || undefined
    };
    return acc;
  }, {} as FixturePricing);
};

export function useFixtures({ type, search }: UseFixturesProps = {}) {
  const queryClient = useQueryClient();
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch all fixtures
  const { data: fixtures, isLoading, error, refetch } = useQuery({
    queryKey: ['fixtures', type, search],
    queryFn: async () => {
      let query = supabase.from('fixtures').select('*');
      
      if (type) {
        query = query.eq('type', type);
      }
      
      if (search && search.trim() !== '') {
        query = query.ilike('name', `%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Fixture[];
    }
  });
  
  // Formatted fixtures by type
  const fixturesByType = formatFixturesByType(fixtures || null);
  
  // Get all fixture types
  const fixtureTypes = fixtures ? Array.from(new Set(fixtures.map(f => f.type))).sort() : [];
  
  // Convert to fixture pricing format
  const fixturePricing = toFixturePricing(fixtures || null);
  
  // Delete a fixture
  const deleteFixture = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('fixtures')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      toast({
        title: 'Fixture Deleted',
        description: 'The fixture has been deleted successfully.',
      });
    },
    onError: (error) => {
      console.error('Error deleting fixture:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the fixture. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Bulk update fixtures
  const bulkUpdateFixtures = useMutation({
    mutationFn: async (updates: { id: number; price: number }[]) => {
      // We need to send each update as a separate request 
      // since Supabase doesn't support bulk updates
      const results = await Promise.all(
        updates.map(async ({ id, price }) => {
          const { data, error } = await supabase
            .from('fixtures')
            .update({ price, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select('*')
            .single();
          
          if (error) throw error;
          return data;
        })
      );
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      toast({
        title: 'Prices Updated',
        description: 'Fixture prices have been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Error updating fixture prices:', error);
      toast({
        title: 'Error',
        description: 'Failed to update fixture prices. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Open edit dialog for a fixture
  const openEditDialog = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setIsEditDialogOpen(true);
  };
  
  // Close edit dialog
  const closeEditDialog = () => {
    setEditingFixture(null);
    setIsEditDialogOpen(false);
  };
  
  return {
    fixtures,
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
    openEditDialog,
    closeEditDialog,
  };
}
