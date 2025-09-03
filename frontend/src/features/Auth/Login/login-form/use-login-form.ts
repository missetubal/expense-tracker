import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { getLoginSchema, type LoginSchemaType } from './schema';
import { useAuth } from '../../../../hooks/useAuth';

interface UseLoginReturn {
  form: UseFormReturn<LoginSchemaType>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginReturn => {
  const { login } = useAuth();
  const form = useForm<LoginSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(getLoginSchema()),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginSchemaType) => {
    try {
      login({ email: values.email, password: values.password });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
