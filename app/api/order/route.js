import prisma from '@/lib/prisma';
import { sendWhatsAppNotification } from '@/lib/notify';

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ orders });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, meals } = body;

    if (!name || !phone) {
      return Response.json({ error: 'الاسم ورقم الهاتف مطلوبان' }, { status: 400 });
    }
    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return Response.json({ error: 'يجب اختيار وجبة واحدة على الأقل' }, { status: 400 });
    }

    
    const newOrder = await prisma.order.create({
      data: {
        name,
        phone,
        meals: JSON.stringify(meals),
      },
    });

    // إعداد رسالة WhatsApp
    const mealList = meals.map((item) => `${item.meal} (${item.restaurant})`).join('\n- ');
    await sendWhatsAppNotification({
      phone: '+212691572526', 
      apikey: '7782866',
      message: `📦 طلب جديد:\nالاسم: ${name}\nالهاتف: ${phone}\nالوجبات:\n- ${mealList}`,
    });

    return Response.json({ message: 'تم استلام الطلب', order: newOrder });
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    return Response.json({ error: 'حدث خطأ أثناء إنشاء الطلب' }, { status: 500 });
  }
}