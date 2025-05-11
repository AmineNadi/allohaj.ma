import { writeFile } from 'fs/promises'
import path from 'path'
import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'

// دعم فقط POST
export async function POST(req) {
  try {
    // تحقق أن المحتوى هو form-data
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'نوع المحتوى غير مدعوم' }, { status: 400 })
    }

    // قراءة البيانات المرسلة من النموذج
    const formData = await req.formData()

    const name = formData.get('name')
    const price = parseInt(formData.get('price'))
    const restaurantId = formData.get('restaurantId')
    const file = formData.get('image')

    // تحقق من الحقول المطلوبة
    if (!name || !price || !restaurantId || !file) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    // حفظ الصورة في مجلد public/uploads
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${file.name}`
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName)

    await writeFile(uploadPath, buffer)

    const imageUrl = `/uploads/${fileName}`

    // حفظ البيانات في قاعدة البيانات باستخدام Prisma
    const meal = await prisma.meal.create({
      data: {
        name,
        price,
        restaurantId,
        imageUrl,
      },
    })

    return NextResponse.json({ meal }, { status: 201 })
  } catch (error) {
    console.error('Error adding meal:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة الوجبة' }, { status: 500 })
  }
}
