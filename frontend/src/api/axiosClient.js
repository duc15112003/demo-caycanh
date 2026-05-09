import axios from 'axios';
import store from '../redux/store';
import { parseApiErrorDetails } from '../utils/errorCodes';
import { logoutSuccess } from '../redux/slices/authSlice';
import { API_BASE_URL } from '../config/apiConfig';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Backend quan ly phien dang nhap bang HttpOnly cookie.
    // Frontend khong doc cookie va khong tu gan Authorization header.
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { customMessage, customErrorCode } = parseApiErrorDetails(error);
    error.customMessage = customMessage;
    error.customErrorCode = customErrorCode;

    if (error.response?.status === 401) {
      store.dispatch(logoutSuccess());
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
