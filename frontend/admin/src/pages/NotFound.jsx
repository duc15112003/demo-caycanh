import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-surface p-10 rounded-[2.5rem] border border-border shadow-sm text-center max-w-lg w-full">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">404</p>
        <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight mt-2">Không tìm thấy trang</h1>
        <p className="text-sm font-bold text-text-muted mt-3">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/25 hover:opacity-95 transition-all"
          >
            Về Dashboard
          </Link>
          <Link
            to="/"
            className="px-6 py-3.5 rounded-2xl bg-slate-50 border border-border text-text font-black hover:bg-slate-100 transition-all"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
