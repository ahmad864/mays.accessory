"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useCurrency } from "@/lib/currency-store"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  stock: number
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true)

      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url, stock")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      setProducts(data || [])
      setLoading(false)
    }

    fetchFeatured()
  }, [limit])

  const updateQuantity = (id: number, change: number, stock: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1
      const next = current + change
      return {
        ...prev,
        [id]: Math.min(Math.max(1, next), stock),
      }
    })
  }

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1

    for (let i = 0; i < quantity; i++) {
      cartDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
        },
      })
    }

    cartDispatch({ type: "TOGGLE_CART" })
  }

  if (loading || products.length === 0) return null

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#7f5c7e]">
        منتجاتنا المميزة
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-0">
              <img
                src={p.image_url || "/placeholder.svg"}
                alt={p.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-3 space-y-2">
                {/* اسم المنتج */}
                <h3 className="text-sm font-semibold line-clamp-2">
                  {p.name}
                </h3>

                {/* السعر + المتوفر */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#7f5c7e]">
                    {convertPrice(p.price)} {getCurrencySymbol()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    متوفر : {p.stock}
                  </span>
                </div>

                {/* التحكم بالكمية */}
                {p.stock > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        updateQuantity(p.id, -1, p.stock)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="text-sm min-w-[20px] text-center">
                      {quantities[p.id] || 1}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        updateQuantity(p.id, 1, p.stock)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* زر الإضافة */}
                <Button
                  className="w-full h-9 bg-[#7f5c7e] hover:bg-purple-600"
                  disabled={p.stock <= 0}
                  onClick={() => addToCart(p)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {p.stock <= 0 ? "نفدت الكمية" : "أضف للسلة"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length >= limit && (
        <div className="text-center mt-8">
          <Button onClick={() => setLimit((prev) => prev + 10)}>
            عرض منتجات أكثر
          </Button>
        </div>
      )}
    </section>
  )
}
