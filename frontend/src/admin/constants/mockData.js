// Mock data cho development
export const mockOrders = [
  {
    id: 'ORD001',
    customerId: 'CUST001',
    customerName: 'Nguyễn Văn A',
    date: '2024-04-20',
    total: 1250000,
    status: 'delivered',
  },
  {
    id: 'ORD002',
    customerId: 'CUST002',
    customerName: 'Trần Thị B',
    date: '2024-04-19',
    total: 850000,
    status: 'processing',
  },
  {
    id: 'ORD003',
    customerId: 'CUST003',
    customerName: 'Lê Văn C',
    date: '2024-04-18',
    total: 1400000,
    status: 'shipped',
  },
  {
    id: 'ORD004',
    customerId: 'CUST004',
    customerName: 'Phạm Thị D',
    date: '2024-04-17',
    total: 450000,
    status: 'pending',
  },
  {
    id: 'ORD005',
    customerId: 'CUST005',
    customerName: 'Hoàng Văn E',
    date: '2024-04-16',
    total: 2100000,
    status: 'cancelled',
  },
];

export const mockProducts = [
  {
    id: 'PROD001',
    name: 'Cây Bonsai Tùng La Hán',
    price: 1500000,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1512428813833-df4219579a1f?auto=format&fit=crop&w=300&q=80',
    category: 'Cây cảnh',
  },
  {
    id: 'PROD002',
    name: 'Sen Đá Kim Cương',
    price: 85000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=300&q=80',
    category: 'Sen đá',
  },
  {
    id: 'PROD003',
    name: 'Chậu Sứ Men Trắng',
    price: 120000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80',
    category: 'Chậu cây',
  },
  {
    id: 'PROD004',
    name: 'Bộ Dụng Cụ Làm Vườn 5 Món',
    price: 350000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c674?auto=format&fit=crop&w=300&q=80',
    category: 'Dụng cụ',
  },
  {
    id: 'PROD005',
    name: 'Phân Bón Hữu Cơ Nhật Bản',
    price: 95000,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=300&q=80',
    category: 'Phụ kiện',
  },
];

export const mockCustomers = [
  {
    id: 'CUST001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    orderCount: 3,
    totalSpent: 4750000,
  },
  {
    id: 'CUST002',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0987654321',
    orderCount: 1,
    totalSpent: 850000,
  },
  {
    id: 'CUST003',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0111111111',
    orderCount: 2,
    totalSpent: 1400000,
  },
  {
    id: 'CUST004',
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0222222222',
    orderCount: 1,
    totalSpent: 450000,
  },
  {
    id: 'CUST005',
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    phone: '0333333333',
    orderCount: 4,
    totalSpent: 6500000,
  },
];

export const mockDashboardStats = {
  totalOrders: 342,
  totalRevenue: 124500000,
  totalCustomers: 1204,
  totalProducts: 50,
};


export const mockRecentOrders = mockOrders.slice(0, 5);
