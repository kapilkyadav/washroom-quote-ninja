
import { useState } from 'react';
import { Store, X } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
import { Brand } from '@/types';

const brandFormSchema = z.object({
  name: z.string().min(2, { message: 'Brand name must be at least 2 characters' }),
  clientPrice: z.coerce.number().min(0, { message: 'Client price must be a positive number' }),
  quotationPrice: z.coerce.number().min(0, { message: 'Quotation price must be a positive number' }),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

interface BrandFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (brand: Brand) => void;
  editingBrand?: Brand | null;
}

const BrandForm = ({ open, onOpenChange, onSuccess, editingBrand }: BrandFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: editingBrand?.name || '',
      clientPrice: editingBrand?.clientPrice || 0,
      quotationPrice: editingBrand?.quotationPrice || 0,
    },
  });

  // Reset form when editingBrand changes
  useState(() => {
    if (editingBrand) {
      form.reset({
        name: editingBrand.name,
        clientPrice: editingBrand.clientPrice,
        quotationPrice: editingBrand.quotationPrice,
      });
    } else {
      form.reset({
        name: '',
        clientPrice: 0,
        quotationPrice: 0,
      });
    }
  });

  const onSubmit = async (data: BrandFormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate margin
      const margin = ((data.quotationPrice - data.clientPrice) / data.clientPrice) * 100;
      
      const brandData: Brand = {
        id: editingBrand?.id || `B${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Generate random ID if new
        name: data.name,
        clientPrice: data.clientPrice,
        quotationPrice: data.quotationPrice,
        margin: parseFloat(margin.toFixed(2)),
      };
      
      // In a real application, this is where you would make an API call to save the brand
      
      toast({
        title: editingBrand ? "Brand Updated" : "Brand Created",
        description: editingBrand 
          ? `${data.name} has been updated successfully` 
          : `${data.name} has been added successfully`,
      });
      
      form.reset();
      onSuccess(brandData);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving brand:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
          <DialogDescription>
            {editingBrand 
              ? 'Update the brand details below.' 
              : 'Fill in the details to add a new brand.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Premium Collection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quotationPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quotation Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="7500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-muted-foreground">
              Margin will be calculated automatically based on the prices.
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                <Store className="mr-2 h-4 w-4" />
                {isSubmitting 
                  ? (editingBrand ? "Updating..." : "Creating...") 
                  : (editingBrand ? "Update Brand" : "Create Brand")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BrandForm;
