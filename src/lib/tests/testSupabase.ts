import { supabase } from "../supabase/supabase";

async function testSupabase() {
  const { data, error } = await supabase
    .from("nft_collections")
    .select("*")
    .limit(5);

  if (error) console.error("❌ Supabase kļūda:", error);
  else console.log("✅ Kolekcijas dati:", data);
}

testSupabase();
