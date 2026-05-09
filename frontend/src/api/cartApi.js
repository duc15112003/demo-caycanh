import axiosClient from './axiosClient';

const cartApi = {
  // GET /api/cart
  getCart: () => {
    return axiosClient.get('/cart');
  },

  // POST /api/cart/items
  addItemToCart: (productId, quantity = 1) => {
    return axiosClient.post('/cart/items', { productId, quantity });
  },

  // PUT /api/cart/items/{cartItemId}
  updateCartItem: (cartItemId, quantity) => {
    return axiosClient.put(`/cart/items/${cartItemId}`, { quantity });
  },

  // DELETE /api/cart/items/{cartItemId}
  removeCartItem: (cartItemId) => {
    return axiosClient.delete(`/cart/items/${cartItemId}`);
  },

  // DELETE /api/cart/clear
  clearCart: () => {
    return axiosClient.delete('/cart/clear');
  }
};

export default cartApi;
