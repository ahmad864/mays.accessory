"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { Search, Menu, X, Heart } from "lucide-react"
import Link from "next/link"
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
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            import Image from "next/image"
import Link from "next/link"

<Link href="/" className="flex items-center">
  <Image
    src="/logo.png"
    alt="MISS Logo"
    width={180}   // العرض
    height={30}   // الارتفاع → نسبة 6×1
    className="hover:scale-105 transition-transform duration-200"
    priority
  />
</Link>
      
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <SearchBar />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
            >
              الصفحة الرئيسية
            </Link>
            <Link
              href="/about"
              className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
            >
              من نحن
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
            >
              تواصل معنا
            </a>
            {isAuthenticated && isAdmin() && (
              <Link
                href="/admin"
                className="text-lg font-bold text-[#7f5c7e] hover:text-[#6b4c6a] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                لوحة التحكم
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                تسجيل الدخول
              </Link>
            )}
            {isAuthenticated && (
              <span className="text-lg font-bold text-[#7f5c7e] font-tajawal">مرحباً، {user?.name}</span>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:scale-110 active:scale-95 transition-transform"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/account?tab=favorites">
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 active:scale-95 transition-transform relative"
              >
                <Heart className={`h-5 w-5 ${favoritesCount > 0 ? "fill-[#7f5c7e] text-[#7f5c7e]" : ""}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7f5c7e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            <CartDrawer />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:scale-110 active:scale-95 transition-transform"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4" style={{ backgroundColor: "rgba(127, 92, 126, 0.05)" }}>
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                الصفحة الرئيسية
              </Link>
              <Link
                href="/about"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                من نحن
              </Link>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                تواصل معنا
              </a>
              {isAuthenticated && isAdmin() && (
                <Link
                  href="/admin"
                  className="text-lg font-bold text-[#7f5c7e] hover:text-[#6b4c6a] transition-colors font-tajawal hover:scale-105 active:scale-95"
                >
                  لوحة التحكم
                </Link>
              )}
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
                >
                  تسجيل الدخول
                </Link>
              ) : (
                <span className="text-lg font-bold text-[#7f5c7e] font-tajawal">مرحباً، {user?.name}</span>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
