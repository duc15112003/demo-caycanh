import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await apiService.getMe();
        setMe({ fullName: u.fullName, email: u.email, role: u.role });
      } catch {
        // ignore; interceptor 401 will redirect
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target)) return;
      setMenuOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  const initials = useMemo(() => {
    const name = me?.fullName?.trim();
    if (!name) return 'AD';
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('');
  }, [me?.fullName]);

  const roleLabel = useMemo(() => {
    const r = (me?.role || 'ADMIN').toUpperCase();
    if (r === 'ADMIN') return 'Quản trị viên';
    if (r === 'USER') return 'Nhân viên';
    return r;
  }, [me?.role]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const res = await apiService.logout();
      toast.success(res?.message || 'Đã đăng xuất.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng xuất thất bại.';
      toast.error(msg);
    } finally {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('auth:changed'));
      setLoggingOut(false);
      navigate('/login');
    }
  };

  return (
    <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 bg-slate-50 border border-border rounded-xl text-text-muted hover:text-primary transition-all lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div className="relative group hidden sm:block">
          <span className="absolute inset-y-0 left-4 flex items-center text-text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="pl-12 pr-6 py-2.5 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all w-48 md:w-64 lg:w-80 font-medium text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="p-2.5 text-text-muted hover:bg-slate-50 rounded-xl transition-colors relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-border mx-2 hidden md:block"></div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center space-x-3 pl-2 group"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className="text-right hidden xs:block">
              <p className="text-sm font-black text-text leading-none">{me?.fullName || 'Admin'}</p>
              <p className="text-[10px] font-bold text-primary mt-1">{roleLabel}</p>
            </div>
            <div className="w-10 h-10 md:w-11 md:h-11 bg-primary text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary/20 cursor-pointer group-hover:scale-105 transition-transform">
              {initials}
            </div>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-3 w-72 bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-5 border-b border-border">
                <p className="text-sm font-black text-text truncate">{me?.fullName || 'Admin'}</p>
                <p className="text-[11px] font-bold text-text-muted mt-1 truncate">{me?.email || '—'}</p>
              </div>

              <div className="p-2">
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-black text-text text-sm">Cài đặt</span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">/settings</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/help');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-black text-text text-sm">Trợ giúp</span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">/help</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/analysis');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-black text-text text-sm">Phân tích</span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">/analysis</span>
                </button>
              </div>

              <div className="p-2 border-t border-border">
                <button
                  role="menuitem"
                  onClick={async () => {
                    setMenuOpen(false);
                    await handleLogout();
                  }}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-rose-50 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="font-black text-rose-600 text-sm">{loggingOut ? 'Đang thoát...' : 'Đăng xuất'}</span>
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>


  );
};

export default Header;
