import { supabase } from "@/lib/supabase"

export interface Product {
  id: number
  name: string
  price: number
  image_url: string
  stock: number
  is_new: boolean
  category: string
}

/* ===============================
   جلب منتجات فئة معينة من Supabase
================================ */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)

  if (error) {
    console.error("getProductsByCategory error:", error.message)
    return []
  }

  return data || []
}

/* ===============================
   عدد المنتجات في فئة (الحل النهائي)
================================ */
export async function getProductCountByCategory(
  category: string
): Promise<number> {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category", category)

  if (error) {
    console.error("getProductCountByCategory error:", error.message)
    return 0
  }

  return count ?? 0
}
