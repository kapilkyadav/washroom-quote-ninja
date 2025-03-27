
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ImportConfiguration, ColumnMapping } from '@/types';
import { supabase } from '@/lib/supabase';

interface SheetData {
  headers: string[];
  rows: Record<string, any>[];
}

export const useGoogleSheets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  
  // Function to extract the sheet ID from a Google Sheets URL
  const extractSheetId = (url: string): string | null => {
    const matches = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return matches ? matches[1] : null;
  };

  // Fetch sheet data
  const fetchSheetData = async (url: string) => {
    setIsLoading(true);
    
    try {
      const sheetId = extractSheetId(url);
      
      if (!sheetId) {
        throw new Error("Invalid Google Sheets URL");
      }
      
      // Using the Google Sheets API to fetch the sheet data
      // Note: In a real-world scenario, you might need to use a proxy or server-side function
      // due to CORS restrictions
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch sheet data");
      }
      
      const text = await response.text();
      // Google Sheets API returns a callback wrapper. We need to extract the JSON.
      const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonText);
      
      if (!data.table || !data.table.cols || !data.table.rows) {
        throw new Error("Invalid sheet data format");
      }
      
      // Extract headers and rows
      const headers = data.table.cols.map((col: any) => col.label);
      
      const rows = data.table.rows.map((row: any) => {
        const rowData: Record<string, any> = {};
        
        row.c.forEach((cell: any, index: number) => {
          rowData[headers[index]] = cell ? cell.v : null;
        });
        
        return rowData;
      });
      
      setSheetData({ headers, rows });
      
      toast({
        title: "Sheet Data Fetched",
        description: `Found ${rows.length} rows with ${headers.length} columns.`
      });
      
      return { headers, rows };
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch sheet data",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save import configuration
  const saveImportConfiguration = async (config: Omit<ImportConfiguration, 'id' | 'created_at' | 'updated_at' | 'last_used'>) => {
    try {
      const { data, error } = await supabase
        .from('import_configurations')
        .insert(config)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Configuration Saved",
        description: "Import configuration has been saved successfully."
      });
      
      return data as ImportConfiguration;
    } catch (error) {
      console.error('Error saving import configuration:', error);
      
      toast({
        title: "Error",
        description: "Failed to save import configuration",
        variant: "destructive"
      });
      
      return null;
    }
  };

  // Get import configurations
  const getImportConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('import_configurations')
        .select('*')
        .order('last_used', { ascending: false });
      
      if (error) throw error;
      
      return data as ImportConfiguration[];
    } catch (error) {
      console.error('Error fetching import configurations:', error);
      
      toast({
        title: "Error",
        description: "Failed to fetch import configurations",
        variant: "destructive"
      });
      
      return [];
    }
  };

  return {
    isLoading,
    sheetData,
    fetchSheetData,
    saveImportConfiguration,
    getImportConfigurations
  };
};
