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
  low_stock: boolean;   // منتج جديد
  is_featured: boolean; // منتج مميز
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 1,
    category: "",
    low_stock: false,
    is_featured: false,
    imageFile: null as File | null,
  });

  const categories = ["خواتم", "أحلاق", "اساور", "سلاسل", "ساعات", "نظارات"];

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("name");
    setProducts((data as Product[]) ?? []);
    setLoading(false);
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

    let imageUrl = editingProduct?.image_url || "";

    if (formData.imageFile) {
      imageUrl = await uploadImage(formData.imageFile);
    }

    const payload = {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      low_stock: formData.low_stock,
      is_featured: formData.is_featured,
      image_url: imageUrl,
    };

    if (editingProduct) {
      await supabase.from("products").update(payload).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert(payload);
    }

    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 1,
      category: "",
      low_stock: false,
      is_featured: false,
      imageFile: null,
    });

    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: p.price,
      category: p.category,
      low_stock: p.low_stock,
      is_featured: p.is_featured,
      imageFile: null,
    });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة المنتجات</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "إلغاء" : "إضافة منتج"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded mb-6 space-y-2">
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

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">اختر الفئة</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* منتج جديد */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="low_stock"
              checked={formData.low_stock}
              onChange={handleChange}
            />
            منتج جديد 🆕
          </label>

          {/* منتج مميز */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            منتج مميز ⭐
          </label>

          <input type="file" onChange={handleChange} />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            حفظ
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
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

            <Image src={p.image_url} alt={p.name} width={200} height={200} />
            <h2 className="font-bold mt-2">{p.name}</h2>

            <button
              onClick={() => handleEdit(p)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mt-2"
            >
              تعديل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
