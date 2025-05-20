import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://wcwwdzlszowkdnaokntv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3dkemxzem93a2RuYW9rbnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NDg3MjksImV4cCI6MjA2MzAyNDcyOX0.uuyJmU7ElqPTZLhJGJ8SW-kuo59RzBVEAH7GMhn-MLs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
