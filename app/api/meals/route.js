import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const meals = await prisma.meal.findMany({
      include: { restaurant: true },
    });
    return Response.json(meals);
  } catch (error) {
    return Response.json({ error: 'خطأ في جلب الوجبات' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const price = parseFloat(formData.get('price'));
    const restaurantId = parseInt(formData.get('restaurantId'), 10);
    const image = formData.get('image');

    let imageUrl = null;

    if (image && image.name) {
      const blob = await put(image.name, image, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    const meal = await prisma.meal.create({
      data: {
        name,
        price,
        image: imageUrl,
        restaurant: {
          connect: { id: restaurantId },
        },
      },
    });

    return Response.json(meal);
  } catch (error) {
    console.error('خطأ في إضافة الوجبة:', error);
    return Response.json({ error: 'فشل في إضافة الوجبة' }, { status: 500 });
  }
}
