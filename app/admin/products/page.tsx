"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  low_stock: boolean;
  is_featured: boolean; // ⭐ جديد
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
    is_featured: false, // ⭐ جديد
    imageFile: null as File | null,
  });

  const categories = ["خواتم", "أحلاق", "اساور", "سلاسل", "ساعات", "نظارات"];

  // جلب المنتجات
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) alert("خطأ في جلب المنتجات: " + error.message);
    else setProducts(data as Product[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === "checkbox")
      setFormData((prev) => ({ ...prev, [name]: checked }));
    else if (type === "file")
      setFormData((prev) => ({
        ...prev,
        imageFile: files ? files[0] : null,
      }));
    else if (type === "number")
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // رفع الصورة
  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("خطأ في رفع الصورة: " + error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // إضافة / تعديل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    let imageUrl = editingProduct?.image || "";

    if (formData.imageFile) {
      const uploaded = await uploadImage(formData.imageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    if (editingProduct) {
      await supabase.from("products").update({
        name: formData.name,
        price: formData.price,
        category: formData.category,
        low_stock: formData.low_stock,
        is_featured: formData.is_featured, // ⭐
        image: imageUrl,
        updated_at: new Date(),
      }).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert([{
        name: formData.name,
        price: formData.price,
        category: formData.category,
        low_stock: formData.low_stock,
        is_featured: formData.is_featured, // ⭐
        image: imageUrl,
      }]);
    }

    setFormData({
      name: "",
      price: 1,
      category: "",
      low_stock: false,
      is_featured: false,
      imageFile: null,
    });

    setEditingProduct(null);
    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      low_stock: product.low_stock,
      is_featured: product.is_featured, // ⭐
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
        <form onSubmit={handleSubmit} className="border p-4 rounded mb-6 bg-gray-50">
          <input
            type="text"
            name="name"
            placeholder="اسم المنتج"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            required
          >
            <option value="">اختر الفئة</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              name="low_stock"
              checked={formData.low_stock}
              onChange={handleChange}
              className="mr-2"
            />
            الكمية قليلة
          </label>

          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="mr-2"
            />
            منتج مميز ⭐
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="mb-2"
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            {editingProduct ? "تحديث المنتج" : "إضافة المنتج"}
          </button>
        </form>
      )}

      {loading ? (
        <p>جارٍ التحميل...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border p-4 rounded shadow relative">
              {p.is_featured && (
                <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                  ⭐ مميز
                </span>
              )}

              {p.image && (
                <Image src={p.image} alt={p.name} width={200} height={200} />
              )}

              <h2 className="font-bold mt-2">{p.name}</h2>
              <p>السعر: {p.price}</p>
              <p>الفئة: {p.category}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
