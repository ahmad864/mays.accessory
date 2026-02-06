import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const order = await request.json()

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({ success: false, error: "Telegram token or chat ID missing" }, { status: 500 })
    }

    // بناء رسالة الطلب
    let message = `📦 طلب جديد!\n\n`
    message += `🧑 الاسم: ${order.customerInfo.name}\n`
    message += `📞 الهاتف: ${order.customerInfo.phone}\n`
    message += `🏙️ المدينة: ${order.customerInfo.city}\n`
    message += `📍 العنوان التفصيلي: ${order.customerInfo.detailedAddress}\n`
    if (order.customerInfo.notes) message += `📝 ملاحظات: ${order.customerInfo.notes}\n`
    message += `💰 العملة: ${order.currency}\n`
    message += `💵 الإجمالي: ${order.total} ${order.currency}\n\n`
    message += `🛒 المنتجات:\n`
    order.items.forEach((item: any, idx: number) => {
      message += `${idx + 1}. ${item.name} × ${item.quantity} = ${item.price * item.quantity}\n`
    })

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`

    const res = await fetch(telegramUrl)
    const data = await res.json()

    if (!data.ok) {
      return NextResponse.json({ success: false, error: data.description }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
