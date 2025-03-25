
import { useState } from 'react';
import { FileUp, FileX, FileCheck, Database, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const DataImportTab = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
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
    toast({
      title: "Template Downloaded",
      description: "Sample import template has been downloaded.",
    });
  };
  
  const exportData = (dataType: string) => {
    toast({
      title: "Export Started",
      description: `${dataType} data export has been initiated.`,
    });
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
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => exportData(`${item.title} (CSV)`)}>
                      <Download size={14} className="mr-1" /> CSV
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => exportData(`${item.title} (Excel)`)}>
                      <Download size={14} className="mr-1" /> Excel
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

import { BarChart, ShoppingCart } from 'lucide-react';

export default DataImportTab;
