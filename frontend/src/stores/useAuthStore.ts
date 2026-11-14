import { create } from 'zustand';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export type UserRole =
  | 'DONOR'
  | 'NGO'
  | 'VOLUNTEER'
  | 'ADMIN';

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

/* ---------------------------------------
   Restore saved authentication
---------------------------------------- */

const storedToken =
  localStorage.getItem('rasoigrid_token');

const storedUser =
  localStorage.getItem('rasoigrid_user');

let initialUser: User | null = null;

try {
  initialUser = storedUser
    ? JSON.parse(storedUser)
    : null;
} catch {
  localStorage.removeItem('rasoigrid_user');
  initialUser = null;
}

/* ---------------------------------------
   Auth Store
---------------------------------------- */

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: initialUser,
  isAuthenticated: Boolean(
    storedToken && initialUser
  ),

  /* ---------------------------------------
     LOGIN
  ---------------------------------------- */

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

    if (!token) {
      throw new Error(
        'Login succeeded but no access token was returned'
      );
    }

    /* ---------------------------------------
       Read JWT payload
    ---------------------------------------- */

    let payload: {
      sub?: string;
      role?: UserRole;
      exp?: number;
    };

    try {
      payload = JSON.parse(
        atob(token.split('.')[1])
      );
    } catch {
      throw new Error(
        'Invalid authentication token'
      );
    }

    /* ---------------------------------------
       Validate user ID
    ---------------------------------------- */

    if (!payload.sub) {
      throw new Error(
        'Authentication token does not contain a user ID'
      );
    }

    /* ---------------------------------------
       Validate role
    ---------------------------------------- */

    const allowedRoles: UserRole[] = [
      'DONOR',
      'NGO',
      'VOLUNTEER',
      'ADMIN',
    ];

    if (
      !payload.role ||
      !allowedRoles.includes(payload.role)
    ) {
      throw new Error(
        'Authentication token contains an invalid user role'
      );
    }

    /* ---------------------------------------
       Create authenticated user
    ---------------------------------------- */

    let user: User = {
      id: Number(payload.sub),
      name: '',
      email,
      phone: '',
      role: payload.role,
    };

    /* ---------------------------------------
       Load account details (name, phone)
    ---------------------------------------- */

    try {
      const meResponse = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (meResponse.ok) {
        const me = await meResponse.json();
        user = {
          ...user,
          name: me.name ?? '',
          phone: me.phone ?? '',
        };
      }
    } catch {
      // Name and phone are for display only; login still succeeds.
    }

    /* ---------------------------------------
       Persist authentication
    ---------------------------------------- */

    localStorage.setItem(
      'rasoigrid_token',
      token
    );

    localStorage.setItem(
      'rasoigrid_user',
      JSON.stringify(user)
    );

    /* ---------------------------------------
       Update Zustand state
    ---------------------------------------- */

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  /* ---------------------------------------
     REGISTER
  ---------------------------------------- */

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

  /* ---------------------------------------
     LOGOUT
  ---------------------------------------- */

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