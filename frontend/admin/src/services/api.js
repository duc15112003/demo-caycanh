import axios from 'axios';
import { API_BASE_URL } from '../constants/config.js';
import { errorMap } from '../constants/errorMap.js';

function normalizeOrderStatus(status) {
  const raw = (status || '').toString().trim().toLowerCase();
  if (raw === 'cancel' || raw === 'canceled') return 'cancelled';
  if (raw === 'ship' || raw === 'shipping') return 'shipped';
  if (raw === 'deliver' || raw === 'delivering') return 'delivered';
  if (raw === 'process' || raw === 'processing') return 'processing';
  if (raw === 'pending') return 'pending';
  if (raw === 'shipped') return 'shipped';
  if (raw === 'delivered') return 'delivered';
  if (raw === 'cancelled') return 'cancelled';
  return 'pending';
}

function toIsoDateString(input) {
  if (!input) return '';
  if (typeof input === 'string') return input;
  if (typeof input === 'number') return new Date(input).toISOString();
  try {
    return JSON.stringify(input);
  } catch {
    return String(input);
  }
}

function buildProductFormData(input) {
  const fd = new FormData();
  fd.append('categoryId', String(input.categoryId));
  fd.append('productName', input.productName);
  fd.append('description', input.description ?? '');
  fd.append('careGuide', input.careGuide ?? '');
  fd.append('price', String(input.price));
  fd.append('stock', String(input.stock));
  fd.append('active', String(input.active));
  if (input.image) fd.append('image', input.image);
  return fd;
}

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 401:
              localStorage.removeItem('authToken');
              localStorage.removeItem('isAuthenticated');
              window.dispatchEvent(new Event('auth:changed'));
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
              break;
            case 403:
              throw new Error('Bạn không có quyền truy cập.');
            case 500:
              throw new Error('Lỗi hệ thống. Vui lòng thử lại sau.');
            default:
              break;
          }
        } else if (error.code === 'NETWORK_ERROR') {
          throw new Error(errorMap['NETWORK_ERROR']);
        }
        throw error;
      }
    );
  }

  async request(config) {
    try {
      const response = await this.api.request(config);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi không xác định.');
    }
  }

  async login(email, password) {
    return this.request({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
  }

  async logout() {
    return this.request({
      method: 'POST',
      url: '/auth/logout',
    });
  }

  async getMe() {
    return this.request({
      method: 'GET',
      url: '/user/me',
    });
  }

  async verifySession() {
    try {
      const me = await this.getMe();
      return { authenticated: true, user: me };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return { authenticated: false, user: null };
      }
      throw error;
    }
  }

  async updateAdminUserPassword(userId, password) {
    return this.request({
      method: 'PUT',
      url: `/admin/users/${userId}/password`,
      data: { password },
    });
  }

  async getAdminDashboardStats() {
    const stats = await this.request({
      method: 'GET',
      url: '/admin/dashboard',
    });

    const products = await this.request({
      method: 'GET',
      url: '/products',
    });

    return {
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      totalCustomers: stats.totalCustomers,
      totalProducts: Array.isArray(products) ? products.length : 0,
    };
  }

  async getAdminRecentOrders(limit = 5) {
    const orders = await this.request({
      method: 'GET',
      url: '/admin/orders',
    });

    const sorted = [...(orders || [])].sort((a, b) => {
      const ad = new Date(toIsoDateString(a.orderDate) || 0).getTime();
      const bd = new Date(toIsoDateString(b.orderDate) || 0).getTime();
      return bd - ad;
    });

    return sorted.slice(0, limit).map((o) => ({
      id: String(o.orderId),
      customerName: o.fullName || `User ${o.userId}`,
      total: o.totalAmount,
      status: normalizeOrderStatus(o.status),
      date: toIsoDateString(o.orderDate),
    }));
  }

  async getAdminOrders() {
    return this.request({
      method: 'GET',
      url: '/admin/orders',
    });
  }

  async updateAdminOrderStatus(orderId, status) {
    return this.request({
      method: 'PUT',
      url: `/admin/orders/${orderId}/status`,
      data: { status },
    });
  }

  async deleteAdminOrder(orderId) {
    return this.request({
      method: 'DELETE',
      url: `/admin/orders/${orderId}`,
    });
  }

  async getAdminUsers() {
    return this.request({
      method: 'GET',
      url: '/user',
    });
  }

  async deleteAdminUser(userId) {
    return this.request({
      method: 'DELETE',
      url: `/admin/users/${userId}`,
    });
  }

  async createAdminUser(input) {
    return this.request({
      method: 'POST',
      url: '/admin/register',
      data: input,
    });
  }

  async getCategories() {
    return this.request({
      method: 'GET',
      url: '/categories',
    });
  }

  async getProducts() {
    return this.request({
      method: 'GET',
      url: '/products',
    });
  }

  async createProduct(input) {
    if (input.image instanceof File) {
      const fd = buildProductFormData({
        categoryId: input.categoryId,
        productName: input.productName,
        description: input.description ?? null,
        careGuide: input.careGuide ?? null,
        price: input.price,
        stock: input.stock,
        image: input.image,
        active: input.active,
      });
      return this.request({
        method: 'POST',
        url: '/products',
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return this.request({
      method: 'POST',
      url: '/products',
      data: input,
    });
  }

  async updateProduct(productId, input) {
    if (input.image instanceof File) {
      const fd = buildProductFormData({
        categoryId: input.categoryId,
        productName: input.productName,
        description: input.description ?? null,
        careGuide: input.careGuide ?? null,
        price: input.price,
        stock: input.stock,
        image: input.image,
        active: input.active,
      });
      return this.request({
        method: 'PUT',
        url: `/products/${productId}`,
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return this.request({
      method: 'PUT',
      url: `/products/${productId}`,
      data: input,
    });
  }

  async deleteProduct(productId) {
    return this.request({
      method: 'DELETE',
      url: `/products/${productId}`,
    });
  }
}

export const apiService = new ApiService();
