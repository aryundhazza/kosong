import { getUserId } from './server';
import {
  IUserBuy,
  IUserGetPeserta,
  IUserGetReview,
  IUserReview,
} from '@/type/user';

const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api';

export const createEvent = async (formData: FormData, token: string) => {
  const res = await fetch(`${base_url}/createEvent`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data' // Do not set Content-Type manually when using FormData
    },
  });

  console.log(res, 'res');
  const result = await res.json();
  return { result, ok: res.ok };
};

export const updateEvent = async (formData: FormData, token: string) => {
  const res = await fetch(`${base_url}/updateEvent`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data' // Do not set Content-Type manually when using FormData
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const getMyEvents = async (
  search: string = '',
  page: number = 1,
  pageSize: number = 10,
  category: string = '',
) => {
  const organizerId = await getUserId();
  const res = await fetch(
    `${base_url}/myevents?organizerId=${organizerId}&search=${search}&page=${page}&category=${category}`,
    {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();

  return {
    result,
    events: result.events,
    pagination: result.pagination,
    ok: res.ok,
  };
};

export const getEvents = async (
  search: string = '',
  page: number = 1,
  pageSize: number = 10,
  category: string = '',
) => {
  const res = await fetch(
    `${base_url}/events?search=${search}&page=${page}&category=${category}`,
    {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();

  return {
    result,
    events: result.events,
    pagination: result.pagination,
    ok: res.ok,
  };
};

export const getEventSlug = async (slug: string) => {
  const res = await fetch(`${base_url}/events/${slug}`, {
    next: { revalidate: 0 },
  });
  const result = await res.json();

  return { result, event: result.events, ok: res.ok };
};

export const buyTicket = async (data: IUserBuy | null, token: string) => {
  try {
    const res = await fetch(`${base_url}/buy`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();
    return { result, ok: res.ok };
  } catch (error) {
    console.error('Error buying ticket:', error);
    return { result: null, ok: false };
  }
};

export const postComment = async (data: IUserReview | null, token?: string) => {
  const res = await fetch(`${base_url}/review`, {
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

export const getComment = async (
  data: IUserGetReview | null,
  token?: string,
) => {
  const res = await fetch(`${base_url}/review/${data?.eventId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const getPeserta = async (
  data: IUserGetPeserta | null,
  token?: string,
) => {
  const res = await fetch(`${base_url}/peserta/${data?.organizerId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};
