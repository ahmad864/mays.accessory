"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

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
  description: string
  colors?: string[]
  sizes?: string[]
}

interface ProductsState {
  products: Product[]
  categories: string[]
  loading: boolean
}

type ProductsAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "UPDATE_STOCK"; payload: { id: number; stock: number } }
  | { type: "SET_LOADING"; payload: boolean }

/* 🔴 البداية نظيفة 100٪ — لا منتجات تجريبية */
const initialState: ProductsState = {
  products: [],
  categories: [],
  loading: false,
}

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "SET_PRODUCTS": {
      const categories = [...new Set(action.payload.map((p) => p.category))]
      return {
        ...state,
        products: action.payload,
        categories,
      }
    }

    case "ADD_PRODUCT": {
      const categories = [...new Set([...state.categories, action.payload.category])]
      return {
        ...state,
        products: [...state.products, action.payload],
        categories,
      }
    }

    case "UPDATE_PRODUCT": {
      const updatedProducts = state.products.map((p) =>
        p.id === action.payload.id ? action.payload : p,
      )
      const categories = [...new Set(updatedProducts.map((p) => p.category))]

      return {
        ...state,
        products: updatedProducts,
        categories,
      }
    }

    case "DELETE_PRODUCT": {
      const updatedProducts = state.products.filter((p) => p.id !== action.payload)
      const categories = [...new Set(updatedProducts.map((p) => p.category))]

      return {
        ...state,
        products: updatedProducts,
        categories,
      }
    }

    case "UPDATE_STOCK":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? { ...p, stock: action.payload.stock } : p,
        ),
      }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    default:
      return state
  }
}

const ProductsContext = createContext<{
  state: ProductsState
  dispatch: React.Dispatch<ProductsAction>
} | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState)

  return (
    <ProductsContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
