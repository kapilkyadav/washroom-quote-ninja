
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { BrandData, ProductData } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  brand_id: z.number().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  client_price: z.coerce.number().min(0, {
    message: 'Price must be a positive number.',
  }),
  quotation_price: z.coerce.number().min(0, {
    message: 'Price must be a positive number.',
  }),
  margin: z.coerce.number(),
  active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductData;
  brands: BrandData[];
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  brands,
  onSubmit,
  isSubmitting,
}: ProductDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      brand_id: product?.brand_id || undefined,
      sku: product?.sku || '',
      description: product?.description || '',
      client_price: product?.client_price || 0,
      quotation_price: product?.quotation_price || 0,
      margin: product?.margin || 0,
      active: product?.active ?? true,
    },
  });

  // Update form values when product changes
  React.useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        brand_id: product.brand_id,
        sku: product.sku || '',
        description: product.description || '',
        client_price: product.client_price,
        quotation_price: product.quotation_price,
        margin: product.margin,
        active: product.active,
      });
    } else {
      form.reset({
        name: '',
        brand_id: undefined,
        sku: '',
        description: '',
        client_price: 0,
        quotation_price: 0,
        margin: 0,
        active: true,
      });
    }
  }, [product, form]);

  // Calculate margin when prices change
  React.useEffect(() => {
    const subscription = form.watch(({ client_price, quotation_price }) => {
      if (client_price && quotation_price && client_price > 0) {
        const calculatedMargin = ((quotation_price - client_price) / client_price) * 100;
        form.setValue('margin', parseFloat(calculatedMargin.toFixed(2)));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Update quotation price when margin changes
  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const margin = parseFloat(e.target.value);
    const clientPrice = form.getValues('client_price');
    
    if (!isNaN(margin) && clientPrice > 0) {
      const newQuotationPrice = clientPrice * (1 + margin / 100);
      form.setValue('quotation_price', parseFloat(newQuotationPrice.toFixed(2)));
    }
  };

  // Update margin when quotation price changes
  const handleQuotationPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quotationPrice = parseFloat(e.target.value);
    const clientPrice = form.getValues('client_price');
    
    if (!isNaN(quotationPrice) && clientPrice > 0) {
      const newMargin = ((quotationPrice - clientPrice) / clientPrice) * 100;
      form.setValue('margin', parseFloat(newMargin.toFixed(2)));
    }
  };

  // Handle form submission
  const handleSubmit = (values: ProductFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product
              ? 'Update product details below'
              : 'Fill in the details to add a new product'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Premium Faucet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Brand</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? brands.find((brand) => brand.id === field.value)?.name || "Select brand"
                            : "Select brand"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search brand..." />
                        <CommandEmpty>No brand found.</CommandEmpty>
                        <CommandGroup>
                          {brands.map((brand) => (
                            <CommandItem
                              key={brand.id}
                              value={brand.name}
                              onSelect={() => {
                                form.setValue("brand_id", brand.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  brand.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {brand.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the brand this product belongs to
                  </FormDescription>
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
                    <Input placeholder="E.g., PF-001" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional stock keeping unit identifier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Update quotation price based on margin
                          const clientPrice = parseFloat(e.target.value);
                          const margin = form.getValues('margin');
                          if (!isNaN(clientPrice) && !isNaN(margin)) {
                            const newQuotationPrice = clientPrice * (1 + margin / 100);
                            form.setValue('quotation_price', parseFloat(newQuotationPrice.toFixed(2)));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quotation_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleQuotationPriceChange(e);
                        }}
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
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleMarginChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Show this product in listings
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description..."
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
