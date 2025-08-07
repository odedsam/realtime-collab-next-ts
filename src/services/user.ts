import { API } from './api';

export type LoginData = {
  email: string;
  password: string;
  remember?: boolean;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export async function login(data: LoginData) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(data: RegisterData) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Logout failed');
  return res.json();
}

export async function fetchUser() {
  const res = await fetch(`${API}/auth/verify`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}
