import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Footer } from "@/components/footer"
import { FeaturedProducts } from "@/components/featured-products"
import { Suspense } from "react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />
        <Categories />

        {/* منتجاتنا المميزة */}
        <Suspense fallback={null}>
          <FeaturedProducts />
        </Suspense>

        <WhyChooseUs />
      </main>

      <Footer />
    </div>
  )
}
