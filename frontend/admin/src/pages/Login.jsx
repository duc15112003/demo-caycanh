import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      let res;
      try {
        res = await apiService.login(email, password);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Dang nhap that bai.';
        toast.error(msg, { toastId: 'admin-login-error' });
        return;
      }

      const session = await apiService.verifySession();

      if (!session.authenticated) {
        throw new Error('Đăng nhập chưa tạo được phiên hợp lệ. Kiểm tra lại cookie hoặc cấu hình CORS.');
      }

      localStorage.setItem('isAuthenticated', 'true');
      window.dispatchEvent(new Event('auth:changed'));
      toast.success(res?.message || 'Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại.';
      toast.error(msg, { toastId: 'admin-session-error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9f6] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[1100px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Left Side - Image & Branding */}
        <div className="hidden md:block md:w-1/2 bg-primary p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501004318641-729e8439a7e7?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>

          <div className="relative h-full flex flex-col justify-between text-white z-20">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span className="text-2xl font-black tracking-tighter">AdminPro</span>
              </div>
              <h1 className="text-5xl font-black leading-tight mb-4">Quản lý hệ thống <br /> cây cảnh chuyên nghiệp</h1>
              <p className="text-white/80 font-medium text-lg max-w-md">Hệ thống tối ưu hóa quy trình bán hàng và chăm sóc khách hàng cho cửa hàng Bonsai của bạn.</p>
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
              <p className="text-sm font-bold text-white/90">"Giao diện thật tuyệt vời, giúp tôi quản lý hàng trăm cây cảnh một cách dễ dàng và chính xác."</p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white/30 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=User&background=fff&color=10b981" alt="avatar" />
                </div>
                <div>
                  <p className="text-xs font-black">Nguyễn Văn Khách</p>
                  <p className="text-[10px] text-white/60">Chủ vườn kiểng Đà Lạt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 md:p-20 bg-white">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-text mb-2">Chào mừng trở lại!</h2>
            <p className="text-text-muted font-bold">Vui lòng đăng nhập để tiếp tục quản lý.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Địa chỉ Email</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-5 flex items-center text-text-muted group-focus-within:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all font-bold text-text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-5 flex items-center text-text-muted group-focus-within:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all font-bold text-text"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer hidden" />
                  <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                  <svg className="absolute w-4 h-4 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-sm font-bold text-text-muted group-hover:text-text transition-colors">Ghi nhớ tôi</span>
              </label>
              <a href="#" className="text-sm font-black text-primary hover:underline">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Đăng nhập ngay</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>

            {/* Demo login info */}
            <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-start space-x-3">
                <svg className="text-primary mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <div>
                  <p className="text-[11px] font-black text-primary uppercase tracking-wider">Tài khoản trải nghiệm</p>
                  <p className="text-xs font-bold text-text-muted mt-1">Email: <span className="text-text">admin@gmail.com</span></p>
                  <p className="text-xs font-bold text-text-muted">Mật khẩu: <span className="text-text">123456</span></p>
                </div>
              </div>
            </div>
          </form>


          <div className="mt-12 pt-12 border-t border-slate-100 text-center">
            <p className="text-sm font-bold text-text-muted">Bạn không có quyền truy cập? <a href="#" className="text-primary hover:underline">Liên hệ kỹ thuật</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
