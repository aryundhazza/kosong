import SignUpForm from '@/components/signUpForm';
import Wrapper from '@/components/wrapper';

export default function SignUpPage() {
  return (
    <Wrapper>
      <div className="flex justify-center w-full ">
        <SignUpForm />
      </div>
    </Wrapper>
  );
}
