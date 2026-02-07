"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, AlertTriangle } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useCurrency } from "@/lib/currency-store"
import { useFavorites } from "@/lib/favorites-store"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  stock: number
  is_new: boolean
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()

  // ✅ جلب المنتجات المميزة فقط من Supabase
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, stock, is_new")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Featured products error:", error.message)
        setProducts([])
      } else {
        setProducts(data || [])
      }

      setLoading(false)
    }

    fetchFeaturedProducts()
  }, [])

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return

    cartDispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
      },
    })

    cartDispatch({ type: "TOGGLE_CART" })
  }

  // ⏳ تحميل
  if (loading) {
    return (
      <section className="py-16 text-center text-muted-foreground">
        جاري تحميل المنتجات المميزة...
      </section>
    )
  }

  // ❌ لا نعرض القسم إذا لا توجد منتجات مميزة
  if (products.length === 0) return null

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50/30 to-purple-100/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#7f5c7e]">
            منتجاتنا المميزة
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اكتشفي أحدث وأجمل قطع الإكسسوارات المختارة خصيصاً لك
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_new && (
                      <Badge className="bg-[#7f5c7e] text-white text-xs">
                        جديد
                      </Badge>
                    )}

                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <AlertTriangle className="w-2 h-2 mr-1" />
                        قليل
                      </Badge>
                    )}

                    {product.stock === 0 && (
                      <Badge variant="destructive" className="text-xs">
                        نفد
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>

                <div className="p-3">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold mb-2 hover:text-[#7f5c7e]">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="font-bold text-[#7f5c7e] mb-2">
                    {convertPrice(product.price)} {getCurrencySymbol()}
                  </p>

                  <Button
                    className="w-full"
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {product.stock <= 0 ? "نفدت الكمية" : "أضف للسلة"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
