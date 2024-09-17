'use client';

import { FormikProps } from 'formik';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import { ErrorMsg } from './errorMessage';

interface FieldImageProps {
  name: string;
  label?: string;
  formik: FormikProps<any>;
  className?: string;
  url?: string; // URL for the image if already available
}

export const FieldImage: React.FC<FieldImageProps> = ({
  name,
  label,
  formik,
  className,
  url,
}) => {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(url || null);

  // useEffect(() => {
  //   // Update previewUrl if url changes
  //   if (url) {
  //     setPreviewUrl(url);
  //   }
  //   // if (url == previewUrl) {
  //   //   setPreviewUrl(null);
  //   // }
  // }, [url]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      formik.setFieldValue(name, file);
    }
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        className={`hidden`}
        ref={imgRef}
        onChange={handleChange}
      />
      {!previewUrl ? (
        <div
          onClick={() => imgRef.current?.click()}
          className="flex w-[100px] md:w-[150px] md:h-[150px] h-[100px] justify-center items-center border border-gray-500 border-dashed rounded-md cursor-pointer"
        >
          +
        </div>
      ) : (
        <div
          onClick={() => imgRef.current?.click()}
          className="flex w-[100px] md:w-[150px] md:h-[150px] h-[100px] justify-center items-center border border-gray-500 border-dashed rounded-md cursor-pointer"
        >
          <Image
            src={previewUrl}
            alt="Preview"
            width={150}
            height={150}
            layout="responsive"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
      <ErrorMsg formik={formik} name={name} />
    </div>
  );
};
