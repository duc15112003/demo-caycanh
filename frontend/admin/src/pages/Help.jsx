import React from 'react';

const Help = () => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">Trợ giúp</h1>
        <p className="text-text-muted text-xs md:text-sm font-medium mt-1">Các thao tác cơ bản trong trang quản trị.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">FAQ nhanh</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-black text-text">Vì sao token vẫn "hiện" trong Cookie?</p>
              <p className="mt-1 font-bold text-text-muted">
                Vì DevTools luôn hiển thị cookie mà browser lưu. Nếu cookie là <span className="text-text font-black">HttpOnly</span> thì JS không đọc được.
              </p>
            </div>
            <div>
              <p className="font-black text-text">Logout có xóa cookie được không?</p>
              <p className="mt-1 font-bold text-text-muted">
                Có, miễn backend trả <span className="text-text font-black">Set-Cookie</span> để xóa cookie đúng <span className="text-text font-black">Name/Path/Domain</span>.
              </p>
            </div>
            <div>
              <p className="font-black text-text">Upload ảnh sản phẩm dùng kiểu gì?</p>
              <p className="mt-1 font-bold text-text-muted">
                Ưu tiên upload file (multipart/form-data). Nếu backend cho phép string URL, bạn cũng có thể dán URL.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Liên hệ</h3>
          <div className="space-y-3 text-sm font-bold text-text-muted">
            <p>Gặp lỗi 401/403, kiểm tra cookie + quyền user.</p>
            <p>Gặp lỗi CORS, đảm bảo backend cho phép credentials.</p>
            <p className="text-[10px] uppercase tracking-wider">Tip</p>
            <p>Dev `Secure cookie` cần chạy HTTPS, hoặc tắt `Secure` khi local.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
