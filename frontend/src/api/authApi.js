import axiosClient from './axiosClient';

const authApi = {
  // POST /api/auth/register
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  // POST /api/auth/login
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },

  // POST /api/auth/google
  googleLogin: (data) => {
    return axiosClient.post('/auth/google', data);
  },

  // POST /api/auth/send-otp
  sendOtp: (data) => {
    return axiosClient.post('/auth/send-otp', data);
  },

  // POST /api/auth/verify-otp
  verifyOtp: (data) => {
    return axiosClient.post('/auth/verify-otp', data);
  },

  // POST /api/auth/forgot-password
  forgotPassword: (data) => {
    return axiosClient.post('/auth/forgot-password', data);
  },

  // POST /api/auth/reset-password
  resetPassword: (data) => {
    return axiosClient.post('/auth/reset-password', data);
  },

  // POST /api/auth/logout
  logout: () => {
    return axiosClient.post('/auth/logout');
  }
};

export default authApi;
