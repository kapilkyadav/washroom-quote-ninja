
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { FixturePricing } from '@/types';

// Interface for form data
interface FixtureFormData {
  name: string;
  fixture_id: string;
  type: string;
  description?: string;
  price: number;
}

export function useFixtureEditing() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Create new fixture
  const createFixture = useMutation({
    mutationFn: async (formData: FixtureFormData) => {
      setIsSubmitting(true);
      
      try {
        const { data, error } = await supabase
          .from('fixtures')
          .insert({
            name: formData.name,
            fixture_id: formData.fixture_id,
            type: formData.type,
            description: formData.description || null,
            price: formData.price
          })
          .select('*');

        if (error) throw error;
        return data?.[0];
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      toast({
        title: "Success",
        description: "Fixture has been created successfully."
      });
    },
    onError: (error) => {
      console.error('Error creating fixture:', error);
      toast({
        title: "Error",
        description: "Failed to create fixture. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update existing fixture
  const updateFixture = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FixtureFormData }) => {
      setIsSubmitting(true);
      
      try {
        const { data, error } = await supabase
          .from('fixtures')
          .update({
            name: formData.name,
            fixture_id: formData.fixture_id,
            type: formData.type,
            description: formData.description || null,
            price: formData.price,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select('*');

        if (error) throw error;
        return data?.[0];
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      toast({
        title: "Success",
        description: "Fixture has been updated successfully."
      });
    },
    onError: (error) => {
      console.error('Error updating fixture:', error);
      toast({
        title: "Error",
        description: "Failed to update fixture. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    createFixture,
    updateFixture,
    isSubmitting
  };
}
