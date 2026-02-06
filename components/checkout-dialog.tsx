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
    CustomerInfo & {
      detailedAddress: string
      selectedCurrency: string
      discountCode: string
    }
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

    try {
      const orderData = {
        id: Date.now().toString(),
        items: state.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
        customerInfo,
        total,
        currency,
        timestamp: new Date().toISOString(),
        status: "pending",
      }

      // إرسال الطلب إلى Telegram
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()
      if (!data.success) {
        alert("فشل إرسال الطلب: " + data.error)
      } else {
        alert("تم إرسال الطلب بنجاح!")
      }

      // تنظيف السلة وإغلاق الديالوج
      dispatch({ type: "CLEAR_CART" })
      onOpenChange(false)

      // إعادة ضبط النموذج
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
    } catch (error) {
      console.error(error)
      alert("حدث خطأ أثناء إرسال الطلب")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#7f5c7e]" />
            إتمام الطلب
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#7f5c7e]">معلومات الفاتورة</h3>

            {/* الاسم */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /> الاسم الكامل *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
                placeholder="أدخل اسمك الكامل"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* الهاتف */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> رقم الهاتف *</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className={errors.phone ? "border-red-500" : ""}
                placeholder="+963xxxxxxxxx"
                dir="ltr"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* المدينة */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> المدينة *</Label>
              <Select
                value={customerInfo.city}
                onValueChange={(value) => setCustomerInfo({ ...customerInfo, city: value })}
              >
                <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {syrianCities.map(city => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name} - رسوم الشحن: {convertPrice(city.shipping)} {getCurrencySymbol()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>

            {/* العنوان التفصيلي */}
            <div className="space-y-2">
              <Label htmlFor="detailedAddress" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> العنوان التفصيلي *</Label>
              <Textarea
                id="detailedAddress"
                value={customerInfo.detailedAddress}
                onChange={(e) => setCustomerInfo({ ...customerInfo, detailedAddress: e.target.value })}
                placeholder="المنطقة، الشارع، رقم المبنى..."
                rows={3}
                className={!customerInfo.detailedAddress.trim() ? "border-red-500" : ""}
              />
              {!customerInfo.detailedAddress.trim() && errors.address && (
                <p className="text-sm text-red-500">العنوان التفصيلي مطلوب</p>
              )}
            </div>

            {/* ملاحظات */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2"><FileText className="h-4 w-4" /> ملاحظات إضافية (اختياري)</Label>
              <Textarea
                id="notes"
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                placeholder="أي ملاحظات خاصة بالطلب..."
                rows={2}
              />
            </div>
          </div>

          {/* Right Column - ملخص الطلب */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#7f5c7e]">ملخص الطلب</h3>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              {state.items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold">{convertPrice(item.price * item.quantity)} {getCurrencySymbol()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 p-4 bg-[#7f5c7e]/5 rounded-lg">
              <div className="flex justify-between text-sm"><span>المجموع الفرعي:</span><span>{convertPrice(subtotal)} {getCurrencySymbol()}</span></div>
              <div className="flex justify-between text-sm"><span>رسوم الشحن:</span><span>{convertPrice(shippingCost)} {getCurrencySymbol()}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>الإجمالي:</span><span className="text-[#7f5c7e]">{convertPrice(total)} {getCurrencySymbol()}</span></div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">إلغاء</Button>
              <Button onClick={handleSubmit} className="flex-1 bg-[#7f5c7e] hover:bg-[#6d4d6c]" disabled={isSubmitting}>
                <ShoppingBag className="mr-2 h-4 w-4" />{isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
