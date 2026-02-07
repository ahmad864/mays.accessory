"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  is_featured: boolean;
}

export default function FeaturedProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, image, is_featured")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error fetching featured products: " + error.message);
      setProducts([]);
    } else {
      setProducts(data as Product[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const removeFromFeatured = async (id: string) => {
    const confirmRemove = confirm("Remove this product from featured?");
    if (!confirmRemove) return;

    const { error } = await supabase
      .from("products")
      .update({ is_featured: false })
      .eq("id", id);

    if (error) {
      alert("Error updating product: " + error.message);
    } else {
      fetchFeaturedProducts();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Featured Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No featured products.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded p-4 shadow relative"
            >
              <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                ⭐ Featured
              </span>

              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="mb-2"
                />
              )}

              <h2 className="font-bold">{product.name}</h2>
              <p className="mb-3">Price: {product.price}</p>

              <button
                onClick={() => removeFromFeatured(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Remove from Featured
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
