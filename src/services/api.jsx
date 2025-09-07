import Cookies from 'js-cookie';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000", //  backend base URL
  withCredentials: true,           // if you need cookies
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
