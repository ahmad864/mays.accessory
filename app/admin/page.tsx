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
  stock: number;
  is_new: boolean;
}

/* 👇 الفئات للعرض (عربي) */
const categories = ["أحلاق", "خواتم", "اساور", "سلاسل", "نظارات", "ساعات"];

/* 👇 التحويل من عربي → إنجليزي (المهم) */
const categoryMap: { [key: string]: string } = {
  "أحلاق": "earrings",
  "خواتم": "rings",
  "اساور": "bracelets",
  "سلاسل": "necklaces",
  "نظارات": "glasses",
  "ساعات": "watches",
};

/* 👇 العكس (إنجليزي → عربي) للتعديل */
const reverseCategoryMap: { [key: string]: string } = {
  earrings: "أحلاق",
  rings: "خواتم",
  bracelets: "اساور",
  necklaces: "سلاسل",
  glasses: "نظارات",
  watches: "ساعات",
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [stock, setStock] = useState(1);
  const [isNew, setIsNew] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else fetchProducts();
    }
  }, [loading, user]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from<Product>("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return console.log(error.message);
    setProducts(data || []);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const saveProduct = async () => {
    if (!name || !price) return alert("اكتب اسم وسعر المنتج");

    const categoryEn = categoryMap[category]; // ⭐ المهم

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, image, { upsert: true });

      if (error) return alert(error.message);

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    if (editId) {
      const { error } = await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          category: categoryEn,
          stock,
          is_new: isNew,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", editId);

      if (error) return alert(error.message);
    } else {
      if (!imageUrl) return alert("اختر صورة");

      const { error } = await supabase.from("products").insert({
        name,
        price: Number(price),
        category: categoryEn,
        stock,
        is_new: isNew,
        image_url: imageUrl,
      });

      if (error) return alert(error.message);
    }

    resetForm();
    fetchProducts();
  };

  const editProduct = (p: Product) => {
    setEditId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
    setCategory(reverseCategoryMap[p.category] || categories[0]); // ⭐
    setStock(p.stock);
    setIsNew(p.is_new);
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setCategory(categories[0]);
    setStock(1);
    setIsNew(false);
    setImage(null);
  };

  if (loading) return <p>جاري التحقق...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#7f5c7e]">
        لوحة تحكم الأدمن
      </h1>

      {/* النموذج */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المنتج" className="input" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر" className="input" />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <input type="number" value={stock} onChange={(e) => setStock(+e.target.value)} className="input" />

        <label>
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          منتج جديد
        </label>

        <input type="file" onChange={handleFileChange} />

        <button onClick={saveProduct} className="btn">
          {editId ? "حفظ التعديل" : "إضافة المنتج"}
        </button>
      </div>
    </div>
  );
}
