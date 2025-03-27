
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { BrandData, ProductData } from '@/types';
import { useGoogleSheets, SheetData } from '@/hooks/use-google-sheets';
import { useProducts } from '@/hooks/use-products';

export interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: BrandData[];
  onImport: (products: Omit<ProductData, 'id' | 'created_at' | 'updated_at'>[]) => void;
  isSubmitting: boolean;
}

export function ImportDialog({
  open,
  onOpenChange,
  brands,
  onImport,
  isSubmitting
}: ImportDialogProps) {
  const { 
    fetchSheetData, 
    sheetData, 
    setSheetData,
    importConfigs,
    isLoadingConfigs 
  } = useGoogleSheets();
  
  const [sheetUrl, setSheetUrl] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [step, setStep] = useState<'url' | 'mapping' | 'preview'>('url');
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [previewProducts, setPreviewProducts] = useState<Omit<ProductData, 'id' | 'created_at' | 'updated_at'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Available target fields for mapping
  const targetFields = [
    { id: 'name', label: 'Product Name', isRequired: true },
    { id: 'sku', label: 'SKU' },
    { id: 'description', label: 'Description' },
    { id: 'client_price', label: 'Client Price', isRequired: true },
    { id: 'quotation_price', label: 'Quotation Price' },
    { id: 'margin', label: 'Margin (%)' },
    { id: 'extra_data', label: 'Extra Data (as JSON)' }
  ];
  
  // Reset dialog state when it opens
  useEffect(() => {
    if (open) {
      setSheetUrl('');
      setSelectedBrandId(null);
      setStep('url');
      setColumnMappings({});
      setPreviewProducts([]);
      setSheetData({ headers: [], rows: [] });
    }
  }, [open, setSheetData]);
  
  // Handle fetch sheet data
  const handleFetchSheet = async () => {
    if (!sheetUrl) return;
    
    setIsLoading(true);
    try {
      const data = await fetchSheetData(sheetUrl);
      setSheetData(data);
      setStep('mapping');
    } catch (error) {
      console.error('Failed to fetch sheet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle column mapping change
  const handleMappingChange = (sourceColumn: string, targetField: string) => {
    setColumnMappings(prev => ({
      ...prev,
      [sourceColumn]: targetField
    }));
  };
  
  // Go to preview step
  const handlePreview = () => {
    // Check required mappings
    const requiredFields = targetFields.filter(field => field.isRequired).map(field => field.id);
    const mappedFields = Object.values(columnMappings);
    
    const missingRequiredFields = requiredFields.filter(field => !mappedFields.includes(field));
    
    if (missingRequiredFields.length > 0) {
      alert(`Please map the following required fields: ${missingRequiredFields.join(', ')}`);
      return;
    }
    
    if (!selectedBrandId) {
      alert('Please select a brand for the imported products');
      return;
    }
    
    // Convert sheet data to product data using mappings
    const products = sheetData.rows.map(row => {
      const product: any = {
        brand_id: selectedBrandId,
        name: '',
        client_price: 0,
        quotation_price: 0,
        margin: 0,
        active: true,
        extra_data: {}
      };
      
      // Apply mappings
      Object.entries(columnMappings).forEach(([sourceColumn, targetField]) => {
        const value = row[sourceColumn];
        
        if (targetField === 'extra_data') {
          // Store unmapped columns in extra_data
          product.extra_data[sourceColumn] = value;
        } else if (targetField === 'client_price' || targetField === 'quotation_price' || targetField === 'margin') {
          // Convert numeric fields
          product[targetField] = parseFloat(value) || 0;
        } else {
          product[targetField] = value;
        }
      });
      
      // Auto calculate missing prices/margin
      if (product.client_price && !product.quotation_price && product.margin) {
        product.quotation_price = product.client_price * (1 + product.margin / 100);
      } else if (product.client_price && product.quotation_price && !product.margin) {
        product.margin = ((product.quotation_price - product.client_price) / product.client_price) * 100;
      }
      
      return product as Omit<ProductData, 'id' | 'created_at' | 'updated_at'>;
    });
    
    setPreviewProducts(products);
    setStep('preview');
  };
  
  // Handle final import
  const handleImport = () => {
    onImport(previewProducts);
    onOpenChange(false);
  };
  
  // Render the URL input step
  const renderUrlStep = () => (
    <>
      <DialogDescription>
        Enter a Google Sheets URL to import product data. The sheet must be publicly accessible.
      </DialogDescription>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="sheet-url">Google Sheet URL</Label>
          <Input
            id="sheet-url"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Paste the URL of the Google Sheet containing your product data
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Select onValueChange={(value) => setSelectedBrandId(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a brand for the products" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            All imported products will be associated with this brand
          </p>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleFetchSheet} disabled={!sheetUrl || isLoading}>
          {isLoading ? 'Loading...' : 'Next'}
        </Button>
      </DialogFooter>
    </>
  );
  
  // Render the mapping step
  const renderMappingStep = () => (
    <>
      <DialogDescription>
        Map columns from your spreadsheet to product fields
      </DialogDescription>
      
      <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
        <h3 className="text-lg font-medium">Column Mapping</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select how each column from your spreadsheet should be mapped to product fields
        </p>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sheet Column</TableHead>
                <TableHead>Maps To</TableHead>
                <TableHead>Sample Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetData.headers.map((column) => (
                <TableRow key={column}>
                  <TableCell className="font-medium">{column}</TableCell>
                  <TableCell>
                    <Select 
                      value={columnMappings[column] || ''} 
                      onValueChange={(value) => handleMappingChange(column, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not Mapped</SelectItem>
                        {targetFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label} {field.isRequired ? '*' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {sheetData.rows[0]?.[column] || ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={() => setStep('url')} variant="outline">
          Back
        </Button>
        <Button onClick={handlePreview}>
          Preview
        </Button>
      </DialogFooter>
    </>
  );
  
  // Render the preview step
  const renderPreviewStep = () => (
    <>
      <DialogDescription>
        Review the imported products before finalizing
      </DialogDescription>
      
      <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Preview ({previewProducts.length} products)</h3>
          <p className="text-sm text-muted-foreground">
            Brand: {brands.find(b => b.id === selectedBrandId)?.name}
          </p>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Client Price</TableHead>
                <TableHead className="text-right">Quotation Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewProducts.slice(0, 10).map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell className="text-right">{product.client_price}</TableCell>
                  <TableCell className="text-right">{product.quotation_price}</TableCell>
                </TableRow>
              ))}
              {previewProducts.length > 10 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    + {previewProducts.length - 10} more products
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={() => setStep('mapping')} variant="outline">
          Back
        </Button>
        <Button onClick={handleImport} disabled={isSubmitting}>
          {isSubmitting ? 'Importing...' : 'Import Products'}
        </Button>
      </DialogFooter>
    </>
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Import Products from Google Sheets</DialogTitle>
        </DialogHeader>
        
        {step === 'url' && renderUrlStep()}
        {step === 'mapping' && renderMappingStep()}
        {step === 'preview' && renderPreviewStep()}
      </DialogContent>
    </Dialog>
  );
}
