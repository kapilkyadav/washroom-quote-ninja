
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ColumnMapping, ImportConfiguration, ProductData } from '@/types';

// API key for accessing Google Sheets (this would need to be environment variable in production)
// const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export interface SheetColumn {
  header: string;
  index: number;
}

export interface SheetData {
  headers: SheetColumn[];
  rows: string[][];
}

export const useGoogleSheets = () => {
  const queryClient = useQueryClient();
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  
  // Get sheet ID from URL
  const getSheetIdFromUrl = (url: string): string | null => {
    try {
      // Extract sheet ID from various Google Sheets URL formats
      const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error parsing Google Sheets URL:', error);
      return null;
    }
  };
  
  // Fetch sheet data
  const fetchSheetData = async (url: string): Promise<SheetData> => {
    setIsLoadingSheet(true);
    setSheetError(null);
    
    try {
      const sheetId = getSheetIdFromUrl(url);
      
      if (!sheetId) {
        throw new Error('Invalid Google Sheets URL');
      }
      
      // For the sake of this example, we'll simulate the sheet data
      // In a real app, you would call the Google Sheets API
      
      // Simulated data for the example
      const simulatedHeaders = [
        'Name', 'SKU', 'Description', 'Client Price', 
        'Quotation Price', 'Margin', 'Active', 'Extra Field 1', 
        'Extra Field 2'
      ];
      
      const simulatedRows = Array(15).fill(0).map((_, i) => [
        `Product ${i + 1}`,
        `SKU-${1000 + i}`,
        `Description for product ${i + 1}`,
        `${Math.floor(Math.random() * 5000) + 1000}`,
        `${Math.floor(Math.random() * 8000) + 2000}`,
        `${Math.floor(Math.random() * 30) + 10}`,
        i % 3 === 0 ? 'No' : 'Yes',
        `Value ${i} for extra field 1`,
        `Value ${i} for extra field 2`
      ]);
      
      // Format the data
      const headers: SheetColumn[] = simulatedHeaders.map((header, index) => ({
        header,
        index
      }));
      
      return {
        headers,
        rows: simulatedRows
      };
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      setSheetError(error instanceof Error ? error.message : 'Unknown error occurred');
      throw error;
    } finally {
      setIsLoadingSheet(false);
    }
  };
  
  // Save import configuration
  const saveImportConfig = useMutation({
    mutationFn: async (config: Omit<ImportConfiguration, 'id' | 'created_at' | 'updated_at' | 'last_used'>) => {
      const { data, error } = await supabase
        .from('import_configurations')
        .insert(config)
        .select('*')
        .single();
      
      if (error) throw error;
      return data as ImportConfiguration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import_configurations'] });
      toast({
        title: "Configuration Saved",
        description: "Import configuration has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error saving import configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save import configuration. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Get saved configurations
  const { data: savedConfigs, isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['import_configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('import_configurations')
        .select('*')
        .order('last_used', { ascending: false });
      
      if (error) throw error;
      return data as ImportConfiguration[];
    }
  });
  
  return {
    fetchSheetData,
    sheetData,
    setSheetData,
    isLoadingSheet,
    sheetError,
    saveImportConfig,
    savedConfigs,
    isLoadingConfigs
  };
};

export const defaultColumnMappings: ColumnMapping[] = [
  { sourceColumn: '', targetField: 'name', isRequired: true },
  { sourceColumn: '', targetField: 'sku' },
  { sourceColumn: '', targetField: 'description' },
  { sourceColumn: '', targetField: 'client_price', isRequired: true },
  { sourceColumn: '', targetField: 'quotation_price', isRequired: true },
  { sourceColumn: '', targetField: 'margin', isRequired: true },
  { sourceColumn: '', targetField: 'active' },
  { sourceColumn: '', targetField: 'extra_data' }
];
