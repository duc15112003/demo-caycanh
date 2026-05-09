import axiosClient from './axiosClient';

const categoryApi = {
  // GET /api/categories
  getAllCategories: () => {
    return axiosClient.get('/categories');
  },

  // GET /api/categories/{id}
  getCategoryById: (id) => {
    return axiosClient.get(`/categories/${id}`);
  },

  // POST /api/categories (ADMIN)
  createCategory: (data) => {
    return axiosClient.post('/categories', data);
  },

  // PUT /api/categories/{id} (ADMIN)
  updateCategory: (id, data) => {
    return axiosClient.put(`/categories/${id}`, data);
  },

  // DELETE /api/categories/{id} (ADMIN)
  deleteCategory: (id) => {
    return axiosClient.delete(`/categories/${id}`);
  }
};

export default categoryApi;
