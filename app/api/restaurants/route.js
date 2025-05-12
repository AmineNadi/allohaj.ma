import { Blob } from '@vercel/blob';
import prisma from '@/lib/prisma';

const blob = new Blob({
  token: process.env.BLOB_READ_WRITE_TOKEN,
});

const uploadFile = async (file) => {
  try {
    const path = `restaurants_images/${file.name}`;
    const response = await blob.upload(path, file);
    return response.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file.");
  }
};

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        meals: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new Response(JSON.stringify({ restaurants }));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch restaurants' }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const file = formData.get('image');

    if (!name || name.trim() === '') {
      return new Response(JSON.stringify({ error: 'Restaurant name is required' }), {
        status: 400,
      });
    }

    let imageUrl = null;

    if (file && file.name) {
      imageUrl = await uploadFile(file); // Upload the image to Vercel Blob
    }

    const existing = await prisma.restaurant.findFirst({ where: { name } });
    if (existing) {
      return new Response(JSON.stringify({ error: 'Restaurant already exists' }), {
        status: 409,
      });
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        imageUrl,
      },
    });

    return new Response(JSON.stringify({ message: 'Restaurant added successfully', restaurant: newRestaurant }));
  } catch (error) {
    console.error('Error adding restaurant:', error);
    return new Response(JSON.stringify({ error: 'Failed to add restaurant' }), {
      status: 500,
    });
  }
}
