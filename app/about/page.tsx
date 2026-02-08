import { Button } from "@/components/ui/button"
import { Heart, Star, Award, Users } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#7f5c7e]/10 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-tajawal text-[#7f5c7e]">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-tajawal leading-relaxed">
            متجر MISS هو وجهتك المثالية للإكسسوارات الأنيقة والعصرية. نحن نؤمن بأن كل امرأة تستحق أن تشعر بالجمال
            والثقة
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-tajawal text-[#7f5c7e]">قصتنا</h2>
              <p className="text-lg text-gray-600 mb-6 font-tajawal leading-relaxed">
                بدأت رحلتنا من حلم بسيط: تقديم إكسسوارات عالية الجودة بأسعار معقولة لكل امرأة. منذ تأسيسنا، نحن نعمل
                بشغف لاختيار أجمل القطع التي تعكس شخصيتك الفريدة.
              </p>
              <p className="text-lg text-gray-600 font-tajawal leading-relaxed">
                نحن نفخر بتقديم مجموعة متنوعة من الخواتم، الأحلاق الأساور، السلاسل، الساعات والنظارات التي تناسب جميع
                الأذواق والمناسبات.
              </p>
            </div>
            <div className="bg-[#7f5c7e]/5 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#7f5c7e] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-[#7f5c7e] font-tajawal">الشغف</h3>
                  <p className="text-sm text-gray-600 font-tajawal">نحب ما نفعله</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#7f5c7e] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-[#7f5c7e] font-tajawal">الجودة</h3>
                  <p className="text-sm text-gray-600 font-tajawal">أفضل المواد</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#7f5c7e] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-[#7f5c7e] font-tajawal">التميز</h3>
                  <p className="text-sm text-gray-600 font-tajawal">خدمة استثنائية</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#7f5c7e] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-[#7f5c7e] font-tajawal">العملاء</h3>
                  <p className="text-sm text-gray-600 font-tajawal">رضاكم أولويتنا</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-[#7f5c7e]/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 font-tajawal text-[#7f5c7e]">رسالتنا</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-tajawal leading-relaxed">
            نسعى لأن نكون الخيار الأول لكل امرأة تبحث عن إكسسوارات تعبر عن شخصيتها وتضيف لمسة من الأناقة إلى إطلالتها
            اليومية. نحن ملتزمون بتقديم منتجات عالية الجودة وخدمة عملاء متميزة.
          </p>
          <div className="mt-12">
            <Link href="/">
              <Button className="bg-[#7f5c7e] hover:bg-[#6b4c6a] text-white px-8 py-3 text-lg font-tajawal">
                تسوقي الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
