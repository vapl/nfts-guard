import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// ✅ Konfigurē Supabase savienojumu
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL vai ANON KEY nav iestatīts .env failā");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
