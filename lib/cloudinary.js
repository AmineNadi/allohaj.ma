// lib/cloudinary.js
import cloudinary from 'cloudinary';

// تهيئة Cloudinary باستخدام المتغيرات البيئية
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,    // اسم السحابة
  api_key: process.env.API_KEY,          // مفتاح API
  api_secret: process.env.API_SECRET     // سر API
});

export default cloudinary;
