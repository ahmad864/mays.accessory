import { Shield, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "الثقة",
      description:
        "نلتزم بتقديم تجربة تسوق آمنة وموثوقة، ونهتم براحتك",
    },
    {
      icon: Truck,
      title: "شحن سريع وآمن",
      description:
        "شحن بأمان وإلى جميع المدن السورية مع متابعة مستمرة حتى وصول طلبك",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-tajawal">
            لماذا تختارين متجر MISS؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-tajawal">
            لأن ثقتك تهمنا، ولأن راحتك أولوية في كل طلب
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="
                group
                border-0
                bg-white/80
                backdrop-blur-sm
                shadow-md
                transition-all
                duration-300
                hover:shadow-2xl
                hover:-translate-y-2
              "
            >
              <CardContent className="p-10 text-center">
                {/* ICON */}
                <div
                  className="
                    w-16 h-16 mx-auto mb-6
                    bg-primary/10
                    rounded-full
                    flex items-center justify-center
                    transition-all
                    duration-300
                    group-hover:bg-primary
                    group-hover:scale-110
                  "
                >
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-semibold mb-4 font-tajawal transition-colors duration-300 group-hover:text-primary">
                  {feature.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-muted-foreground leading-relaxed font-tajawal">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
