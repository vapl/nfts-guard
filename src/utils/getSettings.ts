// lib/utils/getSetting.ts

import { supabase } from "@/lib/supabase/supabase";

export const getSettings = async <T = string>(
  key: string
): Promise<T | null> => {
  const { data, error } = await supabase
    .from("settings")
    .select("value, type")
    .eq("key", key)
    .maybeSingle();

  if (error || !data) {
    console.warn(`⚠️ Setting "${key}" not found.`);
    return null;
  }

  const { value, type } = data;

  switch (type) {
    case "int": {
      const parsed = Number(value);
      return (isNaN(parsed) ? null : parsed) as T;
    }
    case "boolean":
      return (value.toLowerCase?.() === "true") as T;
    case "string":
      return value as T;
    default:
      console.warn(`⚠️ Unknown type "${type}" for setting "${key}"`);
      return value as T;
  }
};
