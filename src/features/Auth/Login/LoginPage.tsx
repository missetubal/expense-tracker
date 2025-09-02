import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../components';
import { LoginForm } from './login-form/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your login details to log in
        </p>
        <LoginForm />
        <p className='text-sm text-slate-800 mt-3'>
          Dont have an accout yet?{' '}
          <Link className='font-medium text-primary underline' to='/signup'>
            SignUp
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
