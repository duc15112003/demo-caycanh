import axiosClient from './axiosClient';

const orderApi = {
  // POST /api/checkout
  checkout: (data) => {
    return axiosClient.post('/checkout', data);
  },

  // POST /api/payment
  createPayment: (data) => {
    return axiosClient.post('/payment', data);
  },

  // GET /api/payment/{paymentId}
  getPaymentDetails: (paymentId) => {
    return axiosClient.get(`/payment/${paymentId}`);
  },

  // GET /api/payment/order/{orderId}
  getPaymentsByOrder: (orderId) => {
    return axiosClient.get(`/payment/order/${orderId}`);
  },

  // GET /api/orders
  getMyOrders: () => {
    return axiosClient.get('/orders');
  },

  // GET /api/orders/{orderId}
  getOrderDetails: (orderId) => {
    return axiosClient.get(`/orders/${orderId}`);
  },

  // GET /api/orders/{orderId}/items
  getOrderItems: (orderId) => {
    return axiosClient.get(`/orders/${orderId}/items`);
  }
};

export default orderApi;
