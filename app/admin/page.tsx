"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user || data.user.email !== "ahmadxxcc200@gmail.com") {
        router.push("/login"); // أي شخص غير أدمن
      } else {
        getProducts();
      }
    };
    checkAdmin();
  }, []);

  // بقية الكود كما هو (جلب، إضافة، تعديل، حذف المنتجات)
  // ...
}
