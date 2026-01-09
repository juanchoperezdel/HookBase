
import { createClient } from '@supabase/supabase-js';

// In a real production environment, these values would come from environment variables.
// The library is now imported from the esm.sh link in index.html.
const supabaseUrl = 'https://znumctnmiuswxvaoznfw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudW1jdG5taXVzd3h2YW96bmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTQ0NTYsImV4cCI6MjA2NjYzMDQ1Nn0.ylBl6M0a06ollU5yQ38epYPfHa1NPCsinI8FPGOtuGg';

export const supabase = createClient(supabaseUrl, supabaseKey);
