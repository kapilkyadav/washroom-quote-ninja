
import { useState, useEffect } from 'react';
import { useGoogleSheets } from '@/hooks/use-google-sheets';
import { useProducts } from '@/hooks/use-products';
import { useBrands } from '@/hooks/use-brands';
import { ProductData, ColumnMapping, BrandData } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Database, FileSpreadsheet, Upload, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportDialog = ({ open, onOpenChange }: ImportDialogProps) => {
  const { fetchSheetData, isLoading, sheetData, saveImportConfiguration } = useGoogleSheets();
  const { bulkCreateProducts } = useProducts();
  const { brands } = useBrands();
  
  const [activeStep, setActiveStep] = useState(0);
  const [sheetUrl, setSheetUrl] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [configName, setConfigName] = useState('');
  const [saveConfig, setSaveConfig] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  
  // Reset state when dialog is opened/closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setActiveStep(0);
        setSheetUrl('');
        setSelectedBrandId(null);
        setMappings({});
        setConfigName('');
        setSaveConfig(false);
        setImportProgress(0);
        setIsImporting(false);
      }, 300);
    }
  }, [open]);
  
  // Product fields for mapping
  const productFields = [
    { key: 'name', label: 'Product Name', required: true },
    { key: 'sku', label: 'SKU', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'client_price', label: 'Client Price', required: true },
    { key: 'quotation_price', label: 'Quotation Price', required: true },
    { key: 'extra_data', label: 'Extra Data (JSON)', required: false },
  ];
  
  // Fetch sheet data
  const handleFetchSheet = async () => {
    if (!sheetUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid Google Sheet URL",
        variant: "destructive"
      });
      return;
    }
    
    const data = await fetchSheetData(sheetUrl);
    
    if (data) {
      setActiveStep(1);
    }
  };
  
  // Handle mapping change
  const handleMappingChange = (sourceColumn: string, targetField: string) => {
    setMappings(prev => ({
      ...prev,
      [sourceColumn]: targetField
    }));
  };
  
  // Check if all required fields are mapped
  const areRequiredFieldsMapped = () => {
    const requiredFields = productFields.filter(field => field.required).map(field => field.key);
    const mappedFields = Object.values(mappings);
    
    return requiredFields.every(field => mappedFields.includes(field));
  };
  
  // Preview the mapped data
  const previewMappedData = () => {
    if (!sheetData || !sheetData.rows.length) return [];
    
    return sheetData.rows.slice(0, 5).map(row => {
      const mappedRow: Record<string, any> = {};
      
      Object.entries(mappings).forEach(([sourceColumn, targetField]) => {
        if (targetField !== 'skip') {
          mappedRow[targetField] = row[sourceColumn];
        }
      });
      
      return mappedRow;
    });
  };
  
  // Import products
  const handleImport = async () => {
    if (!sheetData || !selectedBrandId) return;
    
    setIsImporting(true);
    
    try {
      // Create products array with mapped data
      const productsToImport: Omit<ProductData, 'id' | 'created_at' | 'updated_at'>[] = [];
      
      sheetData.rows.forEach((row, index) => {
        // Update progress
        setImportProgress(Math.floor((index / sheetData.rows.length) * 100));
        
        const productData: Record<string, any> = {
          brand_id: selectedBrandId,
          active: true,
        };
        
        // Apply mappings
        Object.entries(mappings).forEach(([sourceColumn, targetField]) => {
          if (targetField !== 'skip') {
            // For numeric fields, ensure they are numbers
            if (['client_price', 'quotation_price', 'margin'].includes(targetField)) {
              productData[targetField] = parseFloat(row[sourceColumn]) || 0;
            } else if (targetField === 'extra_data') {
              // Initialize extra_data if it doesn't exist
              if (!productData.extra_data) {
                productData.extra_data = {};
              }
              // Add to extra_data field
              productData.extra_data[sourceColumn] = row[sourceColumn];
            } else {
              productData[targetField] = row[sourceColumn];
            }
          }
        });
        
        // Calculate margin if it's not mapped
        if (!productData.margin && productData.client_price && productData.quotation_price) {
          productData.margin = ((productData.quotation_price - productData.client_price) / productData.client_price) * 100;
        }
        
        productsToImport.push(productData as any);
      });
      
      // Save import configuration if requested
      if (saveConfig && configName) {
        await saveImportConfiguration({
          name: configName,
          source_type: 'google_sheet',
          source_url: sheetUrl,
          column_mappings: mappings
        });
      }
      
      // Import products
      await bulkCreateProducts.mutateAsync(productsToImport);
      
      // Close dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Error",
        description: "An error occurred during import.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Import Products from Google Sheets</DialogTitle>
          <DialogDescription>
            Import product data from Google Sheets and map the columns to your product fields.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeStep.toString()} onValueChange={(v) => setActiveStep(parseInt(v))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="0" disabled={activeStep < 0}>
              1. Connect Sheet
            </TabsTrigger>
            <TabsTrigger value="1" disabled={activeStep < 1}>
              2. Map Columns
            </TabsTrigger>
            <TabsTrigger value="2" disabled={activeStep < 2}>
              3. Review & Import
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="0" className="py-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sheet-url">Google Sheet URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="sheet-url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                  />
                  <Button 
                    onClick={handleFetchSheet} 
                    disabled={isLoading || !sheetUrl}
                  >
                    {isLoading ? 'Loading...' : 'Connect'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the URL of the Google Sheet containing your product data. The sheet must be public or shared with view access.
                </p>
              </div>
              
              <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md">
                <div className="text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    Your sheet should include columns for product data
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required fields: Product Name, Client Price, Quotation Price
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="1" className="py-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brand-select">Select Brand for Products</Label>
                <Select 
                  onValueChange={(value) => setSelectedBrandId(Number(value))}
                  value={selectedBrandId?.toString() || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  All imported products will be associated with this brand.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Map Sheet Columns to Product Fields</Label>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sheet Column</TableHead>
                        <TableHead>Map To</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Sample Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetData?.headers.map((header) => (
                        <TableRow key={header}>
                          <TableCell className="font-medium">{header}</TableCell>
                          <TableCell>
                            <Select
                              value={mappings[header] || 'skip'}
                              onValueChange={(value) => handleMappingChange(header, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Map to..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="skip">Skip this column</SelectItem>
                                {productFields.map((field) => (
                                  <SelectItem key={field.key} value={field.key}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {productFields.find(field => field.key === mappings[header])?.required 
                              ? <Check size={16} className="text-green-500" /> 
                              : <X size={16} className="text-muted-foreground" />
                            }
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sheetData.rows[0]?.[header] || ''}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveStep(0)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setActiveStep(2)} 
                  disabled={!selectedBrandId || !areRequiredFieldsMapped()}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="2" className="py-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Data Preview</Label>
                <div className="border rounded-md overflow-auto max-h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {productFields.map((field) => (
                          <TableHead key={field.key}>{field.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewMappedData().map((row, index) => (
                        <TableRow key={index}>
                          {productFields.map((field) => (
                            <TableCell key={field.key}>
                              {row[field.key] !== undefined 
                                ? String(row[field.key])
                                : '-'
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing preview of first 5 rows. Total rows to import: {sheetData?.rows.length || 0}
                </p>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="save-config"
                      checked={saveConfig}
                      onChange={(e) => setSaveConfig(e.target.checked)}
                    />
                    <Label htmlFor="save-config">Save this import configuration for future use</Label>
                  </div>
                  
                  {saveConfig && (
                    <div className="mt-4">
                      <Label htmlFor="config-name">Configuration Name</Label>
                      <Input
                        id="config-name"
                        placeholder="e.g., Monthly Product Import"
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {isImporting && (
                <div className="space-y-2">
                  <Label>Import Progress</Label>
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Importing products... {importProgress}%
                  </p>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting || !selectedBrandId || !areRequiredFieldsMapped()}
                  className="gap-2"
                >
                  <Upload size={16} />
                  {isImporting ? 'Importing...' : 'Import Products'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
