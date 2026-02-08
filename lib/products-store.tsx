"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer } from "react"
import { supabase } from "@/lib/supabase"

/* ✅ الفئات الرسمية للموقع */
const OFFICIAL_CATEGORIES = [
  "خواتم",
  "أحلاق",
  "اساور",
  "سلاسل",
  "ساعات",
  "نظارات",
]

/* ✅ توحيد أسماء الفئات */
const CATEGORY_MAP: Record<string, string> = {
  rings: "خواتم",
  ring: "خواتم",

  earrings: "أحلاق",
  earring: "أحلاق",

  bracelets: "اساور",
  bracelet: "اساور",

  necklaces: "سلاسل",
  necklace: "سلاسل",
  chains: "سلاسل",

  watches: "ساعات",
  watch: "ساعات",

  glasses: "نظارات",
  sunglasses: "نظارات",

  خواتم: "خواتم",
  أحلاق: "أحلاق",
  اساور: "اساور",
  سلاسل: "سلاسل",
  ساعات: "ساعات",
  نظارات: "نظارات",
}

export interface Product {
  id: number
  name: string
  price: number
  images: string[]
  category: string
  rating: number
  reviews: number
  isNew: boolean
  isSale: boolean   // ⭐ المنتجات المميزة
  stock: number
}

interface ProductsState {
  products: Product[]
  categories: string[]
  loading: boolean
}

type ProductsAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: ProductsState = {
  products: [],
  categories: OFFICIAL_CATEGORIES,
  loading: true,
}

function productsReducer(
  state: ProductsState,
  action: ProductsAction
): ProductsState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        categories: OFFICIAL_CATEGORIES,
        loading: false,
      }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    default:
      return state
  }
}

const ProductsContext = createContext<{
  state: ProductsState
} | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState)

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "SET_LOADING", payload: true })

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name")

      if (!error && data) {
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          images: [p.image_url],
          category: CATEGORY_MAP[p.category] ?? "خواتم",
          rating: 5,
          reviews: 0,
          isNew: p.is_new ?? false,

          // ✅ هذا هو الإصلاح المهم
          isSale: p.is_featured === true, // ⭐ المنتجات المميزة فقط

          stock: p.stock ?? 10,
        }))

        dispatch({ type: "SET_PRODUCTS", payload: mappedProducts })
      }
    }

    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{ state }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider")
  }
  return context
}
