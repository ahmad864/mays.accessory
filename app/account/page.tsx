"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Heart, ShoppingBag, Settings } from "lucide-react"
import { useFavorites } from "@/lib/favorites-store"
import { useProducts } from "@/lib/products-store"
import Link from "next/link"

export default function AccountPage() {
  const [searchParams] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search)
    }
    return new URLSearchParams()
  })

  // ✅ لا تسجيل دخول – المفضلة والطلبات محلية
  const { favorites, getFavoritesCount } = useFavorites()
  const {
    state: { products },
  } = useProducts()

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  )

  const requestedTab = searchParams.get("tab")
  const showFavoritesDirectly = requestedTab === "favorites"

  /* =======================
     صفحة المفضلة مباشرة
  ======================== */
  if (showFavoritesDirectly) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#7f5c7e] mb-2 font-tajawal">
              المفضلة والطلبات
            </h1>
            <p className="text-muted-foreground font-tajawal">
              منتجاتك المفضلة وطلباتك في مكان واحد
            </p>
          </div>

          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="favorites" className="font-tajawal">
                ❤️ المفضلة ({getFavoritesCount()})
              </TabsTrigger>
              <TabsTrigger value="orders" className="font-tajawal">
                📦 طلباتي
              </TabsTrigger>
            </TabsList>

            {/* المفضلة */}
            <TabsContent value="favorites">
              <Card>
                <CardContent className="py-10">
                  {favoriteProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteProducts.map((product) => (
                        <Card key={product.id}>
                          <CardContent className="p-4">
                            <img
                              src={product.images?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-semibold text-sm mb-2 font-tajawal line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-[#7f5c7e] font-bold font-tajawal">
                              {product.price} ر.س
                            </p>
                            <Link href={`/product/${product.id}`}>
                              <Button
                                size="sm"
                                className="w-full mt-2 bg-[#7f5c7e] font-tajawal"
                              >
                                عرض المنتج
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Heart className="mx-auto h-16 w-16 text-[#7f5c7e] mb-4" />
                      <p className="text-lg font-tajawal">
                        لا توجد منتجات مفضلة
                      </p>
                      <p className="text-muted-foreground font-tajawal mt-1">
                        ابدئي بتصفح المنتجات وأضيفي ما يعجبك
                      </p>
                      <Link href="/products">
                        <Button className="mt-6 bg-[#7f5c7e] font-tajawal">
                          ابدأ التسوق
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* الطلبات */}
            <TabsContent value="orders">
              <Card>
                <CardContent className="py-10 text-center">
                  <ShoppingBag className="mx-auto h-16 w-16 text-[#7f5c7e] mb-4" />
                  <p className="text-lg font-tajawal">لا توجد طلبات بعد</p>
                  <Link href="/products">
                    <Button className="mt-6 bg-[#7f5c7e] font-tajawal">
                      تسوق الآن
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  /* =======================
     صفحة الحساب (عادية)
  ======================== */
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7f5c7e] mb-2 font-tajawal">
            حسابي
          </h1>
          <p className="text-muted-foreground font-tajawal">
            إدارة معلوماتك وطلباتك
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="font-tajawal">
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="orders" className="font-tajawal">
              طلباتي
            </TabsTrigger>
            <TabsTrigger value="favorites" className="font-tajawal">
              المفضلة ({getFavoritesCount()})
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-tajawal">
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-tajawal">
                  <User className="h-5 w-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label className="font-tajawal">الاسم</Label>
                <Input className="font-tajawal" />
                <Button className="bg-[#7f5c7e] font-tajawal">
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-tajawal">
                  <Settings className="h-5 w-5" />
                  الإعدادات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-tajawal">
                  لا توجد إعدادات حالياً
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
