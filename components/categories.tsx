"use client"

import { useEffect, useState } from "react"
import { Gem, Sparkles, Watch, Glasses, Zap, Heart } from "lucide-react"
import Link from "next/link"
import { getProductCountByCategory } from "@/lib/category-products"

const categories = [
  { id: 1, name: "خواتم", icon: Gem, slug: "rings" },
  { id: 2, name: "أحلاق", icon: Sparkles, slug: "earrings" },
  { id: 3, name: "اساور", icon: Heart, slug: "bracelets" },
  { id: 4, name: "سلاسل", icon: Zap, slug: "necklaces" },
  { id: 5, name: "ساعات", icon: Watch, slug: "watches" },
  { id: 6, name: "نظارات", icon: Glasses, slug: "glasses" },
]

export function Categories() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchCounts = async () => {
      const results: Record<string, number> = {}

      for (const category of categories) {
        const count = await getProductCountByCategory(category.slug)
        results[category.slug] = count
      }

      setCounts(results)
    }

    fetchCounts()
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-tajawal text-[#7f5c7e]">
            تسوقي حسب الفئة
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-tajawal">
            اكتشفي مجموعتنا المتنوعة من الإكسسوارات المصممة خصيصاً لتناسب ذوقك الرفيع
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            const productCount = counts[category.slug] ?? 0

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <div className="w-24 h-24 rounded-full bg-[#7f5c7e] flex items-center justify-center mb-4 shadow-lg group-hover:bg-[#6b4c6a] transition">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-lg font-semibold font-tajawal group-hover:text-[#7f5c7e] transition">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {productCount} منتج
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
