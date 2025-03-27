
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BrandData } from '@/types';
import { useBrands } from '@/hooks/use-brands';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBrand: BrandData | null;
  onClose: () => void;
}

const BrandDialog = ({ open, onOpenChange, editingBrand, onClose }: BrandDialogProps) => {
  const { createBrand, updateBrand } = useBrands();
  
  // Define form
  const form = useForm<Omit<BrandData, 'id' | 'created_at' | 'updated_at'>>({
    defaultValues: {
      name: '',
      description: '',
    }
  });
  
  // Set form values when editing
  useEffect(() => {
    if (editingBrand) {
      form.reset({
        name: editingBrand.name,
        description: editingBrand.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [editingBrand, form]);
  
  // Handle form submission
  const onSubmit = async (data: Omit<BrandData, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingBrand) {
      await updateBrand.mutateAsync({
        id: editingBrand.id,
        ...data,
      });
    } else {
      await createBrand.mutateAsync(data);
    }
    
    onOpenChange(false);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
          <DialogDescription>
            {editingBrand 
              ? 'Update the brand details below.'
              : 'Fill in the details below to create a new brand.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Brand name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief description of the brand"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createBrand.isPending || updateBrand.isPending}
              >
                {createBrand.isPending || updateBrand.isPending 
                  ? 'Saving...'
                  : editingBrand ? 'Update Brand' : 'Create Brand'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BrandDialog;
