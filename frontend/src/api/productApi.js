import axiosClient from './axiosClient';

const productApi = {
  // GET /api/home?plantLimit=5&potLimit=5&accessoryLimit=5
  getHomeData: (params) => {
    return axiosClient.get('/home', { params });
  },

  // GET /api/products
  getAllProducts: () => {
    return axiosClient.get('/products');
  },

  // GET /api/products/{id}
  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  // GET /api/products/search?keyword={keyword}
  searchProducts: (keyword) => {
    return axiosClient.get('/products/search', { params: { keyword } });
  },

  // GET /api/products/category/{categoryId}
  getProductsByCategory: (categoryId) => {
    return axiosClient.get(`/products/category/${categoryId}`);
  },

  // POST /api/products (ADMIN)
  createProduct: (data) => {
    return axiosClient.post('/products', data);
  },

  // PUT /api/products/{id} (ADMIN)
  updateProduct: (id, data) => {
    return axiosClient.put(`/products/${id}`, data);
  },

  // DELETE /api/products/{id} (ADMIN)
  deleteProduct: (id) => {
    return axiosClient.delete(`/products/${id}`);
  }
};

export default productApi;
