
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ImportConfiguration } from '@/types';

export type SheetColumn = string;

export interface SheetData {
  title: string;
  columns: SheetColumn[];
  rows: Record<string, string>[];
}

export interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  isRequired?: boolean;
}

export const useGoogleSheets = () => {
  const [sheetData, setSheetData] = useState<SheetData>({
    title: '',
    columns: [],
    rows: []
  });
  
  const [savedConfigs, setSavedConfigs] = useState<ImportConfiguration[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState<boolean>(false);
  
  // Fetch existing import configurations from Supabase
  const loadSavedConfigurations = async () => {
    setIsLoadingConfigs(true);
    try {
      const { data, error } = await supabase
        .from('import_configurations')
        .select('*')
        .order('last_used', { ascending: false });
        
      if (error) throw error;
      setSavedConfigs(data as ImportConfiguration[]);
    } catch (error) {
      console.error('Error loading import configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load saved import configurations.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingConfigs(false);
    }
  };
  
  useEffect(() => {
    loadSavedConfigurations();
  }, []);
  
  // Fetch data from Google Sheets
  const fetchSheetData = async (url: string): Promise<SheetData> => {
    try {
      // Validate the URL
      if (!url || !url.includes('docs.google.com/spreadsheets')) {
        throw new Error('Invalid Google Sheets URL');
      }
      
      // Extract the sheet ID from the URL
      const matches = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!matches || matches.length < 2) {
        throw new Error('Could not extract Google Sheet ID from URL');
      }
      
      const sheetId = matches[1];
      
      // Create a public export URL
      const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      
      // Fetch the CSV data
      const response = await fetch(exportUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch sheet data. Make sure the sheet is publicly accessible.');
      }
      
      const text = await response.text();
      
      // Parse CSV
      const rows = parseCSV(text);
      
      if (rows.length === 0) {
        throw new Error('Sheet appears to be empty');
      }
      
      // Extract headers and data
      const headers = rows[0];
      const dataRows = rows.slice(1).map(row => {
        const rowData: Record<string, string> = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });
        return rowData;
      });
      
      // Save the import URL to Supabase
      await saveImportConfiguration({
        name: `Import ${new Date().toLocaleString()}`,
        source_type: 'google_sheet',
        source_url: url,
        column_mappings: {}
      });
      
      return {
        title: `Google Sheet Import`,
        columns: headers,
        rows: dataRows
      };
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch sheet data",
        variant: "destructive"
      });
      return {
        title: '',
        columns: [],
        rows: []
      };
    }
  };
  
  // Save import configuration to Supabase
  const saveImportConfiguration = async (config: Omit<ImportConfiguration, 'id' | 'created_at' | 'updated_at' | 'last_used'>) => {
    try {
      const { data, error } = await supabase
        .from('import_configurations')
        .insert({
          ...config,
          last_used: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      
      // Refresh the list of configurations
      loadSavedConfigurations();
      
      return data?.[0] as ImportConfiguration;
    } catch (error) {
      console.error('Error saving import configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save import configuration.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Load a saved configuration
  const loadConfiguration = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('import_configurations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Update the last_used timestamp
      await supabase
        .from('import_configurations')
        .update({ last_used: new Date().toISOString() })
        .eq('id', id);
      
      return data as ImportConfiguration;
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast({
        title: "Error",
        description: "Failed to load the selected configuration.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Helper function to parse CSV
  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n');
    return lines.map(line => {
      const row: string[] = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === ',' && !inQuotes) {
          row.push(currentValue);
          currentValue = '';
        } else if (char === '"') {
          if (inQuotes && i < line.length - 1 && line[i + 1] === '"') {
            // Double quotes inside a quoted section
            currentValue += '"';
            i++;
          } else {
            // Starting or ending quotes
            inQuotes = !inQuotes;
          }
        } else {
          currentValue += char;
        }
      }
      
      row.push(currentValue); // Add the last value
      return row;
    }).filter(row => row.length > 0 && row.some(cell => cell.trim() !== ''));
  };
  
  return {
    fetchSheetData,
    sheetData,
    setSheetData,
    savedConfigs,
    loadConfiguration,
    saveImportConfiguration,
    isLoadingConfigs
  };
};
