"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-store";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

const categories = ["أحلق", "خواتم", "أساور", "سلاسل", "نظارات", "ساعات"];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // حماية الصفحة وجلب المنتجات
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchProducts();
      }
    }
  }, [loading, user]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from<Product>("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.log("Fetch error:", error.message);
    setProducts(data || []);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const saveProduct = async () => {
    if (!name || !price) return alert("اكتب اسم وسعر المنتج");

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, image);
      if (uploadError) return alert("فشل رفع الصورة: " + uploadError.message);

      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    if (editId) {
      await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          category,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", editId);
    } else {
      if (!imageUrl) return alert("اختر صورة للمنتج");
      await supabase
        .from("products")
        .insert([{ name, price: Number(price), category, image_url: imageUrl }]);
    }

    resetForm();
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const editProduct = (p: Product) => {
    setEditId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
    setCategory(p.category);
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setCategory(categories[0]);
    setImage(null);
  };

  if (loading) return <p className="p-6">جاري التحقق من صلاحية الوصول...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#7f5c7e]">لوحة تحكم الأدمن</h1>

      {/* نموذج إضافة / تعديل المنتج */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{editId ? "تعديل منتج" : "إضافة منتج"}</h2>

        <input
          className="border border-gray-300 rounded p-2 mb-3 w-full"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border border-gray-300 rounded p-2 mb-3 w-full"
          placeholder="سعر المنتج"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="border border-gray-300 rounded p-2 mb-3 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />

        <div className="flex gap-2">
          <button
            className="bg-[#7f5c7e] text-white px-4 py-2 rounded hover:bg-[#6b4c6a]"
            onClick={saveProduct}
          >
            {editId ? "حفظ التعديل" : "إضافة المنتج"}
          </button>

          {editId && (
            <button
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              onClick={resetForm}
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      {/* عرض المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow-md">
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-gray-700 mb-1">السعر: {p.price} د.ل</p>
            <p className="text-gray-500 mb-2">الفئة: {p.category}</p>

            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => editProduct(p)}
              >
                تعديل
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => deleteProduct(p.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
