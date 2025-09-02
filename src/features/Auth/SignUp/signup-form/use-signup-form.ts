import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { getSignUpSchema, type SignUpSchemaType } from './schema';

interface UseSignUpReturn {
  form: UseFormReturn<SignUpSchemaType>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const useSignUpForm = (): UseSignUpReturn => {
  const form = useForm<SignUpSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(getSignUpSchema()),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  const onSubmit = (values: SignUpSchemaType) => {
    console.log(values);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
