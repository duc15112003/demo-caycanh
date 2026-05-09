import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authApi from "../api/authApi";
import userApi from "../api/userApi";
import { loginSuccess } from "../redux/slices/authSlice";
import { isAdminRole } from "../utils/auth";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated && isAdminRole(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      try {
        await authApi.login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } catch (error) {
        toast.error(`${error.customMessage || "Dang nhap admin that bai."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`, {
          toastId: "admin-login-error",
        });
        return;
      }

      const profile = await userApi.getMe();

      if (!isAdminRole(profile?.role)) {
        toast.error("Tài khoản này không có quyền truy cập trang quản trị.");
        try {
          await authApi.logout();
        } catch {
          // Khong hien them toast vi loi chinh da duoc thong bao o tren.
        }
        return;
      }

      dispatch(loginSuccess({ user: profile }));
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(`${error.customMessage || "Đăng nhập admin thất bại."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[linear-gradient(160deg,_#020617,_#0f172a_45%,_#065f46)] p-8 text-white sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-200">Backoffice</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Đăng nhập quản trị để kiểm soát sản phẩm, đơn hàng và khách hàng.</h1>
          </div>

          <div className="p-8 sm:p-12">
            <h2 className="text-3xl font-semibold text-slate-900">Admin login</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Đăng nhập bằng tài khoản quản trị đã được cấp quyền trong hệ thống.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="field-label" htmlFor="admin-email">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  className="field-input"
                  value={formData.email}
                  onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="admin-password">Mật khẩu</label>
                <input
                  id="admin-password"
                  type="password"
                  className="field-input"
                  value={formData.password}
                  onChange={(event) => setFormData((previous) => ({ ...previous, password: event.target.value }))}
                  required
                />
              </div>

              <button type="submit" disabled={submitting} className="primary-button w-full">
                {submitting ? "Đang xác thực..." : "Đăng nhập quản trị"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
