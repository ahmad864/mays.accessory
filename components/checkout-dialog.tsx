"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, User, Phone, MapPin, FileText, DollarSign } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import type { CustomerInfo } from "@/lib/whatsapp-utils"
import { CurrencySelector } from "@/components/currency-selector"
import { useCurrency } from "@/lib/currency-store"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const syrianCities = [
  { name: "حماة", shipping: 2 },
  { name: "اللاذقية", shipping: 2 },
  { name: "الحسكة", shipping: 2 },
  { name: "الرقة", shipping: 2 },
  { name: "السويداء", shipping: 2 },
  { name: "دمشق", shipping: 2 },
  { name: "حلب", shipping: 2 },
  { name: "حمص", shipping: 2 },
  { name: "درعا", shipping: 2 },
  { name: "ريف دمشق", shipping: 2 },
  { name: "طرطوس", shipping: 2 },
  { name: "إدلب", shipping: 2 },
  { name: "دير الزور", shipping: 2 },
  { name: "القنيطرة", shipping: 2 },
]

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { state, dispatch } = useCart()
  const { convertPrice, currency } = useCurrency()
  const [customerInfo, setCustomerInfo] = useState<
    CustomerInfo & { detailedAddress: string; selectedCurrency: string; discountCode: string }
  >({
    name: "",
    phone: "+963",
    address: "",
    city: "",
    notes: "",
    detailedAddress: "",
    selectedCurrency: "USD",
    discountCode: "",
  })
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {}
    if (!customerInfo.name.trim()) newErrors.name = "الاسم مطلوب"
    if (!customerInfo.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
    else if (!/^((\+963|00963|0)?9[0-9]{8})$/.test(customerInfo.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم الهاتف غير صحيح"
    }
    if (!customerInfo.address.trim()) newErrors.address = "العنوان مطلوب"
    if (!customerInfo.city) newErrors.city = "المدينة مطلوبة"
    if (!customerInfo.detailedAddress.trim()) newErrors.address = "العنوان التفصيلي مطلوب"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const selectedCity = syrianCities.find((city) => city.name === customerInfo.city)
  const shippingCost = selectedCity ? selectedCity.shipping : 0
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingCost

  const getCurrencySymbol = () => {
    switch (currency) {
      case "USD": return "$"
      case "SYP": return "ل.س"
      case "TRY": return "₺"
      default: return "$"
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setIsSubmitting(true)

    const orderData = {
      id: Date.now().toString(),
      items: state.items,
      customerInfo,
      total,
      currency,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    try {
      // إرسال الطلب إلى API (واتساب / Telegram)
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        alert("✅ تم إرسال الطلب بنجاح! سنتواصل معك قريباً.")
        dispatch({ type: "CLEAR_CART" })
        onOpenChange(false)

        setCustomerInfo({
          name: "",
          phone: "+963",
          address: "",
          city: "",
          notes: "",
          detailedAddress: "",
          selectedCurrency: "USD",
          discountCode: "",
        })
      } else {
        alert("❌ فشل إرسال الطلب. يرجى المحاولة مرة أخرى.")
        console.error("API error:", data)
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("❌ حدث خطأ في الخادم.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#7f5c7e]" /> إتمام الطلب
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer Info */}
          <div className="space-y-6">
            {/* ... هنا تضع كل الفورم كما هو بدون تغيير ... */}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* ... ملخص الطلب كما هو ... */}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">إلغاء</Button>
              <Button onClick={handleSubmit} className="flex-1 bg-[#7f5c7e] hover:bg-[#6d4d6c]" disabled={isSubmitting}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
