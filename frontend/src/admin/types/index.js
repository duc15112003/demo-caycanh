// API Response types
// export interface ApiResponse<T> {
//   data: T;
//   message?: string;
//   success: boolean;
// }

// export interface ApiError {
//   code: string;
//   message: string;
//   details?: any;
// }

// Order types
// export interface Order {
//   id: string;
//   customerId: string;
//   customerName: string;
//   date: string;
//   total: number;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
// }

// export interface OrderListResponse {
//   orders: Order[];
//   total: number;
//   page: number;
//   limit: number;
// }

// Product types
// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   stock: number;
//   image?: string;
//   category: string;
// }

// export interface ProductListResponse {
//   products: Product[];
//   total: number;
//   page: number;
//   limit: number;
// }

// Customer types
// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   orderCount: number;
//   totalSpent: number;
//   avatar?: string;
// }

// export interface CustomerListResponse {
//   customers: Customer[];
//   total: number;
//   page: number;
//   limit: number;
// }

// Dashboard types
// export interface DashboardStats {
//   totalOrders: number;
//   totalRevenue: number;
//   totalCustomers: number;
//   totalProducts: number;
// }

// export interface RecentOrder {
//   id: string;
//   customerName: string;
//   total: number;
//   status: Order['status'];
//   date: string;
// }

// Note: TypeScript interfaces are now removed. Using JSDoc-style comments for reference only.
