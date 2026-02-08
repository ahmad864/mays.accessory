"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShoppingBag, Star, Search, Filter } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useProducts } from "@/lib/products-store"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

/* ✅ نفس فئات الصفحة الرئيسية */
const OFFICIAL_CATEGORIES = [
  "خواتم",
  "أحلاق",
  "اساور",
  "سلاسل",
  "ساعات",
  "نظارات",
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const { dispatch: cartDispatch } = useCart()
  const {
    state: { products },
  } = useProducts()

  const searchParams = useSearchParams()

  useEffect(() => {
    const searchQuery = searchParams.get("search")
    if (searchQuery) {
      setSearchTerm(searchQuery)
    }
  }, [searchParams])

  /* ✅ البحث مرتبط فقط بفئات الصفحة الرئيسية (بدون المنتجات المميزة) */
  const filteredProducts = products
    .filter((product) => product.isSale !== true) // ⭐ هذا هو السطر المهم
    .filter((product) => {
      const search = searchTerm.trim()

      // 🔍 هل البحث باسم فئة؟
      const isCategorySearch = OFFICIAL_CATEGORIES.includes(search)

      if (isCategorySearch) {
        return product.category === search
      }

      const matchesText =
        product.name.includes(search) ||
        product.category.includes(search)

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory

      return matchesText && matchesCategory
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
          <h1 className="text-3xl font-bold mb-3 text-[#7f5c7e]">
            جميع المنتجات
          </h1>
          <p className="text-muted-foreground">
            تصفحي جميع منتجات متجر MISS
          </p>
        </div>

        {/* الفلاتر */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحثي (مثال: اساور، خواتم...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {OFFICIAL_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="price-low">السعر: الأقل</SelectItem>
              <SelectItem value="price-high">السعر: الأعلى</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* المنتجات */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
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

                  <h3 className="font-semibold mb-1">{product.name}</h3>

                  <div className="flex items-center gap-1 mb-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {product.rating}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#7f5c7e]">
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
            لا توجد منتجات مطابقة لبحثك
          </div>
        )}
      </div>
    </div>
  )
}
