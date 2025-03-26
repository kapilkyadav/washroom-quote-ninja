
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types';

const supabaseUrl = 'https://ynyvnlxwjzpsdlrgablh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueXZubHh3anpwc2RscmdhYmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTQyNjksImV4cCI6MjA1ODQ5MDI2OX0.yNjUqNtPRIOX2puttjVjI8HOrmm_52jO_9pTrGGJfYU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
