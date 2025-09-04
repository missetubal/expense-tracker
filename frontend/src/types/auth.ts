export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthHook {
  error: string | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  register: (data: User) => Promise<void>;
}
