import axios from 'axios';
// import {getItem} from '@/utils/helpers/persistanceStorage'

const isDevEnv = process.env.NODE_ENV === 'development';
const BASE_URL = process.env.VUE_APP_API_CLIENT_BASE_URL;

// если dev проксируем.
axios.defaults.baseURL = isDevEnv ? '/api' : BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const authorizisationToken = token ? `Bearer ${token}` : '';
  config.headers.Authorization = authorizisationToken;

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response.config.url === 'rest/user/login'
    ) {
      this.$store.dispatch('User/logout').then(() => {
        this.$router.push({ name: 'Login' });
      });
    }

    return Promise.reject(error);
  }
);

export default axios;
