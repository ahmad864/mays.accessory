"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Star, Search, Filter, AlertTriangle } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useProducts } from "@/lib/products-store"
import { useFavorites } from "@/lib/favorites-store"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const { dispatch: cartDispatch } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  const {
    state: { products },
  } = useProducts()

  /* ✅ الفئات تُستخرج من المنتجات الفعلية فقط */
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  )

  const searchParams = useSearchParams()

  useEffect(() => {
    const searchQuery = searchParams.get("search")
    if (searchQuery) {
      setSearchTerm(searchQuery)
    }
  }, [searchParams])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name, "ar")
      }
    })

  const addToCart = (product: (typeof products)[0]) => {
    if (product.stock <= 0) return

    cartDispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
      },
    })

    cartDispatch({ type: "TOGGLE_CART" })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-[#7f5c7e]">
            جميع المنتجات
          </h1>
          <p className="text-lg text-muted-foreground">
            اكتشفي مجموعتنا الكاملة من الإكسسوارات
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="ابحث عن منتج أو فئة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="price-low">السعر: الأقل أولاً</SelectItem>
              <SelectItem value="price-high">السعر: الأعلى أولاً</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                </Link>

                <div className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {product.category}
                  </Badge>

                  <h3 className="font-semibold mb-2">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">
                      المتوفر: {product.stock}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#7f5c7e]">
                      {product.price} ر.س
                    </span>

                    <Button
                      size="sm"
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      أضف للسلة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد منتجات مطابقة
          </div>
        )}
      </div>
    </div>
  )
}
