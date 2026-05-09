import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import authApi from "../api/authApi";
import userApi from "../api/userApi";
import { loginSuccess } from "../redux/slices/authSlice";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const completeLogin = async (redirectTo) => {
    const userProfile = await userApi.getMe();
    dispatch(loginSuccess({ user: userProfile }));
    navigate(redirectTo);
  };

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
        toast.error(
          `${error.customMessage || "Dang nhap that bai."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`,
          { toastId: "login-error" }
        );
        return;
      }

      await completeLogin(location.state?.from || "/");
    } catch (error) {
      toast.error(
        `${error.customMessage || "Khong the tai thong tin tai khoan."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`,
        { toastId: "login-profile-error" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-[linear-gradient(150deg,_#052e16,_#065f46_55%,_#d1fae5)] p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Dang nhap</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Truy cap tai khoan de mua cay, theo doi don va thanh toan nhanh hon.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-emerald-50/90">
            Phien dang nhap se duoc dong bo tu `GET /api/user/me` sau khi backend ghi HttpOnly cookie thanh cong.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Chua co tai khoan? Dang ky
          </Link>
        </div>

        <div className="p-8 sm:p-12">
          <h2 className="text-3xl font-semibold text-slate-900">Dang nhap tai khoan</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Su dung email va mat khau de dang ky, dang nhap va tiep tuc mua sam.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="field-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="field-input"
                value={formData.email}
                onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="login-password">
                Mat khau
              </label>
              <input
                id="login-password"
                type="password"
                className="field-input"
                value={formData.password}
                onChange={(event) => setFormData((previous) => ({ ...previous, password: event.target.value }))}
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <Link to="/forgot-password" className="font-medium text-emerald-700 transition hover:text-emerald-800">
                Quen mat khau?
              </Link>
            </div>

            <button type="submit" disabled={submitting} className="primary-button w-full">
              {submitting ? "Dang dang nhap..." : "Dang nhap"}
            </button>
          </form>

          <div className="mt-6">
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200"></span>
              <span>hoac</span>
              <span className="h-px flex-1 bg-slate-200"></span>
            </div>
            <GoogleLoginButton disabled={submitting} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
