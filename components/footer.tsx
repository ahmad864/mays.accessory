import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{ backgroundColor: "rgba(127, 92, 126, 0.05)" }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            {/* LOGO IMAGE */}
            <div className="mx-auto flex justify-center">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="MISS Logo"
                  width={200}
                  height={60}
                  className="h-14 w-auto hover:scale-105 transition-transform duration-200"
                  priority
                />
              </Link>
            </div>

            <div className="space-y-2">
              <p
                className="text-lg font-amiri"
                style={{ color: "#7f5c7e" }}
              >
                حيث تلتقي الأناقة بالجمال
              </p>
              <p className="text-sm text-muted-foreground">
                أوقات العمل: من 10 صباحاً حتى 10 مساءً
              </p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center justify-center gap-6">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" style={{ color: "#7f5c7e" }} />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p
            className="text-lg font-amiri mb-4"
            style={{ color: "#7f5c7e" }}
          >
            كُل الحب لك ولزيارتك متجرنا
          </p>
          <p className="text-sm text-muted-foreground">
            © 2026 Miss Accessories. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
