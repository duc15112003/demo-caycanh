import axiosClient from './axiosClient';

const wishlistApi = {
  // GET /api/wishlist
  getWishlist: () => {
    return axiosClient.get('/wishlist');
  },

  // POST /api/wishlist/{productId}
  addToWishlist: (productId) => {
    return axiosClient.post(`/wishlist/${productId}`);
  },

  // DELETE /api/wishlist/{productId}
  removeFromWishlist: (productId) => {
    return axiosClient.delete(`/wishlist/${productId}`);
  }
};

export default wishlistApi;
