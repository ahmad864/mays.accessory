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

// ✅ الاستيراد الصحيح
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

  // ✅ كميات المنتجات
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()

  // ✅ جلب المنتجات
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

  // ✅ تغيير الكمية
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

  // ✅ إضافة للسلة بالكمية
  const addToCart = (product: any) => {
    if (product.stock <= 0) return

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

      <main className="py-16 lg:py-24">
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

          {loading && (
            <div className="text-center py-16 text-muted-foreground">
              جاري تحميل المنتجات...
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              لا توجد منتجات في هذه الفئة
            </div>
          )}

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
                      <Badge className="absolute top-2 left-2 bg-[#7f5c7e] text-white">
                        جديد
                      </Badge>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-semibold">{product.name}</h3>

                    <p className="text-[#7f5c7e] font-bold">
                      {convertPrice(product.price)} {getCurrencySymbol()}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      متوفر: {product.stock}
                    </p>

                    {/* ✅ التحكم بالكمية */}
                    {product.stock > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, -1, product.stock)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="min-w-[20px] text-center">
                          {quantities[product.id] || 1}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, 1, product.stock)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

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
      </main>

      <Footer />
    </div>
  )
}
