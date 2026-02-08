"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useCurrency } from "@/lib/currency-store"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductsByCategory } from "@/lib/products-db"

const categoryNames: { [key: string]: string } = {
  rings: "خواتم",
  earrings: "أحلاق",
  bracelets: "اساور",
  necklaces: "سلاسل",
  watches: "ساعات",
  glasses: "نظارات",
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()

  useEffect(() => {
    if (!slug) return

    const fetchProducts = async () => {
      setLoading(true)
      const data = await getProductsByCategory(slug)
      setProducts(data)
      setLoading(false)
    }

    fetchProducts()
  }, [slug])

  const updateQuantity = (productId: number, change: number, stock: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1
      const next = current + change
      return {
        ...prev,
        [productId]: Math.min(Math.max(1, next), stock),
      }
    })
  }

  const addToCart = (product: any) => {
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Link href="/">الرئيسية</Link>
            <ArrowRight className="h-4 w-4" />
            <span>{categoryNames[slug] || slug}</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#7f5c7e]">
              {categoryNames[slug] || slug}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {products.length} منتج متوفر
            </p>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.is_new && (
                      <Badge className="absolute top-2 left-2 bg-[#7f5c7e] text-white text-xs">
                        جديد
                      </Badge>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {product.name}
                    </h3>

                    {/* السعر + المتوفر */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#7f5c7e] font-bold text-base">
                        {convertPrice(product.price)} {getCurrencySymbol()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        متوفر : {product.stock}
                      </span>
                    </div>

                    {/* التحكم بالكمية */}
                    {product.stock > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(product.id, -1, product.stock)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="text-sm min-w-[20px] text-center">
                          {quantities[product.id] || 1}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(product.id, 1, product.stock)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <Button
                      className="w-full h-9 text-sm"
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
      </main>

      <Footer />
    </div>
  )
}
