// import { v2 as cloudinary } from "cloudinary";
// import dotenv from 'dotenv'

// dotenv.config()

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// export async function POST(request: Request) {
//   const body = await request.json();
//   const { imageSrc } = body;

//   const ArrayUrls: string[] = []

//   for(const file of imageSrc){
//     try {
//       const formData = new FormData()


//       const uploadResponse = await cloudinary.uploader.upload(URL.createObjectURL(file), {
//         upload_preset: 'hjrshoya',
//       });

//       ArrayUrls.push(uploadResponse.secure_url)
      
//     } catch (error) {
//       console.log("Error in api upload image" + error)
//     }
//   }

//   return ArrayUrls

// }

import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

// Cấu hình môi trường
dotenv.config();

// Cấu hình Cloudinary - nên validate env variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Kiểm tra cấu hình Cloudinary
if (!cloudinary.config().cloud_name) {
  // console.error('Cloudinary config is missing!');
}

// pages/api/sign-cloudinary-params.ts
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // console.log(formData)
    const files = formData.getAll('images') as File[];
    // console.log("api"+files)

    
    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              upload_preset: 'hjrshoya',
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result?.secure_url);
            }
          ).end(buffer);
        });
        return result;
      })
    );
    return NextResponse.json(uploadedUrls); 
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' +error},
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { urlImage } = body;

    await Promise.all(
      urlImage.map(async (publicId: string) => {
        await cloudinary.uploader.destroy(publicId);
      })
    );

    return NextResponse.json({ message: 'Deleted successfully' });

  } catch (error) {
    throw new Error("something went wrong in delete image")
  }
}