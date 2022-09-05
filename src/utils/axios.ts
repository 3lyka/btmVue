import { useUserStore } from '@/stores/user';
import axios from 'axios';

const isDevEnv = process.env.NODE_ENV === 'development';
const BASE_URL = process.env.VUE_APP_API_CLIENT_BASE_URL;

// если devEnv проксируем от ошибок CORS. Конфигурация в vue.config.js, devServer.
axios.defaults.baseURL = isDevEnv ? '/api' : BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  if (config?.headers) {
    const { token } = useUserStore();
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return config;
});

export default axios;
