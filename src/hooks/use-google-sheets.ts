
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ImportConfiguration, ProductData } from '@/types';

export type SheetData = {
  headers: string[];
  rows: Record<string, string>[];
};

export type SheetColumn = string;

export interface ColumnMapping {
  sourceColumn: string;
  targetField: keyof ProductData | 'extra_data';
  isRequired?: boolean;
}

export const useGoogleSheets = () => {
  const [sheetData, setSheetData] = useState<SheetData>({ headers: [], rows: [] });
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [selectedConfig, setSelectedConfig] = useState<ImportConfiguration | null>(null);
  
  // Fetch import configurations
  const { 
    data: importConfigs,
    isLoading: isLoadingConfigs,
    refetch: refetchConfigs
  } = useQuery({
    queryKey: ['importConfigurations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('import_configurations')
          .select('*')
          .order('name');
        
        if (error) throw error;
        return data as ImportConfiguration[];
      } catch (error) {
        console.error('Error fetching import configurations:', error);
        return [] as ImportConfiguration[];
      }
    }
  });
  
  // Fetch sheet data from Google Sheet URL
  const fetchSheetData = async (url: string): Promise<SheetData> => {
    try {
      // Extract the sheet ID from the URL
      const matches = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/) ||
                     url.match(/docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      
      if (!matches || !matches[1]) {
        throw new Error('Invalid Google Sheet URL');
      }
      
      const sheetId = matches[1];
      
      // Construct the API URL to fetch the sheet data
      const apiUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sheet data');
      }
      
      const text = await response.text();
      
      // Extract JSON from the response (it comes wrapped in a callback)
      const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonText);
      
      // Extract headers and rows
      const headers = data.table.cols.map((col: any) => col.label || '');
      
      // Extract rows as objects with header keys
      const rows = data.table.rows.map((row: any) => {
        const rowData: Record<string, string> = {};
        row.c.forEach((cell: any, index: number) => {
          const header = headers[index];
          if (header) {
            rowData[header] = cell ? (cell.v !== null ? String(cell.v) : '') : '';
          }
        });
        return rowData;
      });
      
      return { headers, rows };
    } catch (error) {
      console.error('Error fetching Google Sheet:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      return { headers: [], rows: [] };
    }
  };
  
  // Save import configuration
  const saveImportConfiguration = useMutation({
    mutationFn: async ({ name, sourceUrl, mappings }: { name: string; sourceUrl: string; mappings: Record<string, string> }) => {
      try {
        const { data, error } = await supabase
          .from('import_configurations')
          .insert({
            name,
            source_type: 'google_sheet',
            source_url: sourceUrl,
            column_mappings: mappings,
            last_used: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        return data?.[0] as ImportConfiguration;
      } catch (error) {
        console.error('Error saving import configuration:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Configuration Saved',
        description: 'Your import configuration has been saved.',
      });
      refetchConfigs();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update import configuration
  const updateImportConfiguration = useMutation({
    mutationFn: async ({ id, name, sourceUrl, mappings }: { id: number; name: string; sourceUrl: string; mappings: Record<string, string> }) => {
      try {
        const { data, error } = await supabase
          .from('import_configurations')
          .update({
            name,
            source_url: sourceUrl,
            column_mappings: mappings,
            last_used: new Date().toISOString()
          })
          .eq('id', id)
          .select();
        
        if (error) throw error;
        return data?.[0] as ImportConfiguration;
      } catch (error) {
        console.error('Error updating import configuration:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Configuration Updated',
        description: 'Your import configuration has been updated.',
      });
      refetchConfigs();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });
  
  // Delete import configuration
  const deleteImportConfiguration = useMutation({
    mutationFn: async (id: number) => {
      try {
        const { error } = await supabase
          .from('import_configurations')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return id;
      } catch (error) {
        console.error('Error deleting import configuration:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Configuration Deleted',
        description: 'Your import configuration has been deleted.',
      });
      refetchConfigs();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });
  
  return {
    fetchSheetData,
    sheetData,
    setSheetData,
    columnMappings,
    setColumnMappings,
    importConfigs,
    selectedConfig,
    setSelectedConfig,
    saveImportConfiguration,
    updateImportConfiguration,
    deleteImportConfiguration,
    isLoadingConfigs
  };
};
