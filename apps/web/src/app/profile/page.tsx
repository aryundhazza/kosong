'use client';
import React, { useState, useEffect } from 'react';
import { deleteToken, getToken, getUserId } from '@/lib/server';
import { getProfile, updateProfile } from '@/lib/user';
import { FieldImage } from '@/components/form/fieldImage';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { EventInputProfile } from '@/type/event';
import { useRouter } from 'next/navigation';
import FieldText from '@/components/form/fieldText';

interface EventType {
  points?: string;
  referralCode?: string;
  email?: string;
  sex?: string;
  dateOfBirth?: string;
  id?: string;
  name?: string;
  date?: string;
  avatar?: string;
  saldo?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<EventType | null>(null);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      const userId = await getUserId();
      const response = await getProfile(userId, token);
      setProfile(response.result.user);
      // Update Formik's values after fetching profile data
      formik.setValues({
        email: response.result.user.email || '',
        name: response.result.user.name || '',
        avatar: response.result.user.avatar || '',
        referralCode: response.result.user.referralCode || '',
        points: response.result.user.points || '',
        saldo: response.result.user.saldo || '',
      });
      console.log(response); // Ensure the response is as expected
    } catch (err) {
      console.error(err); // Handle errors
    }
  };

  const onLogout = async () => {
    await deleteToken();
    router.push('/login');
    router.refresh();
  };

  const onCreate = async (data: EventInputProfile, file: File | null) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('avatar', file);
      const { result, ok } = await updateProfile(formData, token as string);
      if (!ok) throw result.msg;
      toast.success(result.msg);
      setTimeout(() => {
        router.push('/'); // Navigate to another page after success
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(err as string);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      avatar: '',
      points: '',
      referralCode: '',
      saldo: '',
    },
    onSubmit: (values, actions) => {
      const file = values.avatar ? (values.avatar as unknown as File) : null; // Convert to File if needed
      onCreate(values, file);
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <section className="py-10 my-auto dark:bg-gray-900">
      <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
        <div className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
          <h1 className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2 dark:text-white">
            Profile
          </h1>
          <div className="flex justify-center text-center">
            <FieldImage
              name="avatar"
              label="Image"
              formik={formik}
              url={formik.values.avatar}
            />
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="w-full rounded-sm bg-cover bg-center bg-no-repeat items-center">
              <FieldText name="name" formik={formik} label="Name" />
            </div>
            <div className="w-full mb-4 mt-6">
              <FieldText name="email" formik={formik} label="Email" />
            </div>
            <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
              <div className="w-full mb-4 lg:mt-6">
                <label
                  htmlFor="slug"
                  className=" mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Referral Code
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formik.values.referralCode}
                  readOnly
                  disabled
                  className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="w-full mb-4 lg:mt-6">
                <label
                  htmlFor="slug"
                  className=" mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Points
                </label>
                <input
                  type="text"
                  name="points"
                  value={formik.values.points}
                  readOnly
                  disabled
                  className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="w-full mb-4 lg:mt-6">
                <label
                  htmlFor="slug"
                  className=" mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Saldo
                </label>
                <input
                  type="number"
                  name="saldo"
                  value={formik.values.saldo}
                  readOnly
                  disabled
                  className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div className="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
              <button type="submit" className="w-full p-4">
                Update
              </button>
            </div>
            <div className="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
              <button onClick={onLogout} type="button" className="w-full p-4">
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
