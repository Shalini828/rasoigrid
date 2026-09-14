import { create } from 'zustand';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export type UserRole = 'DONOR' | 'NGO' | 'VOLUNTEER' | 'ADMIN';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: Exclude<UserRole, 'ADMIN'>
  ) => Promise<void>;

  logout: () => void;
}

const storedToken = localStorage.getItem('rasoigrid_token');
const storedUser = localStorage.getItem('rasoigrid_user');

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: Boolean(storedToken),

  login: async (email, password) => {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.detail || 'Login failed'
      );
    }

    const token = data.access_token;

    const payload = JSON.parse(
      atob(token.split('.')[1])
    );

    const userResponse = await fetch(
      `${API_BASE_URL}/api/ngos/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let user: User;

    if (payload.role === 'NGO' && userResponse.ok) {
      user = {
        id: Number(payload.sub),
        name: '',
        email,
        phone: '',
        role: payload.role,
      };
    } else {
      user = {
        id: Number(payload.sub),
        name: '',
        email,
        phone: '',
        role: payload.role,
      };
    }

    localStorage.setItem(
      'rasoigrid_token',
      token
    );

    localStorage.setItem(
      'rasoigrid_user',
      JSON.stringify(user)
    );

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  register: async (
    name,
    email,
    phone,
    password,
    role
  ) => {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.detail || 'Registration failed'
      );
    }
  },

  logout: () => {
    localStorage.removeItem(
      'rasoigrid_token'
    );

    localStorage.removeItem(
      'rasoigrid_user'
    );

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));