import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';

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

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'USER',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const users = await apiService.getAdminUsers();
        const orders = await apiService.getAdminOrders();

        const spendingByUser = new Map();

        (orders || []).forEach((order) => {
          if (normalizeOrderStatus(order.status) === 'cancelled') {
            return;
          }

          const userId = String(order.userId);
          const current = spendingByUser.get(userId) || { orderCount: 0, totalSpent: 0 };
          current.orderCount += 1;
          current.totalSpent += Number(order.totalAmount || 0);
          spendingByUser.set(userId, current);
        });

        const mapped = (users || []).map((u) => ({
          id: String(u.userId),
          name: u.fullName || '(Khong ten)',
          email: u.email || '',
          phone: u.phone || '',
          orderCount: spendingByUser.get(String(u.userId))?.orderCount || 0,
          totalSpent: spendingByUser.get(String(u.userId))?.totalSpent || 0,
        }));

        setCustomers(mapped);
        setFilteredCustomers(mapped);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error(error instanceof Error ? error.message : 'Khong the tai danh sach khach hang.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    try {
      const res = await apiService.createAdminUser({
        fullName: newCustomer.name,
        email: newCustomer.email,
        password: newCustomer.password,
        phone: newCustomer.phone || null,
        role: newCustomer.role,
      });

      const u = res.user;
      const customer = {
        id: String(u.userId),
        name: u.fullName || newCustomer.name,
        email: u.email || newCustomer.email,
        phone: u.phone || newCustomer.phone,
        orderCount: 0,
        totalSpent: 0,
      };

      const updatedCustomers = [customer, ...customers];
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setIsModalOpen(false);
      setNewCustomer({ name: '', email: '', phone: '', password: '', role: 'USER' });
      toast.success(res?.message || 'Them khach hang thanh cong!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Them khach hang that bai.');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredCustomers(customers);
        return;
      }

      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, customers]);

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  if (loading) {
    return <div className="text-center py-8">Dang tai...</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">Khach hang</h1>
          <p className="text-text-muted text-xs md:text-sm font-medium mt-1">Danh sach khach hang mua cay canh cua ban.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-primary/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto text-sm md:text-base"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Them khach hang</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative group flex-1 max-w-2xl">
          <span className="absolute inset-y-0 left-4 flex items-center text-text-muted group-focus-within:text-primary transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Tim theo ten, email hoac so dien thoai..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm text-text"
          />
        </div>
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-6 py-3 bg-white border border-border rounded-xl text-[10px] font-black text-text uppercase tracking-widest hover:bg-slate-50 transition-colors">Loc VIP</button>
          <button className="flex-1 lg:flex-none px-6 py-3 bg-white border border-border rounded-xl text-[10px] font-black text-text uppercase tracking-widest hover:bg-slate-50 transition-colors">Xuat CSV</button>
        </div>
      </div>

      <div className="bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest">Khach hang</th>
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest">Lien he</th>
                <th className="hidden sm:table-cell px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest text-center">So don</th>
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest text-right">Tong chi tieu</th>
                <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 md:px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="hidden xs:flex w-10 h-10 md:w-12 md:h-12 bg-primary-light text-primary rounded-2xl items-center justify-center font-black text-sm group-hover:rotate-6 transition-transform">
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-text">{customer.name}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter mt-0.5">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-5">
                    <p className="text-sm font-bold text-text-muted line-clamp-1">{customer.email}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">{customer.phone}</p>
                  </td>
                  <td className="hidden sm:table-cell px-6 md:px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-text">{customer.orderCount}</span>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-right font-black text-text text-sm whitespace-nowrap">
                    {customer.totalSpent.toLocaleString()}d
                  </td>
                  <td className="px-6 md:px-8 py-5 text-center">
                    <button className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="absolute inset-0 bg-text/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-surface shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-8 sm:py-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">Them khach hang moi</h2>
                <p className="mt-1 text-xs sm:text-sm font-medium text-text-muted">Can doi lai form de de nhap tren ca mobile va desktop.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="shrink-0 rounded-xl p-2 transition-colors hover:bg-slate-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
              <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-text-muted">Ho va ten</label>
                  <input
                    required
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-5 sm:py-4 sm:text-base"
                    placeholder="Vi du: Nguyen Van A"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-text-muted">Email</label>
                  <input
                    required
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-5 sm:py-4 sm:text-base"
                    placeholder="nguyen@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-text-muted">So dien thoai</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-5 sm:py-4 sm:text-base"
                    placeholder="0123 456 789"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-text-muted">Mat khau</label>
                  <input
                    required
                    type="password"
                    value={newCustomer.password}
                    onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-5 sm:py-4 sm:text-base"
                    placeholder="Toi thieu 6 ky tu"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-text-muted">Vai tro</label>
                  <select
                    value={newCustomer.role}
                    onChange={(e) => setNewCustomer({ ...newCustomer, role: e.target.value })}
                    className="w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-5 sm:py-4 sm:text-base"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-2xl border border-border bg-white px-5 py-3.5 font-black text-text transition-colors hover:bg-slate-50 sm:w-auto"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary px-6 py-3.5 font-black text-white shadow-xl shadow-primary/30 transition-all hover:opacity-90 sm:min-w-[220px] sm:w-auto"
                >
                  Xac nhan them
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
