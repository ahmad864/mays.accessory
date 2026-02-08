"use client";

import { useEffect, useState } from "react";
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

  const [formData, setFormData] = useState({
    name: "",
    price: 1,
    category: "",
    low_stock: false,
    is_featured: false,
  });

  const categories = ["خواتم", "أحلاق", "اساور", "سلاسل", "ساعات", "نظارات"];

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("name");
    setProducts((data as Product[]) ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.from("products").insert({
      name: formData.name,
      price: formData.price,
      category: formData.category,
      low_stock: formData.low_stock,
      is_featured: formData.is_featured,
      image_url: "",
    });

    setShowForm(false);
    setFormData({
      name: "",
      price: 1,
      category: "",
      low_stock: false,
      is_featured: false,
    });

    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لوحة تحكم الأدمن</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "إلغاء" : "إضافة منتج"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded space-y-3">
          <input
            name="name"
            placeholder="اسم المنتج"
            className="border p-2 w-full"
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            className="border p-2 w-full"
            onChange={handleChange}
          />

          <select
            name="category"
            className="border p-2 w-full"
            onChange={handleChange}
          >
            <option value="">اختر الفئة</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* 🆕 منتج جديد */}
          <label className="flex items-center gap-2">
            <input type="checkbox" name="low_stock" onChange={handleChange} />
            🆕 منتج جديد
          </label>

          {/* ⭐ منتج مميز */}
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" onChange={handleChange} />
            ⭐ منتج مميز
          </label>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            حفظ
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded relative">
            {p.is_featured && (
              <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                ⭐ مميز
              </span>
            )}

            {p.low_stock && (
              <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                🆕 جديد
              </span>
            )}

            <Image
              src={p.image_url || "/placeholder.png"}
              alt={p.name}
              width={200}
              height={200}
            />

            <h2 className="font-bold mt-2">{p.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
