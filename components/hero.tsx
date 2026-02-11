"use client"

export function Hero() {
  // مصفوفة تحتوي على صورة واحدة فقط
  const heroImages = ["/hero-single.jpg"]

  return (
    <section className="relative overflow-hidden">
      {/* النص العلوي */}
      <div className="absolute top-8 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight font-amiri text-white drop-shadow-2xl">
              تفاصيل صغيرة
              <span className="text-purple-200 block">تصنع أناقة</span>
              كبيرة
            </h1>
          </div>
        </div>
      </div>

      {/* صورة الهيرو */}
      <div className="relative h-80 lg:h-96 overflow-hidden">
        <img
          src={heroImages[0] || "/placeholder.svg"}
          alt="Hero image"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

      {/* المساحة الفارغة أسفل الصورة */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="space-y-8"></div>
        </div>
      </div>
    </section>
  )
}
