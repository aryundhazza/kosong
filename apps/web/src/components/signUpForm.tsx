'use client';
import { signUpUser } from '@/lib/user';
import { IUserSignUp } from '@/type/user';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useState } from 'react';

const SignUpSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup.string().required('Role is required'),
});

export default function SignUpForm() {
  const onSignUp = async (
    data: IUserSignUp,
    action: FormikHelpers<IUserSignUp>,
  ) => {
    try {
      console.log(data);
      const { result, ok } = await signUpUser(data);
      if (!ok) throw result.msg;
      toast.success(result.msg);
      action.resetForm();
    } catch (err) {
      console.log(err);
      toast.error(err as string);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        referredBy: '',
        role: '', // Make sure this matches your form's data
      }}
      validationSchema={SignUpSchema}
      onSubmit={(values, action) => {
        onSignUp(values, action);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="min-w-[30vw]">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Sign Up
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
            <div className="mt-10">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <Field
                  name="name"
                  type="text"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  name="name"
                  component={'div'}
                  className="text-sm text-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <Field
                  name="email"
                  type="text"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  name="email"
                  component={'div'}
                  className="text-sm text-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <Field
                  name="password"
                  type="password"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  name="password"
                  component={'div'}
                  className="text-sm text-red-500"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Referal Code (Opsional)
              </label>
              <Field
                name="referredBy"
                type="text"
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Role
              </label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <Field
                    type="radio"
                    name="role"
                    value="User"
                    checked={values.role === 'User'}
                    onChange={() => setFieldValue('role', 'User')}
                    className="form-radio"
                  />
                  <span className="ml-2">User (Peserta)</span>
                </label>
                <label className="flex items-center">
                  <Field
                    type="radio"
                    name="role"
                    value="Organizer"
                    checked={values.role === 'Organizer'}
                    onChange={() => setFieldValue('role', 'Organizer')}
                    className="form-radio"
                  />
                  <span className="ml-2">Organizer (Penyelenggara)</span>
                </label>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 p-1.5 text-sm font-medium rounded-md bg-orange-500"
            >
              Sign up
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
