import axios from 'axios';

const token = sessionStorage.getItem('authToken');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': token ? `Bearer ${token}` : '',
  },
  withCredentials: true,
});

export default axiosInstance;