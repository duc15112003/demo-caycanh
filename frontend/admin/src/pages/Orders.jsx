import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiService.getAdminOrders();
        const mapped = (data || []).map((o) => ({
          id: String(o.orderId),
          customerId: String(o.userId),
          customerName: o.fullName || `User ${o.userId}`,
          date: o.orderDate ? new Date(o.orderDate).toISOString().slice(0, 10) : '',
          total: o.totalAmount ?? 0,
          status: ((o.status || 'pending').toString().trim().toLowerCase() === 'cancel' ? 'cancelled' : (o.status || 'pending').toString().trim().toLowerCase()),
        }));
        setOrders(mapped);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await apiService.updateAdminOrderStatus(Number(orderId), newStatus);
      setOrders(orders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: (updated.status || newStatus).toString().trim().toLowerCase(),
            }
          : order
      ));
      toast.success('Đã cập nhật trạng thái đơn hàng.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cập nhật trạng thái thất bại.');
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      try {
        await apiService.deleteAdminOrder(Number(orderId));
        setOrders(orders.filter(order => order.id !== orderId));
        toast.success('Đã xóa đơn hàng thành công!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Xóa đơn hàng thất bại.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-text tracking-tight">Đơn hàng</h1>
        <p className="text-text-muted text-sm font-medium mt-1">Quản lý và cập nhật trạng thái đơn hàng cây cảnh.</p>
      </div>

      <div className="bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest">Mã đơn</th>
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest">Khách hàng</th>
                <th className="hidden sm:table-cell px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Ngày</th>
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest text-right">Tổng tiền</th>
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 md:px-8 py-5 text-sm font-black text-text tracking-tighter">{order.id}</td>
                  <td className="px-6 md:px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="hidden xs:flex w-8 h-8 bg-slate-100 rounded-lg items-center justify-center text-[10px] font-black text-text-muted">
                        {order.customerName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-text-muted line-clamp-1">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 md:px-8 py-5 text-center text-xs font-bold text-slate-400">
                    {order.date}
                  </td>
                  <td className="px-6 md:px-8 py-5 text-right font-black text-text text-sm whitespace-nowrap">
                    đ{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 md:px-8 py-5 text-center">
                    {editingId === order.id ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-white border border-primary/20 rounded-xl px-2 py-1 text-[10px] md:text-xs font-bold text-text focus:ring-0 outline-none shadow-sm shadow-primary/5"
                        autoFocus
                        onBlur={() => setEditingId(null)}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingId(order.id)}
                        className={`px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-transform active:scale-95 ${getStatusBadge(order.status)}`}
                      >
                        {order.status === 'delivered' ? 'Đã giao' :
                         order.status === 'pending' ? 'Chờ xử lý' :
                         order.status === 'processing' ? 'Đang xử lý' :
                         order.status === 'shipped' ? 'Đang giao' :
                         order.status === 'cancelled' ? 'Đã hủy' : order.status}
                      </button>
                    )}
                  </td>
                  <td className="px-6 md:px-8 py-5 text-center">
                    <div className="flex items-center justify-center space-x-1 md:space-x-2 transition-opacity">
                      <button
                        onClick={() => setEditingId(order.id)}
                        className="p-1.5 md:p-2 text-primary hover:bg-primary-light rounded-xl transition-colors"
                        title="Cập nhật trạng thái"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 md:p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Xóa đơn hàng"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
