import axiosClient from './axiosClient';

const adminApi = {
  // GET /api/admin/dashboard
  getDashboard: () => {
    return axiosClient.get('/admin/dashboard');
  },

  // GET /api/admin/orders
  getOrders: () => {
    return axiosClient.get('/admin/orders');
  },

  // PUT /api/admin/orders/{id}/status
  updateOrderStatus: (id, status) => {
    return axiosClient.put(`/admin/orders/${id}/status`, { status });
  },

  // DELETE /api/admin/orders/{id}
  deleteOrder: (id) => {
    return axiosClient.delete(`/admin/orders/${id}`);
  },

  // PUT /api/admin/users/{id}/password
  updateUserPassword: (id, password) => {
    return axiosClient.put(`/admin/users/${id}/password`, { password });
  },

  // DELETE /api/admin/users/{id}
  deleteUser: (id) => {
    return axiosClient.delete(`/admin/users/${id}`);
  },

  // POST /api/admin/users
  createUser: (data) => {
    return axiosClient.post('/admin/users', data);
  }
};

export default adminApi;
