'use client'

import React, { useCallback, useRef } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { TbPhotoPlus } from 'react-icons/tb'
import Image from 'next/image'

declare global {
  const cloudinary: any
}

interface ImageUpLoadProps {
  onChange: (value: File) => void,
  value: File[]

}

const ImageUpLoad = ({ onChange, value }: ImageUpLoadProps) => {
  
  // const handleUpLoad = useCallback((result: any) => {
  //   onChange(result.info.secure_url)
  // }, [onChange])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOnClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onChange(files[files.length-1])
    }
  }

  // return (
  //   <CldUploadWidget
  //     onSuccess={handleUpLoad}
  //     signatureEndpoint={"/api/sign-cloudinary-params"}
  //     options={{
  //       maxFiles: 5,
  //       clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
  //       maxFileSize: 5000000,
  //     }}
  //   >
  //     {({ open }) => {
  //       return (
  //         <div
  //           onClick={() => open?.()}
  //           className='
  //           relative
  //           cursor-pointer
  //           hover:opacity-70
  //           transition
  //           border-dashed
  //           border-2
  //           p-20
  //           border-neutral-300
  //           flex
  //           flex-col
  //           justify-center
  //           items-center
  //           gap-4
  //           text-neutral-600
  //           '
  //         >
  //           <TbPhotoPlus size={50}></TbPhotoPlus>
  //           <div className='font-semibold text-lg'>
  //             Click to upload
  //           </div>
  //           {value && (
  //             <div className='absolute inset-0 w-full h-full'>
  //               <Image
  //                 alt='Upload'
  //                 fill
  //                 style={{objectFit: 'cover'}}
  //                 src={value}
  //               ></Image>
  //             </div>
  //           )}
  //         </div>
  //       )
  //     }}
  //   </CldUploadWidget>
  // )

  return (
    <div
            onClick={handleOnClick}
            className='
            relative
            cursor-pointer
            hover:opacity-70
            transition
            border-dashed
            border-2
            p-20
            border-neutral-300
            flex
            flex-col
            justify-center
            items-center
            gap-4
            text-neutral-600
            overflow-auto
            '
          > 
            
            <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

            <TbPhotoPlus size={50}></TbPhotoPlus>
            <div className='font-semibold text-lg'>
              Click to upload
            </div>
            {value.length > 0 && (
              <div className="absolute w-full h-full flex flex-wrap items-center justify-center gap-4 px-2 py-4">
              {value.map((url, index) => (
                url && (
                  <div key={index} className="relative w-1/4 h-1/4">
                    <Image
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      src={URL.createObjectURL(url)}
                    />
                  </div>
                )
              ))}
            </div>
            )}
          </div>
  )
}

export default ImageUpLoad