
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ProductData } from '@/types';
import { useBrands } from '@/hooks/use-brands';
import { useProducts } from '@/hooks/use-products';

export interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductData | null;
  onClose?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters."
  }),
  sku: z.string().optional(),
  brand_id: z.number({
    required_error: "Please select a brand."
  }),
  description: z.string().optional(),
  client_price: z.number({
    required_error: "Client price is required.",
    invalid_type_error: "Client price must be a number."
  }).min(0, {
    message: "Price cannot be negative."
  }),
  quotation_price: z.number({
    required_error: "Quotation price is required.",
    invalid_type_error: "Quotation price must be a number."
  }).min(0, {
    message: "Price cannot be negative."
  }),
  margin: z.number().min(0, {
    message: "Margin cannot be negative."
  }),
  active: z.boolean().default(true)
});

export function ProductDialog({ 
  open, 
  onOpenChange, 
  product, 
  onClose
}: ProductDialogProps) {
  const { brands, isLoading: isLoadingBrands } = useBrands();
  const { createProduct, updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      brand_id: undefined,
      description: '',
      client_price: 0,
      quotation_price: 0,
      margin: 0,
      active: true
    }
  });
  
  // Update form values when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        sku: product.sku || '',
        brand_id: product.brand_id,
        description: product.description || '',
        client_price: product.client_price,
        quotation_price: product.quotation_price,
        margin: product.margin,
        active: product.active
      });
    } else {
      form.reset({
        name: '',
        sku: '',
        brand_id: undefined,
        description: '',
        client_price: 0,
        quotation_price: 0,
        margin: 0,
        active: true
      });
    }
  }, [product, form]);
  
  // Handle price and margin calculations
  const handlePriceChange = (field: 'client_price' | 'quotation_price', value: number) => {
    form.setValue(field, value);
    
    // Calculate margin based on client and quotation prices
    if (field === 'client_price') {
      const quotationPrice = form.getValues('quotation_price');
      if (value > 0 && quotationPrice > 0) {
        const margin = ((quotationPrice - value) / value) * 100;
        form.setValue('margin', Math.round(margin * 100) / 100);
      }
    } else if (field === 'quotation_price') {
      const clientPrice = form.getValues('client_price');
      if (clientPrice > 0 && value > 0) {
        const margin = ((value - clientPrice) / clientPrice) * 100;
        form.setValue('margin', Math.round(margin * 100) / 100);
      }
    }
  };
  
  // Handle margin change
  const handleMarginChange = (value: number) => {
    form.setValue('margin', value);
    
    // Calculate quotation price based on client price and margin
    const clientPrice = form.getValues('client_price');
    if (clientPrice > 0) {
      const quotationPrice = clientPrice * (1 + value / 100);
      form.setValue('quotation_price', Math.round(quotationPrice * 100) / 100);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (product) {
        // Update existing product
        await updateProduct.mutateAsync({
          id: product.id,
          ...values
        });
      } else {
        // Create new product
        await createProduct.mutateAsync(values);
      }
      onOpenChange(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product 
              ? 'Update the details of the existing product.' 
              : 'Enter the details for a new product.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand *</FormLabel>
                  <Select
                    disabled={isLoadingBrands}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description (optional)" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="client_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Price *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        onChange={(e) => handlePriceChange('client_price', parseFloat(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>Base cost to client</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quotation_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Price *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        onChange={(e) => handlePriceChange('quotation_price', parseFloat(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>Final price with margin</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="margin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        onChange={(e) => handleMarginChange(parseFloat(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Set whether this product is active and available for use
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (product ? 'Updating...' : 'Creating...') 
                  : (product ? 'Update Product' : 'Create Product')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
