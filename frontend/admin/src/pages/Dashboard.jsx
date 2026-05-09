import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { apiService } from '../services/api.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await apiService.getAdminDashboardStats();
        const r = await apiService.getAdminRecentOrders(5);
        setStats(s);
        setRecentOrders(r);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100/50 text-amber-600',
      processing: 'bg-orange-100/50 text-orange-600',
      shipped: 'bg-indigo-100/50 text-indigo-600',
      delivered: 'bg-emerald-100/50 text-emerald-600',
      cancelled: 'bg-rose-100/50 text-rose-600',
    };
    return colors[status] || 'bg-slate-100 text-slate-500';
  };



  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  const formatCurrency = (v) => `đ${Math.round(v).toLocaleString()}`;

  const statusText = {
    pending: 'Chờ',
    processing: 'Xử lý',
    shipped: 'Giao',
    delivered: 'Xong',
    cancelled: 'Hủy',
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">Tổng quan</h1>
          <p className="text-text-muted text-xs md:text-sm font-medium mt-1">Chào mừng trở lại, đây là tình hình kinh doanh hôm nay.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-surface px-4 py-2.5 rounded-xl border border-border shadow-sm flex items-center justify-center md:justify-start space-x-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span className="text-[10px] md:text-xs font-bold text-text">21 Th4, 2026</span>
          </div>
          <button className="flex-1 md:flex-none bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all flex items-center justify-center space-x-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span className="text-[10px] md:text-xs">Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Tổng doanh thu', value: formatCurrency(stats?.totalRevenue || 0), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, color: 'bg-emerald-100 text-emerald-500', trend: 'Tổng doanh thu hiện tại' },
          { label: 'Tổng đơn hàng', value: (stats?.totalOrders ?? 0).toLocaleString(), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, color: 'bg-blue-100 text-blue-500', trend: 'Tổng số đơn hàng' },
          { label: 'Khách hàng', value: (stats?.totalCustomers ?? 0).toLocaleString(), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: 'bg-indigo-100 text-indigo-500', trend: 'Tổng số khách hàng' },
          { label: 'Sản phẩm', value: (stats?.totalProducts ?? 0).toLocaleString(), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, color: 'bg-orange-100 text-orange-500', trend: 'Tổng sản phẩm đang có' },
        ].map((item, i) => (
          <div key={i} className="bg-surface p-5 md:p-6 rounded-[2rem] border border-border shadow-sm flex flex-col justify-between min-h-[140px] md:min-h-[160px] group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-wider mb-2">{item.label}</p>
                <p className="text-xl md:text-2xl font-black text-text tracking-tighter">{item.value}</p>
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
            </div>
            <p className="text-[10px] font-bold mt-4 text-text-muted">{item.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart section */}
        <div className="lg:col-span-2 bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-lg md:text-xl font-black text-text">Biểu đồ doanh thu</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-4 text-[9px] font-black uppercase tracking-widest text-text-muted">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-primary rounded-full"></div>
                  <span>Tuần này</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-slate-300 rounded-full border-t border-dashed"></div>
                  <span>Tuần trước</span>
                </div>
              </div>
              <select className="bg-slate-50 border-none text-[10px] font-bold rounded-xl px-4 py-2 text-text-muted focus:ring-0 cursor-pointer">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
          </div>
          <div className="h-[280px] md:h-[380px]">
             <div className="relative h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] rounded-xl flex items-end justify-between px-2 md:px-4">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,80 Q15,75 25,65 T45,70 T65,45 T85,55 T100,50" fill="none" stroke="var(--color-primary)" strokeWidth="0.8" />
                  <path d="M0,80 Q15,75 25,65 T45,70 T65,45 T85,55 T100,50 V100 H0 Z" fill="url(#chartGradient)" opacity="0.1" />
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" />
                      <stop offset="100%" stopColor="white" />
                    </linearGradient>
                  </defs>
                </svg>
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                  <span key={day} className="text-[9px] font-black text-text-muted pb-2">{day}</span>
                ))}
             </div>
          </div>
        </div>

        {/* Recent Orders section */}
        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg md:text-xl font-black text-text">Đơn hàng mới</h3>
            <button className="text-primary text-[10px] font-black hover:underline tracking-tight uppercase">Tất cả</button>
          </div>
          <div className="space-y-6">
            {recentOrders.map((order, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text tracking-tighter">#{order.id}</span>
                    <span className="text-xs font-bold text-text-muted mt-0.5 line-clamp-1">{order.customerName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`block text-[9px] font-black px-2 py-0.5 rounded-lg mb-1 inline-block ${getStatusBadge(order.status)} uppercase tracking-tighter`}>
                    {statusText[order.status] || order.status}
                  </span>
                  <p className="text-xs font-black text-text">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
