'use client';

import RichTextEditor from './editor';
import { useFormik } from 'formik';
import { ErrorMsg } from '@/components/form/errorMessage';
import { useEffect } from 'react';
import { createSlug } from '@/helper/createSlug';
import FieldText from '@/components/form/fieldText';
import FieldSelect from '@/components/form/fieldSelect';
import { FieldImage } from '@/components/form/fieldImage';
import * as Yup from 'yup';
import { EventInput } from '@/type/event';
import { createEvent } from '@/lib/event';
import { toast } from 'react-toastify';
import { getToken, getUserId } from '@/lib/server';
import { useRouter } from 'next/navigation';

export const eventSchema = Yup.object({
  name: Yup.string()
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title must be at most 100 characters long')
    .required('Title is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string()
    .min(15, 'description must be at least 15 characters long')
    .required('description is required'),
  image: Yup.mixed()
    .test(
      'fileType',
      'Only JPEG & PNG',
      (value) =>
        !value ||
        (value instanceof File &&
          ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)),
    )
    .test(
      'fileSize',
      'File size too large (max 5MB)',
      (value) => !value || (value instanceof File && value.size <= 5242880),
    ) // 5 MB in bytes
    .required('Image is required'),
});

const initialValues: EventInput = {
  name: '',
  slug: '',
  category: '',
  price: 0,
  dateTime: '',
  location: '',
  description: '',
  image: '',
  seatsAvailable: 0,
  ticketTypes: '',
  isPaid: false,
  organizerId: 0,
};

export const FormCreate: React.FC = () => {
  const router = useRouter();
  const onCreate = async (data: EventInput, file: File) => {
    try {
      console.log(data);
      const token = await getToken();
      // Create FormData object
      data.dateTime = new Date(data.dateTime).toISOString();
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('image', file);
      const { result, ok } = await createEvent(formData, token as string);
      if (!ok) throw result.msg;
      toast.success(result.msg);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
      // action.resetForm();
    } catch (err) {
      console.log(err);
      toast.error(err as string);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: eventSchema,
    onSubmit: (values, action) => {
      const file = values.image as File;
      onCreate(values, file);
      // action.resetForm();
    },
  });

  const getOrganizerId = async () => {
    const organizerId = await getUserId();
    formik.values.organizerId = Number(organizerId);
  };

  useEffect(() => {
    formik.setFieldValue('slug', createSlug(formik.values.name));
    console.log(formik.values);
    if (formik.values.price > 0) {
      formik.values.isPaid = true;
    }
    if (formik.values.organizerId == 0) {
      getOrganizerId();
    }
  }, [formik.values]);

  return (
    <div className="px-[20px] lg:px-[200px] md:px-[50px]">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        <FieldText name="name" formik={formik} label="Name" />
        <div>
          <label
            htmlFor="slug"
            className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formik.values.slug}
            readOnly
            disabled
            className="hidden bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <FieldSelect
          name="category"
          label="Category"
          formik={formik}
          options={[
            { label: '~ Pilih Category ~', value: '' },
            { label: 'Klasik', value: 'Klasik' },
            { label: 'Jazz', value: 'Jazz' },
            { label: 'Blues', value: 'Blues' },
            { label: 'Reggae', value: 'Reggae' },
            { label: 'Rap', value: 'Rap' },
            { label: 'Pop', value: 'Pop' },
            { label: 'Dangdut', value: 'Dangdut' },
            { label: 'Hindi', value: 'Hindi' },
          ]}
        />
        <div className="flex justify-between">
          <FieldText name="price" formik={formik} label="Harga" type="number" />

          <FieldText
            name="seatsAvailable"
            formik={formik}
            label="Tiket Tersedia"
            type="number"
          />
        </div>
        <FieldSelect
          name="ticketTypes"
          label="Tipe Tiket"
          formik={formik}
          options={[
            { label: '~ Pilih Tipe Tiket ~', value: '' },
            { label: 'VIP', value: 'VIP' },
            { label: 'Reguler', value: 'Reguler' },
          ]}
        />
        <FieldText
          name="dateTime"
          formik={formik}
          label="Tanggal dan Waktu"
          type="datetime-local"
        />
        <FieldText name="location" formik={formik} label="Lokasi" />
        <FieldImage name="image" label="Image" formik={formik} />
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            description
          </label>
          <RichTextEditor formik={formik} name="description" />
          <ErrorMsg formik={formik} name="description" />
        </div>
        <div className="flex sm:justify-end">
          <button
            type="submit"
            className={`w-full h-[40px] sm:w-[120px] disabled:cursor-not-allowed text-[#f5f5f7] bg-[#383839] hover:bg-[#595959] rounded-lg`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
