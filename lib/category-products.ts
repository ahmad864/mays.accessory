import { supabase } from "@/lib/supabase"

export interface Product {
  id: number
  name: string
  price: number
  image: string
  stock: number
  isNew: boolean
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
    .select("id, name, price, image_url, stock, is_new, category")
    .eq("category", category)

  if (error) {
    console.error("getProductsByCategory error:", error.message)
    return []
  }

  return (
    data?.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image_url,
      stock: p.stock,
      isNew: p.is_new,
      category: p.category,
    })) || []
  )
}

/* ===============================
   عدد المنتجات في فئة
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
