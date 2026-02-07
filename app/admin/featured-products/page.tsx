"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image: string
}

export default function FeaturedProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const MAX_FEATURED = 20

  const fetchFeatured = async () => {
    const { data } = await supabase
      .from("products")
      .select("id, name, price, image")
      .eq("is_featured", true)

    setProducts(data || [])
  }

  const fetchAllProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("id, name, price, image")
      .eq("is_featured", false)

    setAllProducts(data || [])
  }

  useEffect(() => {
    fetchFeatured()
    fetchAllProducts()
  }, [])

  const addToFeatured = async (id: string) => {
    if (products.length >= MAX_FEATURED) {
      alert("وصلت للحد الأقصى من المنتجات المميزة")
      return
    }

    await supabase
      .from("products")
      .update({ is_featured: true })
      .eq("id", id)

    fetchFeatured()
    fetchAllProducts()
  }

  const removeFromFeatured = async (id: string) => {
    await supabase
      .from("products")
      .update({ is_featured: false })
      .eq("id", id)

    fetchFeatured()
    fetchAllProducts()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        المنتجات المميزة ({products.length}/{MAX_FEATURED})
      </h1>

      {/* المنتجات المميزة */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {products.map(p => (
          <div key={p.id} className="border p-3 rounded">
            {p.image && (
              <Image src={p.image} alt={p.name} width={150} height={150} />
            )}
            <h2 className="font-bold">{p.name}</h2>
            <p>{p.price}</p>
            <button
              onClick={() => removeFromFeatured(p.id)}
              className="bg-red-600 text-white px-3 py-1 rounded mt-2 w-full"
            >
              إزالة من المميز
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-2">إضافة منتج للمميز</h2>

      {/* كل المنتجات */}
      <div className="grid md:grid-cols-4 gap-4">
        {allProducts.map(p => (
          <div key={p.id} className="border p-3 rounded">
            <h2 className="font-bold">{p.name}</h2>
            <button
              onClick={() => addToFeatured(p.id)}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2 w-full"
            >
              إضافة للمميز
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
