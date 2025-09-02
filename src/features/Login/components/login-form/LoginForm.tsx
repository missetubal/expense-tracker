import { Input } from '../../../../components';
import { useLoginForm } from './use-login-form';

export const LoginForm = () => {
  const { form, onSubmit } = useLoginForm();
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        id="email"
        label="Email Address"
        type="text"
        {...form.register('email')}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        {...form.register('password')}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
  );
};
