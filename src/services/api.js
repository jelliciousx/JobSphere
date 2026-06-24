import axios from 'axios';

const isProduction = window.location.hostname !== 'localhost';

const api = axios.create({
  baseURL: isProduction 
    ? 'https://jobsphere-backend-nr7w3492k-ctrlfreaks1.vercel.app/api'
    : 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;