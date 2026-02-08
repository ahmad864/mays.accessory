"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { Menu, X, Heart } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { useFavorites } from "@/lib/favorites-store"
import { useAuth } from "@/lib/auth-store"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getFavoritesCount } = useFavorites()
  const { isAuthenticated, user, isAdmin } = useAuth()
  const favoritesCount = getFavoritesCount()

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ backgroundColor: "rgba(127, 92, 126, 0.1)" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center cursor-pointer">
            <Image
              src="/logo.png"
              alt="MISS Logo"
              width={180}
              height={30}
              className="hover:scale-105 transition-transform duration-200"
              priority
            />
          </Link>

          {/* SEARCH */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <SearchBar />
          </div>

          {/* NAV */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-lg font-bold hover:text-[#7f5c7e] transition-colors">
              الصفحة الرئيسية
            </Link>
            <Link href="/about" className="text-lg font-bold hover:text-[#7f5c7e] transition-colors">
              من نحن
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold hover:text-[#7f5c7e] transition-colors"
            >
              تواصل معنا
            </a>

            {isAuthenticated && isAdmin() && (
              <Link href="/admin" className="text-lg font-bold text-[#7f5c7e]">
                لوحة التحكم
              </Link>
            )}

            {!isAuthenticated ? (
              <Link href="/login" className="text-lg font-bold hover:text-[#7f5c7e] transition-colors">
                تسجيل الدخول
              </Link>
            ) : (
              <span className="text-lg font-bold text-[#7f5c7e]">
                مرحباً، {user?.name}
              </span>
            )}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center space-x-4">

            {/* ❤️ FAVORITES — بدون تسجيل دخول */}
            <Link href="/account">
              <Button variant="ghost" size="icon" className="relative">
                <Heart
                  className={`h-5 w-5 ${
                    favoritesCount > 0
                      ? "fill-[#7f5c7e] text-[#7f5c7e]"
                      : ""
                  }`}
                />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7f5c7e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* 🛒 ORDERS / CART */}
            <CartDrawer />

            {/* MOBILE MENU BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <SearchBar />
            <nav className="flex flex-col space-y-4 mt-4">
              <Link href="/">الصفحة الرئيسية</Link>
              <Link href="/about">من نحن</Link>
              <a href="https://instagram.com" target="_blank">تواصل معنا</a>
              {!isAuthenticated ? (
                <Link href="/login">تسجيل الدخول</Link>
              ) : (
                <span>مرحباً، {user?.name}</span>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
