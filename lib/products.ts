import { supabase } from "@/lib/supabase"

export async function getProductsByCategory(category: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)

  return data || []
}
