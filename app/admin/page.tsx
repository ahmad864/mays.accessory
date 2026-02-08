"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-store"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image_url: string
  stock: number
  is_new: boolean
  is_featured?: boolean
}

const categories = ["أحلاق", "خواتم", "اساور", "سلاسل", "نظارات", "ساعات"]

const categoryMap: { [key: string]: string } = {
  "أحلاق": "earrings",
  "خواتم": "rings",
  "اساور": "bracelets",
  "سلاسل": "necklaces",
  "نظارات": "glasses",
  "ساعات": "watches",
}

export default function AdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [mode, setMode] = useState<"category" | "featured">("category")
  const [products, setProducts] = useState<Product[]>([])

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [image, setImage] = useState<File | null>(null)
  const [stock, setStock] = useState(1)
  const [isNew, setIsNew] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login")
      else fetchProducts()
    }
  }, [loading, user])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    setProducts(data || [])
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0])
  }

  const saveProduct = async () => {
    if (!name || !price) {
      alert("اكتب اسم وسعر المنتج")
      return
    }

    let imageUrl: string | null = null

    if (image) {
      const fileName = `${Date.now()}-${image.name}`

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, image, { upsert: true })

      if (error) {
        alert("فشل رفع الصورة")
        return
      }

      const { data } = supabase.storage.from("products").getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    if (!imageUrl) {
      alert("اختر صورة")
      return
    }

    const payload =
      mode === "category"
        ? {
            name,
            price: Number(price),
            category: categoryMap[category],
            stock,
            is_new: isNew,
            image_url: imageUrl,
            is_featured: false,
          }
        : {
            name,
            price: Number(price),
            category: "featured",
            stock: 0,
            is_new: false,
            image_url: imageUrl,
            is_featured: true,
          }

    if (editId) {
      await supabase.from("products").update(payload).eq("id", editId)
    } else {
      await supabase.from("products").insert([payload])
    }

    resetForm()
    fetchProducts()
  }

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id)
    fetchProducts()
  }

  const editProduct = (p: Product) => {
    setEditId(p.id)
    setName(p.name)
    setPrice(p.price.toString())
    setImage(null)

    if (p.is_featured) {
      setMode("featured")
    } else {
      setMode("category")
      setCategory(
        Object.keys(categoryMap).find(
          (k) => categoryMap[k] === p.category
        ) || categories[0]
      )
      setStock(p.stock)
      setIsNew(p.is_new)
    }
  }

  const resetForm = () => {
    setEditId(null)
    setName("")
    setPrice("")
    setCategory(categories[0])
    setStock(1)
    setIsNew(false)
    setImage(null)
  }

  if (loading) return <p className="p-6">جاري التحقق من الصلاحية...</p>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-[#7f5c7e]">
        لوحة تحكم الأدمن
      </h1>

      {/* التبديل */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => {
            setMode("category")
            resetForm()
          }}
          className={mode === "category" ? "font-bold underline" : ""}
        >
          إضافة منتج فئة
        </button>

        <button
          onClick={() => {
            setMode("featured")
            resetForm()
          }}
          className={mode === "featured" ? "font-bold underline" : ""}
        >
          إضافة منتج مميز
        </button>
      </div>

      {/* النموذج */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "تعديل المنتج" : "إضافة منتج"}
        </h2>

        <input
          className="border p-2 mb-3 w-full"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 mb-3 w-full"
          placeholder="سعر المنتج"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {mode === "category" && (
          <>
            <select
              className="border p-2 mb-3 w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              className="border p-2 mb-3 w-full"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />

            <label className="flex gap-2 mb-3">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
              />
              منتج جديد
            </label>
          </>
        )}

        <input type="file" onChange={handleFileChange} className="mb-3" />

        <button
          onClick={saveProduct}
          className="bg-[#7f5c7e] text-white px-4 py-2 rounded"
        >
          {editId ? "حفظ التعديل" : "إضافة المنتج"}
        </button>
      </div>

      {/* عرض المنتجات */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow relative">
            {p.is_featured && (
              <span className="absolute top-2 left-2 text-xs bg-yellow-400 px-2 py-1 rounded">
                ⭐ مميز
              </span>
            )}

            <img src={p.image_url} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-semibold">{p.name}</h3>
            <p>السعر: {p.price}</p>
            {!p.is_featured && <p>الفئة: {p.category}</p>}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => editProduct(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                تعديل
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
