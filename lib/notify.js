export async function sendWhatsAppNotification({ phone, message, apikey }) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
    message
  )}&apikey=${apikey}`

  try {
    const res = await fetch(url)
    const text = await res.text()
    return text.includes('Message Sent')
  } catch (error) {
    console.error('خطأ في إرسال رسالة WhatsApp:', error)
    return false
  }
}
