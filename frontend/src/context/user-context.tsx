import {
  createContext,
  useState,
  useMemo,
  type PropsWithChildren,
} from 'react';
import type { User } from '../types/auth';

type UserContextType = {
  user: User | null;
  updateUser: (userData: User) => void;
  clearUser: () => void;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      updateUser,
      clearUser,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
