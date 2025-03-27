
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProductData } from '@/types';

export const useProducts = (searchQuery = '', brandId?: number) => {
  const queryClient = useQueryClient();
  
  // Fetch products
  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', searchQuery, brandId],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      if (brandId) {
        query = query.eq('brand_id', brandId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ProductData[];
    }
  });

  // Create product
  const createProduct = useMutation({
    mutationFn: async (product: Omit<ProductData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select();
      
      if (error) throw error;
      return data?.[0] as ProductData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product Created",
        description: "The product has been successfully created.",
      });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update product
  const updateProduct = useMutation({
    mutationFn: async (product: Partial<ProductData> & { id: number }) => {
      const { id, ...updates } = product;
      
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data?.[0] as ProductData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product Updated",
        description: "The product has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete product
  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Bulk import products
  const importProducts = useMutation({
    mutationFn: async (products: Omit<ProductData, 'id' | 'created_at' | 'updated_at'>[]) => {
      const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();
      
      if (error) throw error;
      return data as ProductData[];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Products Imported",
        description: `${data.length} products have been successfully imported.`,
      });
    },
    onError: (error) => {
      console.error('Error importing products:', error);
      toast({
        title: "Error",
        description: "Failed to import products. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    products,
    isLoading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    importProducts
  };
};
