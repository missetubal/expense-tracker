import { Input } from '../../../../components';
import { useLoginForm } from './use-login-form';

export const LoginForm = () => {
  const { form, onSubmit } = useLoginForm();

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4'>
      <Input
        id='email'
        label='Email Address'
        type='text'
        placeholder='john@example.com'
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <Input
        id='password'
        label='Password'
        type='password'
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />

      <button type='submit' className='btn-primary'>
        LOGIN
      </button>
    </form>
  );
};
