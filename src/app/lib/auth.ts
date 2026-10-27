// lib/auth.ts
import api from './api';

export const login = async (identifier: string, password: string) => {
  const res = await api.post('/api/auth/local', { identifier, password });
  return res.data; // { jwt, user }
};

export const getProfile = async (jwt: string) => {
  const res = await api.get('/api/users/me', {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res.data;
};
