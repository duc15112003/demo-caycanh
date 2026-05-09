import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const profileFields = [
  { label: "Họ và tên", key: "fullName" },
  { label: "Email", key: "email" },
  { label: "Số điện thoại", key: "phone" },
  { label: "Địa chỉ", key: "address" },
];

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <section className="page-section">
        <div className="glass-card p-8 text-center sm:p-12">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Tài khoản</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Bạn cần đăng nhập để xem thông tin cá nhân.</h1>
          <p className="mt-4 text-slate-600">Phiên người dùng được xác minh qua endpoint `GET /api/user/me`.</p>
          <Link to="/login" className="primary-button mt-8">
            Đi tới đăng nhập
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Hồ sơ người dùng</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Thông tin cá nhân</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Dữ liệu này lấy trực tiếp từ `user/me`. Theo yêu cầu, giao diện không hiển thị `role` dù backend có trả về trường đó.
          </p>

          <div className="mt-8 grid gap-4">
            {profileFields.map((field) => (
              <div key={field.key} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{field.label}</p>
                <p className="mt-2 text-lg font-medium text-slate-900">{user?.[field.key] || "Chưa cập nhật"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 sm:p-10">
          <h2 className="text-xl font-semibold text-slate-900">Tác vụ tài khoản</h2>
          <div className="mt-6 grid gap-3">
            <Link to="/order/history" className="secondary-button w-full">
              Xem lịch sử đơn hàng
            </Link>
            <Link to="/change-password" className="secondary-button w-full">
              Thông tin đổi mật khẩu
            </Link>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900">
            Không có endpoint cập nhật hồ sơ người dùng thường trong `API.md`, nên màn hình này chỉ hiển thị dữ liệu thật thay vì form submit giả.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
