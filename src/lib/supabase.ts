import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_PROJECT_URL as string;
const supabaseKey = import.meta.env.VITE_PUBLISHABLE as string;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };