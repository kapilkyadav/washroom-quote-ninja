
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { BrandData } from '@/types';

export const useBrands = (searchQuery = '') => {
  const queryClient = useQueryClient();
  
  // Fetch brands
  const {
    data: brands,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['brands', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as BrandData[];
    }
  });

  // Create brand
  const createBrand = useMutation({
    mutationFn: async (brand: Omit<BrandData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('brands')
        .insert(brand)
        .select()
        .single();
      
      if (error) throw error;
      return data as BrandData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: "Brand Created",
        description: "The brand has been successfully created.",
      });
    },
    onError: (error) => {
      console.error('Error creating brand:', error);
      toast({
        title: "Error",
        description: "Failed to create brand. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update brand
  const updateBrand = useMutation({
    mutationFn: async (brand: Partial<BrandData> & { id: number }) => {
      const { id, ...updates } = brand;
      
      const { data, error } = await supabase
        .from('brands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as BrandData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: "Brand Updated",
        description: "The brand has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating brand:', error);
      toast({
        title: "Error",
        description: "Failed to update brand. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete brand
  const deleteBrand = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: "Brand Deleted",
        description: "The brand has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting brand:', error);
      toast({
        title: "Error",
        description: "Failed to delete brand. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    brands,
    isLoading,
    error,
    refetch,
    createBrand,
    updateBrand,
    deleteBrand
  };
};
