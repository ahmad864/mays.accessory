export interface Product {
  id: number
  name: string
  price: number
  image: string
  stock: number
  isNew: boolean
  category: string
}

export const categoryProducts: { [key: string]: Product[] } = {
  rings: [
    {
      id: 101,
      name: "خاتم ذهبي كلاسيكي",
      price: 250000,
      image: "/gold-ring-classic.jpg",
      stock: 15,
      isNew: true,
      category: "rings",
    },
    {
      id: 102,
      name: "خاتم بالأحجار الكريمة",
      price: 180000,
      image: "/silver-ring-gemstones.jpg",
      stock: 8,
      isNew: false,
      category: "rings",
    },
  ],

  earrings: [
    {
      id: 201,
      name: "أحلاق ذهبية دائرية",
      price: 220000,
      image: "/gold-hoop-earrings.png",
      stock: 16,
      isNew: true,
      category: "earrings",
    },
    {
      id: 202,
      name: "أحلاق فضية بالكريستال",
      price: 145000,
      image: "/silver-crystal-earrings.jpg",
      stock: 12,
      isNew: false,
      category: "earrings",
    },
  ],

  bracelets: [
    {
      id: 301,
      name: "اسوار ذهبي",
      price: 280000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 14,
      isNew: true,
      category: "bracelets",
    },
    {
      id: 302,
      name: "اسوار فضة",
      price: 165000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 18,
      isNew: false,
      category: "bracelets",
    },
  ],

  necklaces: [
    {
      id: 401,
      name: "سلسلة ذهبية كلاسيكية",
      price: 350000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 12,
      isNew: true,
      category: "necklaces",
    },
    {
      id: 402,
      name: "سلسلة فضية بالقلادة",
      price: 185000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 16,
      isNew: false,
      category: "necklaces",
    },
  ],

  watches: [
    {
      id: 501,
      name: "ساعة ذهبية كلاسيكية",
      price: 850000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 8,
      isNew: true,
      category: "watches",
    },
    {
      id: 502,
      name: "ساعة فضية رياضية",
      price: 420000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 15,
      isNew: false,
      category: "watches",
    },
  ],

  glasses: [
    {
      id: 601,
      name: "نظارة شمسية ذهبية",
      price: 320000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 14,
      isNew: true,
      category: "glasses",
    },
    {
      id: 602,
      name: "نظارة فضية كلاسيكية",
      price: 185000,
      image: "/placeholder.svg?height=300&width=300",
      stock: 18,
      isNew: false,
      category: "glasses",
    },
  ],
}

// الحصول على منتجات فئة معينة
export function getProductsByCategory(category: string): Product[] {
  return categoryProducts[category] || []
}

// عدد المنتجات في فئة
export function getProductCountByCategory(category: string): number {
  return categoryProducts[category]?.length || 0
}
