/**
 * ✅ Configures the Supabase connection.
 *
 * This module initializes a Supabase client using the URL and anonymous key
 * provided in the environment variables. It ensures that the required
 * environment variables are set and throws an error if they are missing.
 *
 * @throws {Error} Throws an error if the Supabase URL or ANON KEY is not set
 * in the `.env` file.
 */
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL vai ANON KEY nav iestatīts .env failā");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
