import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import axiosInstance from '../utils/api';
import { API_PATHS } from '../constants/api';
import { useNavigate } from 'react-router-dom';
import type { AuthHook, AuthResponse, LoginData, User } from '../types/auth';

export const useAuth = (): AuthHook => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_PATHS.AUTH.LOGIN,
        data
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<{ message: string }>;
        if (serverError && serverError.response) {
          setError(serverError.response.data.message);
        } else {
          setError('Something went wrong. Please try again');
        }
      } else {
        setError('An unexpected error occurred. Please try again');
      }
    }
    setLoading(false);
  };

  const register = async (data: User) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_PATHS.AUTH.REGISTER,
        data
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<{ message: string }>;
        if (serverError && serverError.response) {
          setError(serverError.response.data.message);
        } else {
          setError('Something went wrong. Please try again');
        }
      } else {
        setError('An unexpected error occurred. Please try again');
      }
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return {
    register,
    login,
    logout,
    error,
    loading,
  };
};
