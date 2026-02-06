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
    else if (!/^((\+963|00963|0)?9[0-9]{8})$/.test(customerInfo.phone.replace(/\s/g, "")))
      newErrors.phone = "رقم الهاتف غير صحيح"
    if (!customerInfo.city) newErrors.city = "المدينة مطلوبة"
    if (!customerInfo.detailedAddress.trim()) newErrors.address = "العنوان التفصيلي مطلوب"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const selectedCity = syrianCities.find(c => c.name === customerInfo.city)
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
      }

      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })
      const data = await response.json()

      if (!data.success) alert("فشل إرسال الطلب: " + (data.error || "خطأ غير معروف"))
      alert("تم إرسال طلبك بنجاح، شكرًا على ثقتك 💜🫰🏻")

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
    } catch (err) {
      console.error(err)
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
            <ShoppingBag className="h-5 w-5 text-[#7f5c7e]" /> إتمام الطلب
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - معلومات الزبون */}
          <div className="space-y-6">
            <Label>الاسم الكامل *</Label>
            <Input value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} />
            <Label>رقم الهاتف *</Label>
            <Input value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
            <Label>المدينة *</Label>
            <Select value={customerInfo.city} onValueChange={v => setCustomerInfo({ ...customerInfo, city: v })}>
              <SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
              <SelectContent>
                {syrianCities.map(city => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name} - رسوم الشحن: {convertPrice(city.shipping)} {getCurrencySymbol()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>العنوان التفصيلي *</Label>
            <Textarea value={customerInfo.detailedAddress} onChange={e => setCustomerInfo({ ...customerInfo, detailedAddress: e.target.value })} rows={3} />
            <Label>ملاحظات إضافية</Label>
            <Textarea value={customerInfo.notes} onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })} rows={2} />
          </div>

          {/* Right - ملخص الطلب */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#7f5c7e]">ملخص الطلب</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              {state.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{convertPrice(item.price * item.quantity)} {getCurrencySymbol()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 p-4 bg-[#7f5c7e]/5 rounded-lg">
              <div className="flex justify-between"><span>المجموع الفرعي:</span><span>{convertPrice(subtotal)} {getCurrencySymbol()}</span></div>
              <div className="flex justify-between"><span>رسوم الشحن:</span><span>{convertPrice(shippingCost)} {getCurrencySymbol()}</span></div>
              <div className="flex justify-between font-bold"><span>الإجمالي:</span><span>{convertPrice(total)} {getCurrencySymbol()}</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">إلغاء</Button>
              <Button onClick={handleSubmit} className="flex-1 bg-[#7f5c7e]" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
