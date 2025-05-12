import { Blob } from '@vercel/blob';
import prisma from '@/lib/prisma';

const blob = new Blob({
  token: process.env.BLOB_READ_WRITE_TOKEN,
});

const uploadFile = async (file) => {
  try {
    const path = `meals_images/${file.name}`;
    const response = await blob.upload(path, file);
    return response.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file.");
  }
};

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Unsupported content type' }), { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const price = parseInt(formData.get('price'));
    const restaurantId = formData.get('restaurantId');
    const file = formData.get('image');

    if (!name || !price || !restaurantId || !file) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const imageUrl = await uploadFile(file); // Upload the image to Vercel Blob

    const meal = await prisma.meal.create({
      data: {
        name,
        price,
        restaurantId,
        imageUrl,
      },
    });

    return new Response(JSON.stringify({ meal }), { status: 201 });
  } catch (error) {
    console.error('Error adding meal:', error);
    return new Response(JSON.stringify({ error: 'Failed to add meal' }), { status: 500 });
  }
}
