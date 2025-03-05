import axios from 'axios';

const token = sessionStorage.getItem('authToken');

const axiosInstance = axios.create({
  baseURL: 'https://easygrocer-backend.onrender.com/api',
  headers: {
    'Authorization': token ? `Bearer ${token}` : '',
  },
  withCredentials: true,
});

export default axiosInstance;