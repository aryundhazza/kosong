'use client';

import LoginPage from '@/app/login/page';
import { verifyUser } from '@/lib/user';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function VerifyPage() {
  const params = useParams<{ token: string }>();
  const onVerify = async () => {
    try {
      const { result, ok } = await verifyUser(params.token);
      if (!ok) throw result.msg;
      toast.success(result.msg);
    } catch (err: any) {
      toast.error(err.message ?? err);
    }
  };

  useEffect(() => {
    onVerify();
  }, []);

  return (
    <div className="flex h-full w-full justify-center items-center">
      {/* <h1>Verification Page</h1> */}
      <LoginPage />
    </div>
  );
}
