"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  low_stock: boolean;
  is_featured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);

  // 🔁 وضع الصفحة
  const [mode, setMode] = useState<"category" | "featured">("category");

  const [formData, setFormData] = useState({
    name: "",
    price: 1,
    category: "",
    low_stock: false,
    imageFile: null as File | null,
  });

  const categories = ["خواتم", "أحلاق", "اساور", "سلاسل", "ساعات", "نظارات"];

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name");
    setProducts((data as Product[]) ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
    } else if (type === "file") {
      setFormData((p) => ({ ...p, imageFile: files?.[0] ?? null }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    await supabase.storage.from("product-images").upload(fileName, file, {
      upsert: true,
    });

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageFile) return;

    const imageUrl = await uploadImage(formData.imageFile);

    await supabase.from("products").insert({
      name: formData.name,
      price: formData.price,
      category: mode === "category" ? formData.category : "مميز",
      low_stock: mode === "category" ? formData.low_stock : false,
      is_featured: mode === "featured",
      image_url: imageUrl,
    });

    setShowForm(false);
    setFormData({
      name: "",
      price: 1,
      category: "",
      low_stock: false,
      imageFile: null,
    });

    fetchProducts();
  };

  // ✅ الفلترة الصحيحة حسب الوضع
  const filteredProducts = products.filter((p) =>
    mode === "category" ? !p.is_featured : p.is_featured
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لوحة تحكم الأدمن</h1>

      {/* الأزرار */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setMode("category");
            setShowForm(true);
          }}
          className={`px-4 py-2 rounded border ${
            mode === "category" ? "bg-purple-600 text-white" : "bg-white"
          }`}
        >
          إضافة منتج فئة
        </button>

        <button
          onClick={() => {
            setMode("featured");
            setShowForm(true);
          }}
          className={`px-4 py-2 rounded border ${
            mode === "featured" ? "bg-purple-600 text-white" : "bg-white"
          }`}
        >
          إضافة منتج مميز
        </button>
      </div>

      {/* الفورم */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded mb-6 space-y-3"
        >
          <h2 className="font-bold text-lg">
            {mode === "category"
              ? "إضافة منتج فئة"
              : "إضافة منتج مميز"}
          </h2>

          <input
            name="name"
            placeholder="اسم المنتج"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          {mode === "category" && (
            <>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="">اختر الفئة</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="low_stock"
                  checked={formData.low_stock}
                  onChange={handleChange}
                />
                منتج جديد
              </label>
            </>
          )}

          <input type="file" onChange={handleChange} />

          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            إضافة المنتج
          </button>
        </form>
      )}

      {/* عرض المنتجات */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            {p.is_featured && <span>⭐ مميز</span>}
            <Image src={p.image_url} alt={p.name} width={200} height={200} />
            <p className="font-bold mt-2">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
