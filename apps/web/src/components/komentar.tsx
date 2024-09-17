'use client';
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getComment, postComment } from '@/lib/event'; // Assume this is your API call function
import { getToken, getUserId } from '@/lib/server';

interface KomenProps {
  eventId: number;
}

interface EventType {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: User;
}

interface User {
  name: string;
}

const validationSchema = Yup.object({
  rating: Yup.string().required('Rating is required'),
  comment: Yup.string().required('Comment is required'),
});

const Komentar: React.FC<KomenProps> = ({ eventId }) => {
  const [review, setReview] = useState<EventType[]>([]);

  const handleSubmit = async (
    values: { rating: string; comment: string },
    { resetForm }: FormikHelpers<{ rating: string; comment: string }>,
  ) => {
    try {
      const token = await getToken();
      const userId = await getUserId();
      const input = {
        eventId,
        userId: Number(userId),
        rating: Number(values.rating),
        comment: values.comment,
      };
      const { result, ok } = await postComment(input, token);
      if (!ok) throw new Error(result.msg);
      toast.success(result.msg);
      fetchReview(); // Refresh reviews after submission
      resetForm();
    } catch (error) {
      toast.error((error as string) || 'An error occurred');
    }
  };

  const fetchReview = async () => {
    try {
      const token = await getToken();
      const input = {
        eventId,
      };
      const { result, ok } = await getComment(input, token);
      if (!ok) throw new Error(result.msg);
      setReview(result.reviews);
    } catch (error) {
      toast.error((error as string) || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchReview();
  }, []); // Adding eventId as a dependency if it can change

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-lg font-bold mb-4">Comments</h2>
      <div className="flex flex-col space-y-4">
        {review?.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">{item.user.name}</h3>
            <p className="text-gray-700 text-sm mb-2">
              {new Date(item.createdAt)
                .toLocaleString('ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
                .replace(',', '')}
            </p>

            <div className="flex items-center">
              {Array.from({ length: item.rating }, (_, index) => index + 1).map(
                (x) => {
                  return (
                    <svg
                      className="w-4 h-4 text-yellow-300 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  );
                },
              )}
            </div>
            <p className="text-gray-700">{item.comment}</p>
          </div>
        ))}

        <Formik
          initialValues={{ rating: '', comment: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Add a comment</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Rating
                </label>
                <Field
                  name="rating"
                  as="select"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Field>
                <ErrorMessage
                  name="rating"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Comment
                </label>
                <Field
                  name="comment"
                  as="textarea"
                  placeholder="Enter your comment"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="comment"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Komentar;
