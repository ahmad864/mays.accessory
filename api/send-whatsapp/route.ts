import { type NextRequest, NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "" // ضع التوكن هنا أو في env
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ""     // ضع chat_id هنا أو في env

interface OrderDetails {
  id: string
  items: { name: string; quantity: number; price: number; image?: string }[]
  customerInfo: {
    name: string
    phone: string
    address: string
    city: string
    detailedAddress: string
    notes?: string
    discountCode?: string
  }
  total: number
  currency: string
  timestamp: string
  status: string
}

export async function POST(request: NextRequest) {
  try {
    const orderDetails: OrderDetails = await request.json()

    // Validate order details
    if (!orderDetails.customerInfo || !orderDetails.items || orderDetails.items.length === 0) {
      return NextResponse.json({ error: "معلومات الطلب غير مكتملة" }, { status: 400 })
    }

    // Prepare message text
    let message = `🛒 طلب جديد\n\n`
    message += `📌 الاسم: ${orderDetails.customerInfo.name}\n`
    message += `📞 رقم الهاتف: ${orderDetails.customerInfo.phone}\n`
    message += `🏠 المدينة: ${orderDetails.customerInfo.city}\n`
    message += `📍 العنوان التفصيلي: ${orderDetails.customerInfo.detailedAddress}\n`
    if (orderDetails.customerInfo.notes) message += `📝 ملاحظات: ${orderDetails.customerInfo.notes}\n`
    if (orderDetails.customerInfo.discountCode) message += `🎟 كود خصم: ${orderDetails.customerInfo.discountCode}\n`
    message += `\n🛍 المنتجات:\n`
    orderDetails.items.forEach((item) => {
      message += `- ${item.name} × ${item.quantity} = ${item.price} ${orderDetails.currency}\n`
    })
    message += `\n💰 المجموع الكلي: ${orderDetails.total} ${orderDetails.currency}`

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    )

    const telegramData = await telegramResponse.json()
    if (!telegramData.ok) {
      console.error("Telegram API error:", telegramData)
      return NextResponse.json({ error: "فشل في إرسال الطلب إلى Telegram" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "تم إرسال الطلب بنجاح إلى Telegram!" })
  } catch (error) {
    console.error("Error in Telegram API route:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
