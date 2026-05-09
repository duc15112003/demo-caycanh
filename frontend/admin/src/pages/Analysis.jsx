import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';





const Analysis= () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const run = async () => {
      try {
        const dashboardStats = await apiService.getAdminDashboardStats();
        const adminOrders = await apiService.getAdminOrders();
        const allProducts = await apiService.getProducts();
        const allCategories = await apiService.getCategories();
        const adminUsers = await apiService.getAdminUsers();

        setStats(dashboardStats);
        setOrders(adminOrders || []);
        setProducts(allProducts || []);
        setCategories(allCategories || []);
        setUsers(adminUsers || []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Không thể tải dữ liệu phân tích.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const insights = useMemo(() => {
    const formatCurrency = (value) => `đ${Math.round(value).toLocaleString('vi-VN')}`;
    const normalizeStatus = (status) => {
      const raw = (status || 'pending').toString().trim().toLowerCase();
      if (raw === 'cancel' || raw === 'canceled') return 'cancelled';
      if (raw === 'ship' || raw === 'shipping') return 'shipped';
      if (raw === 'deliver' || raw === 'delivering') return 'delivered';
      if (raw === 'process') return 'processing';
      return raw || 'pending';
    };

    const deliveredOrders = orders.filter((order) => normalizeStatus(order.status) === 'delivered');
    const cancelledOrders = orders.filter((order) => normalizeStatus(order.status) === 'cancelled');
    const processingOrders = orders.filter((order) => normalizeStatus(order.status) === 'processing');
    const shippedOrders = orders.filter((order) => normalizeStatus(order.status) === 'shipped');
    const activeProducts = products.filter((product) => product.active);
    const lowStockProducts = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5);
    const outOfStockProducts = products.filter((product) => Number(product.stock || 0) <= 0);
    const enabledUsers = users.filter((user) => user.enabled);

    const averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
    const completionRate = stats.totalOrders > 0 ? (deliveredOrders.length / stats.totalOrders) * 100 : 0;
    const cancelRate = stats.totalOrders > 0 ? (cancelledOrders.length / stats.totalOrders) * 100 : 0;

    const statusCounts = orders.reduce((acc, order) => {
      const key = normalizeStatus(order.status);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const productNameById = new Map();
    const categoryNameById = new Map();
    categories.forEach((category) => {
      if (category.categoryId != null) {
        categoryNameById.set(Number(category.categoryId), category.categoryName || `#${category.categoryId}`);
      }
    });
    products.forEach((product) => {
      if (product.productId != null) {
        productNameById.set(Number(product.productId), product.productName || `#${product.productId}`);
      }
    });

    const productQty = new Map();
    const productRevenue = new Map();
    const categoryRevenue = new Map();
    const customerSpend = new Map();
    const weekdayRevenue = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label) => ({ label, revenue: 0, orders: 0 }));

    orders.forEach((order) => {
      const customerKey = String(order.userId);
      const currentCustomer = customerSpend.get(customerKey) || {
        name: order.fullName || `User ${order.userId}`,
        orders: 0,
        total: 0,
      };
      currentCustomer.orders += 1;
      currentCustomer.total += Number(order.totalAmount || 0);
      customerSpend.set(customerKey, currentCustomer);

      if (typeof order.orderDate === 'string' || typeof order.orderDate === 'number') {
        const date = new Date(order.orderDate);
        if (!Number.isNaN(date.getTime())) {
          const index = (date.getDay() + 6) % 7;
          weekdayRevenue[index].revenue += Number(order.totalAmount || 0);
          weekdayRevenue[index].orders += 1;
        }
      }

      (order.items || []).forEach((item) => {
        const productId = Number(item.productId);
        const quantity = Number(item.quantity || 0);
        const amount = Number(item.price || 0) * quantity;
        productQty.set(productId, (productQty.get(productId) || 0) + quantity);
        productRevenue.set(productId, (productRevenue.get(productId) || 0) + amount);

        const product = products.find((entry) => Number(entry.productId) === productId);
        const categoryName = product?.categoryId != null ? categoryNameById.get(Number(product.categoryId)) || `#${product.categoryId}` : 'Chưa phân loại';
        categoryRevenue.set(categoryName, (categoryRevenue.get(categoryName) || 0) + amount);
      });
    });

    const maxWeekdayRevenue = Math.max(...weekdayRevenue.map((entry) => entry.revenue), 0);

    const topProducts = [...productQty.entries()]
      .map(([productId, quantity]) => ({
        productId,
        name: productNameById.get(productId) || `#${productId}`,
        quantity,
        revenue: productRevenue.get(productId) || 0,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);

    const topCategories = [...categoryRevenue.entries()]
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const topCustomers = [...customerSpend.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const summaryCards = [
      {
        label: 'Doanh thu toàn hệ',
        value: formatCurrency(stats.totalRevenue),
        hint: `${stats.totalOrders.toLocaleString('vi-VN')} đơn hàng đã ghi nhận`,
        tone: 'bg-emerald-100 text-emerald-700',
      },
      {
        label: 'Giá trị đơn trung bình',
        value: formatCurrency(averageOrderValue),
        hint: 'Đo mức chi tiêu trung bình trên mỗi đơn',
        tone: 'bg-blue-100 text-blue-700',
      },
      {
        label: 'Tỉ lệ hoàn tất',
        value: `${completionRate.toFixed(1)}%`,
        hint: `${deliveredOrders.length.toLocaleString('vi-VN')} đơn đã giao thành công`,
        tone: 'bg-indigo-100 text-indigo-700',
      },
      {
        label: 'Tỉ lệ hủy',
        value: `${cancelRate.toFixed(1)}%`,
        hint: `${cancelledOrders.length.toLocaleString('vi-VN')} đơn hủy cần theo dõi`,
        tone: 'bg-rose-100 text-rose-700',
      },
      {
        label: 'Khách hàng hoạt động',
        value: enabledUsers.length.toLocaleString('vi-VN'),
        hint: `${users.length.toLocaleString('vi-VN')} tài khoản đang có trong hệ thống`,
        tone: 'bg-amber-100 text-amber-700',
      },
      {
        label: 'Sản phẩm đang bán',
        value: activeProducts.length.toLocaleString('vi-VN'),
        hint: `${outOfStockProducts.length.toLocaleString('vi-VN')} sản phẩm đã hết hàng`,
        tone: 'bg-teal-100 text-teal-700',
      },
    ];

    return {
      formatCurrency,
      summaryCards,
      statusCounts,
      topProducts,
      topCategories,
      topCustomers,
      weekdayRevenue,
      maxWeekdayRevenue,
      lowStockProducts: lowStockProducts
        .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
        .slice(0, 6),
      outOfStockProducts,
      metrics: {
        totalCustomers: stats.totalCustomers,
        totalProducts: stats.totalProducts,
        processingOrders: processingOrders.length,
        shippedOrders: shippedOrders.length,
        uniqueCustomers: customerSpend.size,
      },
    };
  }, [categories, orders, products, stats, users]);

  if (loading) {
    return <div className="text-center py-8 font-bold text-text-muted">Đang tải dữ liệu phân tích...</div>;
  }

  const statusLabel = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">Phân tích vận hành</h1>
          <p className="text-text-muted text-xs md:text-sm font-medium mt-1">
            Nhìn nhanh hiệu suất đơn hàng, doanh thu, khách hàng và tồn kho trên cùng một màn hình.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <div className="bg-surface px-4 py-3 rounded-2xl border border-border shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Khách mua</p>
            <p className="text-lg font-black text-text mt-1">{insights.metrics.uniqueCustomers.toLocaleString('vi-VN')}</p>
          </div>
          <div className="bg-surface px-4 py-3 rounded-2xl border border-border shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Đơn đang chạy</p>
            <p className="text-lg font-black text-text mt-1">
              {(insights.metrics.processingOrders + insights.metrics.shippedOrders).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {insights.summaryCards.map((card) => (
          <div key={card.label} className="bg-surface p-5 md:p-6 rounded-[2rem] border border-border shadow-sm">
            <div className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${card.tone}`}>
              {card.label}
            </div>
            <p className="text-2xl md:text-3xl font-black text-text tracking-tighter mt-4">{card.value}</p>
            <p className="text-[11px] font-bold mt-3 text-text-muted">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="xl:col-span-2 bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-black text-text">Doanh thu theo ngày trong tuần</h3>
              <p className="text-xs font-bold text-text-muted mt-1">Biểu đồ nhanh để nhìn ngày bán tốt và ngày chững lại.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Đỉnh tuần</p>
              <p className="text-sm font-black text-text mt-1">{insights.formatCurrency(insights.maxWeekdayRevenue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 items-end h-[260px]">
            {insights.weekdayRevenue.map((entry) => {
              const percent = insights.maxWeekdayRevenue > 0 ? Math.max((entry.revenue / insights.maxWeekdayRevenue) * 100, 8) : 8;
              return (
                <div key={entry.label} className="flex flex-col justify-end h-full">
                  <div className="text-center mb-3">
                    <p className="text-[10px] font-black text-text">{entry.orders}</p>
                    <p className="text-[9px] font-bold text-text-muted mt-1">đơn</p>
                  </div>
                  <div className="relative h-full rounded-[1.5rem] bg-slate-50 border border-slate-100 overflow-hidden flex items-end">
                    <div
                      className="w-full rounded-[1.25rem] bg-[linear-gradient(180deg,#16a34a_0%,#4ade80_100%)] transition-all"
                      style={{ height: `${percent}%` }}
                    />
                  </div>
                  <p className="text-center text-[10px] font-black text-text mt-3">{entry.label}</p>
                  <p className="text-center text-[9px] font-bold text-text-muted mt-1 truncate">
                    {entry.revenue > 0 ? insights.formatCurrency(entry.revenue) : '0đ'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Trạng thái đơn hàng</h3>
          <div className="space-y-4">
            {Object.entries(insights.statusCounts).length === 0 ? (
              <p className="text-sm font-bold text-text-muted">Chưa có dữ liệu đơn hàng.</p>
            ) : (
              Object.entries(insights.statusCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => {
                  const percent = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
                  return (
                    <div key={status} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-text">{statusLabel[status] || status}</p>
                          <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">{status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-text">{count}</p>
                          <p className="text-[10px] font-bold text-text-muted mt-1">{percent.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-white overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(percent, 4)}%` }} />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="xl:col-span-2 bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-black text-text">Top sản phẩm bán chạy</h3>
              <p className="text-xs font-bold text-text-muted mt-1">Xếp hạng theo số lượng bán ra và doanh thu góp phần.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Sản phẩm</p>
              <p className="text-sm font-black text-text mt-1">{stats.totalProducts.toLocaleString('vi-VN')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {insights.topProducts.length === 0 ? (
              <p className="text-sm font-bold text-text-muted">Chưa có dữ liệu item trong đơn hàng.</p>
            ) : (
              insights.topProducts.map((product, index) => (
                <div key={product.productId} className="grid grid-cols-[auto,1fr,auto] gap-4 items-center rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-black">
                    #{index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-text truncate">{product.name}</p>
                    <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">Mã #{product.productId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-text">{product.quantity.toLocaleString('vi-VN')} sp</p>
                    <p className="text-[10px] font-bold text-text-muted mt-1">{insights.formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Doanh thu theo danh mục</h3>
          <div className="space-y-4">
            {insights.topCategories.length === 0 ? (
              <p className="text-sm font-bold text-text-muted">Chưa có dữ liệu danh mục.</p>
            ) : (
              insights.topCategories.map((category) => {
                const maxRevenue = insights.topCategories[0]?.revenue || 1;
                const width = (category.revenue / maxRevenue) * 100;
                return (
                  <div key={category.name} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-text">{category.name}</p>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">
                        {insights.formatCurrency(category.revenue)}
                      </p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.max(width, 6)}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Khách hàng giá trị cao</h3>
          <div className="space-y-4">
            {insights.topCustomers.length === 0 ? (
              <p className="text-sm font-bold text-text-muted">Chưa có dữ liệu khách hàng.</p>
            ) : (
              insights.topCustomers.map((customer, index) => (
                <div key={`${customer.name}-${index}`} className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-text truncate">{customer.name}</p>
                      <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">
                        {customer.orders.toLocaleString('vi-VN')} đơn
                      </p>
                    </div>
                    <p className="text-sm font-black text-text">{insights.formatCurrency(customer.total)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Cảnh báo tồn kho</h3>
          <div className="space-y-4">
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-500">Hết hàng</p>
              <p className="text-2xl font-black text-rose-700 mt-2">{insights.outOfStockProducts.length.toLocaleString('vi-VN')}</p>
            </div>
            {insights.lowStockProducts.length === 0 ? (
              <p className="text-sm font-bold text-text-muted">Không có sản phẩm sắp hết hàng.</p>
            ) : (
              insights.lowStockProducts.map((product) => (
                <div key={product.productId || product.productName} className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-text truncate">{product.productName || `#${product.productId}`}</p>
                      <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">
                        Còn lại trong kho
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 font-black text-sm">
                      {Number(product.stock || 0)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Tổng quan nhanh</h3>
          <div className="space-y-4">
            {[
              { label: 'Tổng khách hàng', value: insights.metrics.totalCustomers.toLocaleString('vi-VN') },
              { label: 'Tổng sản phẩm', value: insights.metrics.totalProducts.toLocaleString('vi-VN') },
              { label: 'Đơn đang xử lý', value: insights.metrics.processingOrders.toLocaleString('vi-VN') },
              { label: 'Đơn đang giao', value: insights.metrics.shippedOrders.toLocaleString('vi-VN') },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
                <p className="text-sm font-black text-text">{item.label}</p>
                <p className="text-lg font-black text-text">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
