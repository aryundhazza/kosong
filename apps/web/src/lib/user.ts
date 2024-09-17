import { IUserBuy, IUserLogin, IUserSignUp } from '@/type/user';
import { IUserDeposit } from '../type/user';
const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api';

export const signUpUser = async (data: IUserSignUp) => {
  const res = await fetch(`${base_url}/users/create`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const loginUser = async (data: IUserLogin) => {
  const res = await fetch(`${base_url}/users/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const verifyUser = async (token: string) => {
  const res = await fetch(`${base_url}/users/verify`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const getProfile = async (
  id: string | undefined,
  token: string | undefined,
) => {
  const res = await fetch(`${base_url}/users/profile/${id}`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();

  return { result, ok: res.ok };
};

export const updateProfile = async (formData: FormData, token: string) => {
  const res = await fetch(`${base_url}/users/avatar`, {
    method: 'PATCH',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const depositUser = async (
  id: string,
  data: IUserDeposit | null,
  token: string,
) => {
  const res = await fetch(`${base_url}/users/deposit/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};
