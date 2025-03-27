
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ProductData } from '@/types';
import { useProducts } from '@/hooks/use-products';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: ProductData | null;
  onClose: () => void;
}

const ProductDialog = ({ open, onOpenChange, editingProduct, onClose }: ProductDialogProps) => {
  const { createProduct, updateProduct } = useProducts();
  const { brands, isLoading: brandsLoading } = useBrands();
  
  // Define form
  const form = useForm<Omit<ProductData, 'id' | 'created_at' | 'updated_at' | 'extra_data'>>({
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      brand_id: 0,
      client_price: 0,
      quotation_price: 0,
      margin: 0,
      active: true,
    }
  });
  
  // Set form values when editing
  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        sku: editingProduct.sku || '',
        description: editingProduct.description || '',
        brand_id: editingProduct.brand_id,
        client_price: editingProduct.client_price,
        quotation_price: editingProduct.quotation_price,
        margin: editingProduct.margin,
        active: editingProduct.active,
      });
    } else {
      form.reset({
        name: '',
        sku: '',
        description: '',
        brand_id: 0,
        client_price: 0,
        quotation_price: 0,
        margin: 0,
        active: true,
      });
    }
  }, [editingProduct, form]);
  
  // Handle form submission
  const onSubmit = async (data: Omit<ProductData, 'id' | 'created_at' | 'updated_at' | 'extra_data'>) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        ...data,
      });
    } else {
      await createProduct.mutateAsync(data);
    }
    
    onOpenChange(false);
    onClose();
  };
  
  // Calculate margin when client price or quotation price changes
  const calculateMargin = (clientPrice: number, quotationPrice: number) => {
    if (!clientPrice || !quotationPrice) return 0;
    return ((quotationPrice - clientPrice) / clientPrice) * 100;
  };
  
  // Update margin when prices change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'client_price' || name === 'quotation_price') {
        const clientPrice = form.getValues('client_price');
        const quotationPrice = form.getValues('quotation_price');
        
        if (clientPrice && quotationPrice) {
          const margin = calculateMargin(clientPrice, quotationPrice);
          form.setValue('margin', Number(margin.toFixed(2)));
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {editingProduct 
              ? 'Update the product details below.'
              : 'Fill in the details below to create a new product.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Product name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
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
                    <FormLabel>SKU (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="brand_id"
              rules={{ required: "Brand is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ''}
                    disabled={brandsLoading}
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief description of the product"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="client_price"
                rules={{ required: "Client price is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Price (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quotation_price"
                rules={{ required: "Quotation price is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Price (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
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
                        step="0.01"
                        readOnly
                        {...field}
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
                    <FormLabel className="text-base">Product Status</FormLabel>
                    <FormDescription>
                      {field.value ? 'Product is active and visible' : 'Product is inactive and hidden'}
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
                onClick={() => {
                  onOpenChange(false);
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {createProduct.isPending || updateProduct.isPending 
                  ? 'Saving...'
                  : editingProduct ? 'Update Product' : 'Create Product'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
