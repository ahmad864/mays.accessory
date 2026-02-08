"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer } from "react"
import { supabase } from "@/lib/supabase"

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  rating: number
  reviews: number
  isNew: boolean
  isSale: boolean
  stock: number
  description?: string
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
  categories: [],
  loading: true,
}

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "SET_PRODUCTS": {
      const categories = Array.from(
        new Set(action.payload.map((p) => p.category))
      )

      return {
        ...state,
        products: action.payload,
        categories,
        loading: false,
      }
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
          category: p.category,
          rating: 5,
          reviews: 0,
          isNew: p.low_stock ?? false,
          isSale: false,
          stock: p.low_stock ? 3 : 10,
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
