"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // تأكد أن المسار صحيح

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // حماية الصفحة + جلب المنتجات
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user || data.user.email !== "admin@email.com") {
        router.push("/admin/login");
      } else {
        getProducts();
      }
    };
    checkAdmin();
  }, []);

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
    <div className="container">
      <h1 className="title">لوحة التحكم</h1>

      {/* نموذج إضافة / تعديل المنتج */}
      <div className="card">
        <h2>{editId ? "تعديل منتج" : "إضافة منتج"}</h2>

        <input
          className="input"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="سعر المنتج"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button className="btn" onClick={saveProduct}>
          {editId ? "حفظ التعديل" : "إضافة المنتج"}
        </button>

        {editId && (
          <button className="btn outline" onClick={resetForm}>
            إلغاء
          </button>
        )}
      </div>

      {/* عرض المنتجات */}
      <div className="grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image_url} />
            <h3>{p.name}</h3>
            <p>{p.price}</p>

            <div className="actions">
              <button className="btn small" onClick={() => editProduct(p)}>
                تعديل
              </button>

              <button
                className="btn danger small"
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
