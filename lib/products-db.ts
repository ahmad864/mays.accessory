import { supabase } from "@/lib/supabase"

export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)

  if (error) {
    console.error("Supabase error:", error.message)
    return []
  }

  return data || []
}
