import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { getSignUpSchema, type SignUpSchemaType } from './schema';
import { uploadImage } from '../../../../utils/uploadImage';
import { useAuth } from '../../../../hooks/useAuth';

interface UseSignUpReturn {
  form: UseFormReturn<SignUpSchemaType>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const useSignUpForm = (): UseSignUpReturn => {
  const { register } = useAuth();
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

  const onSubmit = async (values: SignUpSchemaType) => {
    let photoUrl = '';
    if (values.photo) {
      const response = await uploadImage(values.photo as File);
      photoUrl = response.imageUrl;
    }

    register({
      email: values.email,
      password: values.password,
      fullName: values.name,
      profileImageUrl: photoUrl,
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
