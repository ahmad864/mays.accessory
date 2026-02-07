import { supabase } from "@/lib/supabase"

/**
 * جلب عدد المنتجات حسب الفئة من Supabase
 */
export async function getCategoryCount(category: string): Promise<number> {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category", category)

  if (error) {
    console.error("Count error:", error.message)
    return 0
  }

  return count ?? 0
}
