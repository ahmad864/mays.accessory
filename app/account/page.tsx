"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingBag } from "lucide-react"
import { useFavorites } from "@/lib/favorites-store"
import { useProducts } from "@/lib/products-store"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Footer } from "@/components/footer" // ✅ إضافة الفوتر

export default function AccountPage() {
  const searchParams = useSearchParams()

  // ✅ المفضلة هي الافتراضي دائماً
  const defaultTab =
    searchParams.get("tab") === "favorites" ? "favorites" : "favorites"

  const { favorites, getFavoritesCount } = useFavorites()
  const {
    state: { products },
  } = useProducts()

  const favoriteProducts = products.filter((p) => favorites.includes(p.id))

  return (
    <>
      <div className="min-h-screen bg-background py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <Tabs
            defaultValue={defaultTab}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {/* القائمة الجانبية */}
            <TabsList className="md:col-span-1 flex md:flex-col gap-2 h-fit">
              <TabsTrigger value="orders" className="font-tajawal">
                <ShoppingBag className="h-4 w-4 ml-2" />
                الطلبات
              </TabsTrigger>
              <TabsTrigger value="favorites" className="font-tajawal">
                <Heart className="h-4 w-4 ml-2" />
                المفضلة ({getFavoritesCount()})
              </TabsTrigger>
            </TabsList>

            {/* المحتوى */}
            <div className="md:col-span-3">
              {/* الطلبات */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-tajawal">
                      <ShoppingBag className="h-5 w-5" />
                      طلباتي
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-10">
                    <p className="text-muted-foreground font-tajawal">
                      لا توجد طلبات حالياً
                    </p>
                    <Link href="/products">
                      <Button className="mt-4 bg-[#7f5c7e] text-white font-tajawal">
                        تسوق الآن
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* المفضلة */}
              <TabsContent value="favorites">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-tajawal">
                      <Heart className="h-5 w-5" />
                      المنتجات المفضلة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favoriteProducts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {favoriteProducts.map((product) => (
                          <Card key={product.id}>
                            <CardContent className="p-4">
                              <img
                                src={
                                  product.images?.[0] || "/placeholder.svg"
                                }
                                alt={product.name}
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                              <h3 className="text-sm font-semibold font-tajawal line-clamp-2">
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
                      <div className="text-center py-10">
                        <p className="text-muted-foreground font-tajawal">
                          لا توجد منتجات مفضلة
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* ✅ Footer مثل الصفحة الرئيسية */}
      <Footer />
    </>
  )
}
