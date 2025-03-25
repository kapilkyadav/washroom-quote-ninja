import { useState } from 'react';
import { FileUp, FileX, FileCheck, Database, Download, BarChart, ShoppingCart, Mail, Package, Link, Spreadsheet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const DataImportTab = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isExporting, setIsExporting] = useState<{[key: string]: boolean}>({});
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  const [connectedSheets, setConnectedSheets] = useState<{name: string, url: string, lastSync: string}[]>([
    {name: 'Inventory Sheet', url: 'https://docs.google.com/spreadsheets/d/example1', lastSync: '2023-08-10 14:30'},
    {name: 'Customer Data', url: 'https://docs.google.com/spreadsheets/d/example2', lastSync: '2023-08-12 09:15'}
  ]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload Complete",
            description: `${selectedFile.name} has been successfully processed.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const exportSampleTemplate = () => {
    const headers = ['ID', 'Name', 'Description', 'Category', 'Price', 'Stock'];
    const sampleData = [
      ['1', 'Sample Product 1', 'This is a sample product', 'Category A', '₹1200', '10'],
      ['2', 'Sample Product 2', 'Another sample product', 'Category B', '₹850', '15'],
      ['3', 'Sample Product 3', 'Yet another sample', 'Category A', '₹2100', '5']
    ];
    
    const csv = [headers, ...sampleData].map(row => row.join(',')).join('\n');
    
    downloadFile(csv, 'import-template.csv', 'text/csv');
    
    toast({
      title: "Template Downloaded",
      description: "Sample import template has been downloaded.",
    });
  };

  const exportData = (dataType: string, format: 'csv' | 'excel') => {
    const exportKey = `${dataType}-${format}`;
    setIsExporting({...isExporting, [exportKey]: true});
    
    setTimeout(() => {
      let data: string;
      let filename: string;
      let mimeType: string;
      
      if (dataType.includes('Brands')) {
        const headers = ['ID', 'Brand Name', 'Category', 'Products Count', 'Active'];
        const sampleData = [
          ['1', 'Kohler', 'Premium', '24', 'Yes'],
          ['2', 'American Standard', 'Standard', '18', 'Yes'],
          ['3', 'Jaquar', 'Standard', '32', 'Yes'],
          ['4', 'Hindware', 'Economy', '15', 'Yes'],
          ['5', 'Parryware', 'Standard', '21', 'Yes']
        ];
        data = [headers, ...sampleData].map(row => row.join(',')).join('\n');
      } 
      else if (dataType.includes('Customer Leads')) {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Date', 'Status', 'Estimate Value'];
        const sampleData = [
          ['1', 'Rahul Sharma', 'rahul@example.com', '9876543210', '2023-05-15', 'New', '₹45,000'],
          ['2', 'Priya Patel', 'priya@example.com', '8765432109', '2023-05-16', 'Contacted', '₹78,000'],
          ['3', 'Amit Singh', 'amit@example.com', '7654321098', '2023-05-18', 'Qualified', '₹92,500'],
          ['4', 'Neha Gupta', 'neha@example.com', '6543210987', '2023-05-20', 'Proposal', '₹1,25,000'],
          ['5', 'Vikram Reddy', 'vikram@example.com', '5432109876', '2023-05-22', 'Negotiation', '₹68,000']
        ];
        data = [headers, ...sampleData].map(row => row.join(',')).join('\n');
      }
      else if (dataType.includes('Projects')) {
        const headers = ['ID', 'Project Name', 'Client', 'Start Date', 'End Date', 'Status', 'Value'];
        const sampleData = [
          ['1', 'Sharma Residence', 'Rahul Sharma', '2023-06-01', '2023-07-15', 'In Progress', '₹45,000'],
          ['2', 'Green Valley Office', 'Green Valley Ltd', '2023-05-10', '2023-06-20', 'Completed', '₹78,000'],
          ['3', 'Luxury Hotel Renovation', 'Taj Hotels', '2023-07-01', '2023-09-30', 'Planning', '₹2,92,500'],
          ['4', 'Gupta Apartment', 'Neha Gupta', '2023-06-15', '2023-07-30', 'In Progress', '₹1,25,000'],
          ['5', 'Corporate Washrooms', 'Tech Solutions', '2023-08-01', '2023-09-15', 'Not Started', '₹5,68,000']
        ];
        data = [headers, ...sampleData].map(row => row.join(',')).join('\n');
      }
      else {
        const headers = ['ID', 'Report Name', 'Generated Date', 'Type', 'Summary'];
        const sampleData = [
          ['1', 'Monthly Sales Report', '2023-05-31', 'Sales', 'Total: ₹3,45,000'],
          ['2', 'Quarterly Performance', '2023-06-30', 'Performance', 'Growth: 15%'],
          ['3', 'Material Usage Report', '2023-07-15', 'Inventory', 'Efficiency: 92%'],
          ['4', 'Customer Satisfaction', '2023-07-20', 'Customer', 'Rating: 4.7/5'],
          ['5', 'Project Completion Time', '2023-07-25', 'Project', 'Avg: 32 days']
        ];
        data = [headers, ...sampleData].map(row => row.join(',')).join('\n');
      }
      
      if (format === 'csv') {
        filename = `${dataType.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-export.csv`;
        mimeType = 'text/csv';
      } else {
        filename = `${dataType.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-export.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
      
      downloadFile(data, filename, mimeType);
      
      setIsExporting({...isExporting, [exportKey]: false});
      
      toast({
        title: "Export Complete",
        description: `${dataType} data has been exported as ${format.toUpperCase()}.`,
      });
    }, 1500);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSheetUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleSheetUrl(e.target.value);
  };

  const handleConnectSheet = () => {
    if (!googleSheetUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid Google Sheet URL",
        variant: "destructive"
      });
      return;
    }

    const sheetName = `Sheet ${connectedSheets.length + 1}`;
    const currentDate = new Date().toISOString().split('T')[0] + ' ' + 
                         new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const newSheet = {
      name: sheetName,
      url: googleSheetUrl,
      lastSync: currentDate
    };

    setConnectedSheets([...connectedSheets, newSheet]);
    setGoogleSheetUrl('');
    
    toast({
      title: "Sheet Connected",
      description: `Successfully connected to "${sheetName}"`,
    });
  };

  const handleSyncSheet = (index: number) => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          
          const updatedSheets = [...connectedSheets];
          const currentDate = new Date().toISOString().split('T')[0] + ' ' + 
                              new Date().toTimeString().split(' ')[0].substring(0, 5);
          updatedSheets[index].lastSync = currentDate;
          setConnectedSheets(updatedSheets);
          setLastSyncDate(currentDate);
          
          toast({
            title: "Sync Complete",
            description: `Data from "${connectedSheets[index].name}" has been synchronized successfully.`,
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handleMappingData = () => {
    toast({
      title: "Column Mapping Saved",
      description: "Your column mapping configuration has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="sync">Google Sheets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="mt-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Import Data</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upload CSV or Excel files to import data into the system. Please ensure your data follows the required format.
            </p>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm font-medium">Select Import Type</label>
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="brands">Brands & Products</option>
                  <option value="leads">Customer Leads</option>
                  <option value="projects">Projects</option>
                  <option value="fixtures">Fixtures & Pricing</option>
                </select>
              </div>
              
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-lg font-medium">
                      <FileCheck size={24} className="text-green-500" />
                      {selectedFile.name}
                    </div>
                    
                    {isUploading ? (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="h-2 w-full" />
                        <div className="text-sm text-muted-foreground">
                          Uploading... {uploadProgress}%
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <Button onClick={handleUpload}>Process File</Button>
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <FileUp size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-1">Drop your file here or click to browse</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports CSV, XLS, XLSX up to 10MB
                    </p>
                    <Button asChild>
                      <label>
                        Browse Files
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.xls,.xlsx"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </Button>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Need a template to get started?
                </div>
                <Button variant="outline" size="sm" onClick={exportSampleTemplate}>
                  Download Template
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="mt-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Export Data</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Download system data in CSV or Excel format for reporting or backup purposes.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { id: 'brands', title: 'Brands & Products', icon: ShoppingCart, description: 'Export all brands and product information' },
                { id: 'leads', title: 'Customer Leads', icon: Mail, description: 'Export customer leads and contact information' },
                { id: 'projects', title: 'Projects', icon: Package, description: 'Export all project data and status information' },
                { id: 'reports', title: 'Reports & Analytics', icon: BarChart, description: 'Export analytics and performance reports' },
              ].map((item) => (
                <div key={item.id} className="border rounded-lg p-4 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <item.icon size={24} className="text-muted-foreground" />
                  </div>
                  <div className="mt-auto pt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => exportData(item.title, 'csv')}
                      disabled={isExporting[`${item.title}-csv`]}
                    >
                      {isExporting[`${item.title}-csv`] ? (
                        <span>Exporting...</span>
                      ) : (
                        <>
                          <Download size={14} className="mr-1" /> CSV
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => exportData(item.title, 'excel')}
                      disabled={isExporting[`${item.title}-excel`]}
                    >
                      {isExporting[`${item.title}-excel`] ? (
                        <span>Exporting...</span>
                      ) : (
                        <>
                          <Download size={14} className="mr-1" /> Excel
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database size={16} />
                <span>Last database backup: 14 Aug 2023, 03:45 AM</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sync" className="mt-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Sync with Google Sheets</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Connect and synchronize data with Google Sheets. Changes made in either system can be synced bidirectionally.
            </p>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Connect a new sheet</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Paste Google Sheet URL"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={googleSheetUrl}
                      onChange={handleSheetUrlChange}
                    />
                  </div>
                  <Button onClick={handleConnectSheet} className="whitespace-nowrap">
                    <Link size={14} className="mr-1" /> Connect Sheet
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Make sure your Google Sheet is shared with view access to anyone with the link.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Connected Sheets</h4>
                {connectedSheets.length > 0 ? (
                  <div className="space-y-3">
                    {connectedSheets.map((sheet, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium">{sheet.name}</h5>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">{sheet.url}</p>
                            <p className="text-xs mt-1">Last sync: {sheet.lastSync}</p>
                          </div>
                          <div className="flex gap-2">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Configure
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Configure Data Mapping</SheetTitle>
                                  <SheetDescription>
                                    Map columns from your Google Sheet to database fields.
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Sheet: {sheet.name}</h4>
                                    <div className="border rounded-md p-3 mb-4 bg-muted/30">
                                      <p className="text-xs text-muted-foreground mb-2">Column mapping:</p>
                                      <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                          <p className="text-xs font-medium">Google Sheet Column</p>
                                          <p className="text-xs font-medium">Database Field</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <p className="text-xs">Product Name</p>
                                          <p className="text-xs">products.name</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <p className="text-xs">SKU</p>
                                          <p className="text-xs">products.sku</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <p className="text-xs">Price</p>
                                          <p className="text-xs">products.price</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <label className="text-sm font-medium mb-1 block">Sync Direction</label>
                                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="bidirectional">Bidirectional (Both ways)</option>
                                        <option value="sheet-to-app">Google Sheet to App only</option>
                                        <option value="app-to-sheet">App to Google Sheet only</option>
                                      </select>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <label className="text-sm font-medium mb-1 block">Advanced Mapping (JSON)</label>
                                      <Textarea 
                                        className="min-h-[120px]"
                                        placeholder='{"sheet_column": "db_field", "Product Name": "products.name"}'
                                      />
                                    </div>
                                  </div>
                                  <Button onClick={handleMappingData} className="w-full">Save Configuration</Button>
                                </div>
                              </SheetContent>
                            </Sheet>
                            <Button 
                              size="sm" 
                              variant="default" 
                              disabled={isSyncing}
                              onClick={() => handleSyncSheet(index)}
                            >
                              <RefreshCw size={14} className={`mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                              Sync Now
                            </Button>
                          </div>
                        </div>
                        
                        {isSyncing && index === connectedSheets.indexOf(connectedSheets[index]) && (
                          <div className="space-y-2">
                            <Progress value={syncProgress} className="h-2 w-full" />
                            <div className="text-xs text-muted-foreground">
                              Syncing... {syncProgress}%
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <Spreadsheet size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No sheets connected yet</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database size={16} />
                  <span>
                    {lastSyncDate 
                      ? `Last sheet sync: ${lastSyncDate}` 
                      : 'No sheets have been synced yet'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImportTab;
