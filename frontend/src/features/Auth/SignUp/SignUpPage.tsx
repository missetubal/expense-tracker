import { Link } from 'react-router-dom';
import { AuthLayout, ProfilePhotoSelector } from '../../../components';
import { SignUpForm } from './signup-form/SignUpForm';

export const SignUpPage = () => {
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>
        <SignUpForm />
        <p className='text-sm text-slate-800 mt-3'>
          Already have a{' '}
          <Link className='font-medium text-primary underline' to='/login'>
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
