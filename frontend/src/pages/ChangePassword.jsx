import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../api/userApi";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,72}$/;

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Ban can dang nhap truoc khi doi mat khau.");
      navigate("/login");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Mat khau moi phai co it nhat 6 ky tu.");
      return;
    }

    if (!PASSWORD_PATTERN.test(formData.newPassword)) {
      toast.error("Mat khau moi phai dai 6-72 ky tu, co it nhat 1 chu cai, 1 chu so va chi dung ky tu hop le.");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("Mat khau moi khong duoc trung voi mat khau hien tai.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mat khau xac nhan khong khop.");
      return;
    }

    setSubmitting(true);
    try {
      await userApi.changeMyPassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Doi mat khau thanh cong.");
      setFormData(initialState);
      navigate("/profile");
    } catch (error) {
      toast.error(`${error.customMessage || "Doi mat khau that bai."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="page-section">
        <div className="glass-card p-8 text-center sm:p-12">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Bao mat tai khoan</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Ban can dang nhap de doi mat khau.</h1>
          <p className="mt-4 text-slate-600">API `PUT /api/user/me/password` chi hoat dong khi backend xac thuc duoc phien dang nhap hien tai.</p>
          <button type="button" onClick={() => navigate("/login")} className="primary-button mt-8">
            Di toi dang nhap
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-[linear-gradient(150deg,_#052e16,_#065f46_55%,_#d1fae5)] p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Bao mat tai khoan</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Doi mat khau de bao ve tai khoan mua hang cua ban tot hon.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-emerald-50/90">
            Tinh nang nay da duoc noi voi API `PUT /api/user/me/password`. Backend se kiem tra mat khau hien tai truoc khi cap nhat mat khau moi.
          </p>
        </div>

        <div className="p-8 sm:p-12">
          <h2 className="text-3xl font-semibold text-slate-900">Doi mat khau</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Nhap chinh xac mat khau hien tai va mat khau moi theo dung quy tac backend dang validate.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="field-label" htmlFor="current-password">Mat khau hien tai</label>
              <input
                id="current-password"
                type="password"
                className="field-input"
                value={formData.currentPassword}
                onChange={(event) => setFormData((previous) => ({ ...previous, currentPassword: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="new-password">Mat khau moi</label>
              <input
                id="new-password"
                type="password"
                className="field-input"
                value={formData.newPassword}
                onChange={(event) => setFormData((previous) => ({ ...previous, newPassword: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="confirm-password">Xac nhan mat khau moi</label>
              <input
                id="confirm-password"
                type="password"
                className="field-input"
                value={formData.confirmPassword}
                onChange={(event) => setFormData((previous) => ({ ...previous, confirmPassword: event.target.value }))}
                required
              />
            </div>

            <button type="submit" disabled={submitting} className="primary-button w-full">
              {submitting ? "Dang cap nhat..." : "Cap nhat mat khau"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
