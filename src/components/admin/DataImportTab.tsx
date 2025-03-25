
import { useState } from 'react';
import { FileUp, FileX, FileCheck, Database, Download, BarChart, ShoppingCart, Mail, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const DataImportTab = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isExporting, setIsExporting] = useState<{[key: string]: boolean}>({});
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
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
    // Create sample data for CSV
    const headers = ['ID', 'Name', 'Description', 'Category', 'Price', 'Stock'];
    const sampleData = [
      ['1', 'Sample Product 1', 'This is a sample product', 'Category A', '₹1200', '10'],
      ['2', 'Sample Product 2', 'Another sample product', 'Category B', '₹850', '15'],
      ['3', 'Sample Product 3', 'Yet another sample', 'Category A', '₹2100', '5']
    ];
    
    // Convert to CSV
    const csv = [headers, ...sampleData].map(row => row.join(',')).join('\n');
    
    // Create and download the file
    downloadFile(csv, 'import-template.csv', 'text/csv');
    
    toast({
      title: "Template Downloaded",
      description: "Sample import template has been downloaded.",
    });
  };
  
  const exportData = (dataType: string, format: 'csv' | 'excel') => {
    const exportKey = `${dataType}-${format}`;
    setIsExporting({...isExporting, [exportKey]: true});
    
    // Simulate export delay
    setTimeout(() => {
      let data: string;
      let filename: string;
      let mimeType: string;
      
      // Generate appropriate data based on type
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
      
      // Set filename and mime type based on format
      if (format === 'csv') {
        filename = `${dataType.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-export.csv`;
        mimeType = 'text/csv';
      } else {
        // For Excel, we'll still use CSV but with .xlsx extension for the demo
        // In a real app, you'd use a library like xlsx to generate proper Excel files
        filename = `${dataType.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-export.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
      
      // Download the file
      downloadFile(data, filename, mimeType);
      
      setIsExporting({...isExporting, [exportKey]: false});
      
      toast({
        title: "Export Complete",
        description: `${dataType} data has been exported as ${format.toUpperCase()}.`,
      });
    }, 1500);
  };
  
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    // Create a blob with the data
    const blob = new Blob([content], { type: mimeType });
    
    // Create a link element
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default DataImportTab;
