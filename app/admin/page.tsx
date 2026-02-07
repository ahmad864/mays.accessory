"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-store"; // استدعاء الهُوك

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // نستخدم loading
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // حماية الصفحة + جلب المنتجات
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login"); // إعادة التوجيه إذا لم يكن أدمن
      } else {
        getProducts();
      }
    }
  }, [loading, user]);

  // جلب المنتجات
  const getProducts = async () => {
    const { data } = await supabase
      .from<Product>("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  };

  // رفع الصورة من الملف
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // إضافة / تعديل منتج
  const saveProduct = async () => {
    if (!name || !price) {
      alert("اكتب اسم وسعر المنتج");
      return;
    }

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      await supabase.storage.from("products").upload(fileName, image);
      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    if (editId) {
      // تعديل
      await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", editId);
    } else {
      // إضافة
      if (!imageUrl) {
        alert("اختر صورة للمنتج");
        return;
      }

      await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          image_url: imageUrl,
        },
      ]);
    }

    resetForm();
    getProducts();
  };

  // حذف منتج
  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    getProducts();
  };

  // تعبئة الفورم لتعديل المنتج
  const editProduct = (p: Product) => {
    setEditId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setImage(null);
  };

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

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3"
        />

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
            <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-gray-700 mb-2">{p.price} د.ل</p>

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
