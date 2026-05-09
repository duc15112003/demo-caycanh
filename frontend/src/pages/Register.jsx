import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authApi from "../api/authApi";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await authApi.register({
        ...formData,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });
      toast.success("Đăng ký thành công. Bạn có thể đăng nhập ngay.");
      navigate("/login");
    } catch (error) {
      toast.error(`${error.customMessage || "Đăng ký thất bại."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Đăng ký</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">Tạo tài khoản để bắt đầu mua bán cây cảnh thuận tiện hơn.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Form này bám đúng các trường backend hỗ trợ trong `POST /api/auth/register`: họ tên, email, mật khẩu, số điện thoại và địa chỉ.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="register-full-name">Họ và tên</label>
                <input
                  id="register-full-name"
                  type="text"
                  className="field-input"
                  value={formData.fullName}
                  onChange={(event) => setFormData((previous) => ({ ...previous, fullName: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  type="email"
                  className="field-input"
                  value={formData.email}
                  onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="register-phone">Số điện thoại</label>
                <input
                  id="register-phone"
                  type="text"
                  className="field-input"
                  value={formData.phone}
                  onChange={(event) => setFormData((previous) => ({ ...previous, phone: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="register-password">Mật khẩu</label>
              <input
                id="register-password"
                type="password"
                className="field-input"
                value={formData.password}
                onChange={(event) => setFormData((previous) => ({ ...previous, password: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="register-address">Địa chỉ</label>
              <input
                id="register-address"
                type="text"
                className="field-input"
                value={formData.address}
                onChange={(event) => setFormData((previous) => ({ ...previous, address: event.target.value }))}
              />
            </div>

            <button type="submit" disabled={submitting} className="primary-button w-full">
              {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>
        </div>

        <div className="bg-[linear-gradient(150deg,_#052e16,_#065f46_55%,_#d1fae5)] p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Tree Shop</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">Một tài khoản để quản lý giỏ hàng, đơn hàng và hành trình mua cây của bạn.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-emerald-50/90">
            Sau khi đăng ký, bạn có thể đăng nhập, thêm sản phẩm vào giỏ, thanh toán và theo dõi đơn hàng thuận tiện hơn.
          </p>
          <Link to="/login" className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
