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
}

const categories = ["أحلاق", "خواتم", "اساور", "سلاسل", "نظارات", "ساعات"]

// 🔑 تحويل العربي → إنجليزي (للسيرفر فقط)
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

  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [image, setImage] = useState<File | null>(null)
  const [stock, setStock] = useState(1)
  const [isNew, setIsNew] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // 🔐 حماية الصفحة
  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login")
      else fetchProducts()
    }
  }, [loading, user])

  // 📦 جلب المنتجات
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("Fetch error:", error.message)
      return
    }

    setProducts(data || [])
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0])
  }

  // 💾 حفظ / تعديل منتج
  const saveProduct = async () => {
    if (!name || !price) {
      alert("اكتب اسم وسعر المنتج")
      return
    }

    let imageUrl: string | null = null

    if (image) {
      const fileName = `${Date.now()}-${image.name}`

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, image, { upsert: true })

      if (uploadError) {
        alert("فشل رفع الصورة: " + uploadError.message)
        return
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const finalCategory = categoryMap[category] ?? category // ⭐ الحل هنا

    if (editId) {
      const { error } = await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          category: finalCategory,
          stock,
          is_new: isNew,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", editId)

      if (error) {
        alert("فشل تعديل المنتج: " + error.message)
        return
      }
    } else {
      if (!imageUrl) {
        alert("اختر صورة للمنتج")
        return
      }

      const { error } = await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          category: finalCategory,
          stock,
          is_new: isNew,
          image_url: imageUrl,
        },
      ])

      if (error) {
        alert("فشل إضافة المنتج: " + error.message)
        return
      }
    }

    resetForm()
    fetchProducts()
  }

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) alert("فشل حذف المنتج: " + error.message)
    else fetchProducts()
  }

  const editProduct = (p: Product) => {
    setEditId(p.id)
    setName(p.name)
    setPrice(p.price.toString())
    setCategory(
      Object.keys(categoryMap).find((k) => categoryMap[k] === p.category) ??
        p.category
    )
    setStock(p.stock)
    setIsNew(p.is_new)
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
      <h1 className="text-3xl font-bold mb-6 text-[#7f5c7e]">
        لوحة تحكم الأدمن
      </h1>

      {/* إضافة / تعديل */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "تعديل منتج" : "إضافة منتج"}
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
          placeholder="الكمية"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          منتج جديد
        </label>

        <input type="file" onChange={handleFileChange} className="mb-3" />

        <button
          onClick={saveProduct}
          className="bg-[#7f5c7e] text-white px-4 py-2 rounded"
        >
          {editId ? "حفظ التعديل" : "إضافة المنتج"}
        </button>
      </div>

      {/* المنتجات */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <img
              src={p.image_url}
              className="w-full h-48 object-cover mb-2"
            />
            <h3 className="font-semibold">{p.name}</h3>
            <p>السعر: {p.price}</p>
            <p>الفئة: {p.category}</p>
            <p>المتوفر: {p.stock}</p>
            {p.is_new && <span className="text-green-600">جديد</span>}

            <div className="flex gap-2 mt-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => editProduct(p)}
              >
                تعديل
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteProduct(p.id)}
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
