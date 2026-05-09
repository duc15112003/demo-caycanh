import axiosClient from './axiosClient';

const paymentApi = {
  createVnpayPayment: (data) => {
    return axiosClient.post('/payment/create', data);
  }
};

export default paymentApi;
