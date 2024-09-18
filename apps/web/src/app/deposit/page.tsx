'use client';

import FieldText from '@/components/form/fieldText';
import { getToken, getUserId } from '@/lib/server';
import { depositUser } from '@/lib/user';
import { EventInputDeposit } from '@/type/event';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function DepositPage() {
  const router = useRouter();

  const onCreate = async (data: EventInputDeposit) => {
    try {
      const token = await getToken();
      const userId = await getUserId();
      const { result, ok } = await depositUser(
        userId as string,
        data,
        token as string,
      );

      if (!ok) throw new Error(result.msg);

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
      saldo: '',
    },
    onSubmit: (values, actions) => {
      onCreate({ saldo: parseFloat(values.saldo) }); // Ensure saldo is a number
      actions.setSubmitting(false);
    },
  });

  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className="font-manrope flex mb-8 mt-8 w-full items-center justify-center">
        <div className="mx-auto box-border w-[365px] border bg-white p-4">
          <div className="mt-6">
            <div className="font-semibold">
              How much would you like to send?
            </div>
            <div>
              <FieldText
                name="saldo"
                formik={formik}
                label="Saldo"
                type="number"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-[4px] bg-green-700 px-3 py-[6px] text-center font-semibold text-white"
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting} // Disable button while submitting
            >
              Send Rp. {formik.values.saldo}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
