import axiosClient from './axiosClient';

const userApi = {
  // GET /api/user (ADMIN) - without email param
  getAllUsers: () => {
    return axiosClient.get('/user');
  },

  // GET /api/user?email={email} (ADMIN)
  getUserByEmail: (email) => {
    return axiosClient.get('/user', { params: { email } });
  },

  // GET /api/user/me
  getMe: () => {
    return axiosClient.get('/user/me');
  },

  // GET /api/user/orders
  getMyOrderHistory: () => {
    return axiosClient.get('/user/orders');
  },

  // PUT /api/user/me/password
  changeMyPassword: (data) => {
    return axiosClient.put('/user/me/password', data);
  }
};

export default userApi;
