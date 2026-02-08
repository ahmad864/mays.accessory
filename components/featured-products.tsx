"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, AlertTriangle, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useCurrency } from "@/lib/currency-store"
import { useFavorites } from "@/lib/favorites-store"
import { useProducts } from "@/lib/products-store"
import Link from "next/link"

export function FeaturedProducts() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()
  const {
    state: { products },
  } = useProducts()

  const updateQuantity = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }))
  }

  const addToCart = (product: (typeof products)[0]) => {
    if (product.stock <= 0) return

    const quantity = quantities[product.id] || 1
    for (let i = 0; i < quantity; i++) {
      cartDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
        },
      })
    }
    cartDispatch({ type: "TOGGLE_CART" })
  }

  return (
    <section className="py-14 bg-gradient-to-br from-purple-50/30 to-purple-100/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-[#7f5c7e]">
            منتجاتنا المميزة
          </h2>
          <p className="text-muted-foreground">
            مختارة خصيصاً لك
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products
            .filter((product) => product.isSale === true) // ⭐ مميزة فقط
            .map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <Badge className="bg-[#7f5c7e] text-white text-xs">
                          جديد
                        </Badge>
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          قليل
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 h-7 w-7 rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(product.id)
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite(product.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>

                  <div className="p-3">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-sm font-semibold mb-1 line-clamp-2 hover:text-[#7f5c7e]">
                        {product.name}
                      </h3>
                    </Link>

                    <span className="text-base font-bold text-[#7f5c7e]">
                      {convertPrice(product.price)} {getCurrencySymbol()}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={quantities[product.id] <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs">
                          {quantities[product.id] || 1}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        className="h-8 px-3 bg-[#7f5c7e] text-white"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
