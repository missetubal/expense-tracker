import { Input, ProfilePhotoSelector } from '../../../../components';
import { useSignUpForm } from './use-signup-form';

export const SignUpForm = () => {
  const { form, onSubmit } = useSignUpForm();

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4'>
      <ProfilePhotoSelector
        onChange={(file) => {
          form.setValue('photo', file);
        }}
      />
      <Input
        id='name'
        label='Name'
        type='text'
        placeholder='john@example.com'
        error={form.formState.errors.email?.message}
        {...form.register('name')}
      />
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
      <Input
        id='confirmPassword'
        label='Confirm password'
        type='password'
        error={form.formState.errors.password?.message}
        {...form.register('confirmPassword')}
      />
      <button type='submit' className='btn-primary'>
        SIGNUP
      </button>
    </form>
  );
};
