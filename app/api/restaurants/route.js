import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { meals: true },
    });
    return Response.json(restaurants);
  } catch (error) {
    return Response.json({ error: 'خطأ في جلب المطاعم' }, { status: 500 });
  }
} 

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const city = formData.get('city');
    const image = formData.get('image');

    let imageUrl = null;

    if (image && image.name) {
      const blob = await put(image.name, image, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        image: imageUrl,
      },
    });

    return Response.json(restaurant);
  } catch (error) {
    console.error('خطأ في إضافة المطعم:', error);
    return Response.json({ error: 'فشل في إضافة المطعم' }, { status: 500 });
  }
}
