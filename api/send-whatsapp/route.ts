import { type NextRequest, NextResponse } from "next/server"
import { sendOrderToWhatsApp, type OrderDetails } from "@/lib/whatsapp-integration"
import { sendTelegramMessage } from "@/lib/TelegramUtils"  // استدعاء تيليجرام

export async function POST(request: NextRequest) {
  try {
    const orderDetails: OrderDetails = await request.json()

    // Validate order details
    if (!orderDetails.customerInfo || !orderDetails.items || orderDetails.items.length === 0) {
      return NextResponse.json({ error: "معلومات الطلب غير مكتملة" }, { status: 400 })
    }

    // Send order to WhatsApp
    const success = await sendOrderToWhatsApp(orderDetails)

    // Prepare Telegram message
    const telegramMessage = `
📦 تم شراء منتج:
- العميل: ${orderDetails.customerInfo.name}
- الهاتف: ${orderDetails.customerInfo.phone}
- العنوان: ${orderDetails.customerInfo.address || "-"}
- المنتجات:
${orderDetails.items.map(item => `  • ${item.name} | ${item.qty} × ${item.price}`).join("\n")}
- المجموع: ${orderDetails.total || "-"}
    `

    // Send order to Telegram
    await sendTelegramMessage(telegramMessage)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "تم إرسال الطلب بنجاح"
      })
    } else {
      return NextResponse.json({ error: "فشل في إرسال الطلب" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in WhatsApp API route:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
