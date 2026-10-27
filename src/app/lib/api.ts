// lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('API URL:', process.env.NEXT_PUBLIC_STRAPI_URL);

export default api;
