"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useCart } from "@/lib/cart-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingBag, Star, Plus, Minus } from "lucide-react"

export default function ProductPage() {
  const { id } = useParams()
  const { dispatch } = useCart()

  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (!error) setProduct(data)
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  if (loading) return <p className="p-6">جاري التحميل...</p>
  if (!product) return <p className="p-6">المنتج غير موجود</p>

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* الصورة */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* المعلومات */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>

              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">منتج موثوق</span>
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                {product.price} ر.س
              </div>
            </div>

            <Separator />

            {/* الكمية */}
            <div className="flex items-center gap-4">
              <span className="font-medium">الكمية:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-12 text-center font-medium">
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-sm text-muted-foreground">
                المتوفر: {product.stock}
              </span>
            </div>

            {/* أزرار */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
                onClick={() =>
                  dispatch({
                    type: "ADD_ITEM",
                    payload: {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image_url,
                      quantity: quantity, // ⭐ المهم
                    },
                  })
                }
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.stock === 0 ? "نفدت الكمية" : "أضف للسلة"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
