import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { getLoginSchema, type LoginSchemaType } from './schema';

interface UseLoginReturn {
  form: UseFormReturn<LoginSchemaType>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginReturn => {
  const form = useForm<LoginSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(getLoginSchema()),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginSchemaType) => {
    console.log(values);
  };

  const handleOnChange = (k: keyof LoginSchemaType, value: string) => {
    form.setValue(k, value);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
