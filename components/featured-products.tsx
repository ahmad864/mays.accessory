"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true)

      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      setProducts(data || [])
      setLoading(false)
    }

    fetchFeatured()
  }, [limit])

  if (loading) return null
  if (products.length === 0) return null

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        منتجاتنا المميزة
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-3">
              <img
                src={p.image_url || "/placeholder.svg"}
                alt={p.name}
                className="w-full h-40 object-cover"
              />
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="font-bold">{p.price}</p>

              <Link href={`/product/${p.id}`}>
                <Button className="w-full mt-2">عرض المنتج</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length >= limit && (
        <div className="text-center mt-8">
          <Button onClick={() => setLimit(limit + 10)}>
            عرض منتجات أكثر
          </Button>
        </div>
      )}
    </section>
  )
}
