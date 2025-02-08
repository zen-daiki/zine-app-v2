import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rhqcwwlubzjnlcdsbves.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocWN3d2x1YnpqbmxjZHNidmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NDA2ODcsImV4cCI6MjA0OTIxNjY4N30.k4QK0yWBXSYFkJpsDM6qYScELMjGb9ImIRfZu6g7KsM';

export const supabase = createClient(supabaseUrl, supabaseKey);
