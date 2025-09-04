import { API_PATHS } from '../constants/api';
import axiosInstance from './api';

export const uploadImage = async (imageFile: File) => {
  const formData = new FormData();

  formData.append('image', imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.AUTH.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (err) {
    console.error('Error uploading image', err);
    throw err;
  }
};
