import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Instagram, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t" style={{ backgroundColor: "rgba(127, 92, 126, 0.05)" }}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto">
              <span
                className="text-5xl font-black bg-gradient-to-r from-[#7f5c7e] to-purple-700 bg-clip-text text-transparent font-cinzel-decorative tracking-wider drop-shadow-lg"
                style={{
                  textShadow: "3px 3px 6px rgba(127, 92, 126, 0.4)",
                  fontFamily: "var(--font-cinzel-decorative)",
                }}
              >
                MISS
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-amiri" style={{ color: "#7f5c7e" }}>
                حيث تلتقي الأناقة بالجمال
              </p>
              <p className="text-sm text-muted-foreground">أوقات العمل: من 10 صباحاً حتى 10 مساءً</p>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: "#7f5c7e" }} />
                <span className="text-sm">+963941813277</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" style={{ color: "#7f5c7e" }} />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-lg font-amiri mb-4" style={{ color: "#7f5c7e" }}>
            كُل الحب لك ولزيارتك متجرنا
          </p>
          <p className="text-sm text-muted-foreground">© 2026 Miss Accessories. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
