import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authApi from "../api/authApi";

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  PASSWORD: "password",
};

const initialOtpMeta = {
  expiresInSeconds: 0,
  resendAvailableInSeconds: 0,
  remainingResends: 0,
};

const OTP_LENGTH = 6;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(() => Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpMeta, setOtpMeta] = useState(initialOtpMeta);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (step !== STEPS.OTP) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setOtpMeta((previous) => ({
        ...previous,
        expiresInSeconds: Math.max(previous.expiresInSeconds - 1, 0),
        resendAvailableInSeconds: Math.max(previous.resendAvailableInSeconds - 1, 0),
      }));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step]);

  const resendDisabled = useMemo(
    () => submitting || otpMeta.resendAvailableInSeconds > 0 || otpMeta.remainingResends <= 0,
    [otpMeta.remainingResends, otpMeta.resendAvailableInSeconds, submitting]
  );
  const otpValue = otpDigits.join("");

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error("Vui long nhap email.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await authApi.sendOtp({ email: normalizedEmail });

      setEmail(normalizedEmail);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setNewPassword("");
      setConfirmPassword("");
      setOtpVerified(false);
      setOtpMeta({
        expiresInSeconds: response?.expiresInSeconds ?? 300,
        resendAvailableInSeconds: response?.resendAvailableInSeconds ?? 120,
        remainingResends: response?.remainingResends ?? 5,
      });
      setStep(STEPS.OTP);
      toast.success(response?.message || "OTP da duoc gui den email.");
    } catch (error) {
      toast.error(`${error.customMessage || "Khong the gui OTP."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (otpValue.length !== OTP_LENGTH) {
      toast.error("Vui long nhap day du 6 so OTP.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await authApi.verifyOtp({
        email: email.trim(),
        otp: otpValue,
      });

      setOtpVerified(true);
      setStep(STEPS.PASSWORD);
      toast.success(response?.message || "Xac thuc OTP thanh cong.");
    } catch (error) {
      toast.error(`${error.customMessage || "OTP khong hop le."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!otpVerified) {
      toast.error("Ban can xac thuc OTP truoc khi dat lai mat khau.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mat khau nhap lai khong khop.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.forgotPassword({
        email: email.trim(),
        newPassword,
      });

      toast.success("Dat lai mat khau thanh cong. Ban co the dang nhap lai.");
      setOtpMeta(initialOtpMeta);
      setOtpVerified(false);
      navigate("/login");
    } catch (error) {
      toast.error(
        `${error.customMessage || "Khong the cap nhat mat khau moi."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setSubmitting(true);

    try {
      const response = await authApi.sendOtp({ email: email.trim() });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpVerified(false);
      setOtpMeta({
        expiresInSeconds: response?.expiresInSeconds ?? 300,
        resendAvailableInSeconds: response?.resendAvailableInSeconds ?? 120,
        remainingResends: response?.remainingResends ?? 5,
      });
      toast.success(response?.message || "OTP da duoc gui lai.");
    } catch (error) {
      toast.error(`${error.customMessage || "Khong the gui lai OTP."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(-1);

    setOtpDigits((previous) => {
      const next = [...previous];
      next[index] = sanitizedValue;
      return next;
    });

    if (sanitizedValue && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      const previousInput = document.getElementById(`forgot-otp-${index - 1}`);
      previousInput?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pastedValue) {
      return;
    }

    setOtpDigits((previous) => {
      const next = [...previous];
      for (let index = 0; index < OTP_LENGTH; index += 1) {
        next[index] = pastedValue[index] || "";
      }
      return next;
    });

    const focusIndex = Math.min(pastedValue.length, OTP_LENGTH) - 1;
    const targetInput = document.getElementById(`forgot-otp-${Math.max(focusIndex, 0)}`);
    targetInput?.focus();
  };

  return (
    <section className="page-section">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-[linear-gradient(150deg,_#052e16,_#065f46_55%,_#d1fae5)] p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Quen mat khau</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Dat lai mat khau bang OTP gui qua email.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-emerald-50/90">
            Flow moi: nhap email, gui OTP, xac thuc OTP, sau do nhap mat khau moi de cap nhat tai khoan.
          </p>
          <Link to="/login" className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
            Quay lai dang nhap
          </Link>
        </div>

        <div className="p-8 sm:p-12">
          <h2 className="text-3xl font-semibold text-slate-900">Khoi phuc mat khau</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Su dung OTP 6 so de xac thuc truoc khi cap nhat mat khau moi.
          </p>

          {step === STEPS.EMAIL && (
            <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
              <div>
                <label className="field-label" htmlFor="forgot-email">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  className="field-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ban@example.com"
                  required
                />
              </div>

              <button type="submit" disabled={submitting} className="primary-button w-full">
                {submitting ? "Dang gui OTP..." : "Gui OTP"}
              </button>
            </form>
          )}

          {step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
              <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-900">
                OTP da duoc gui toi <span className="font-semibold">{email}</span>.
              </div>

              <div className="grid gap-3 rounded-3xl border border-emerald-100 bg-white p-4 text-sm text-slate-600 sm:grid-cols-2">
                <p>OTP het han sau: <span className="font-semibold text-slate-900">{otpMeta.expiresInSeconds}s</span></p>
                <p>So lan gui lai con lai: <span className="font-semibold text-slate-900">{otpMeta.remainingResends}</span></p>
              </div>

              <div>
                <label className="field-label" htmlFor="forgot-otp">Ma OTP</label>
                <div className="mt-2 flex gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`forgot-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="h-14 w-12 rounded-2xl border border-slate-200 text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-16 sm:w-14"
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={handleOtpPaste}
                      required
                    />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={submitting} className="primary-button w-full">
                {submitting ? "Dang xac thuc..." : "Xac thuc OTP"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className="w-full rounded-2xl border border-emerald-200 px-5 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {otpMeta.resendAvailableInSeconds > 0 ? `Gui lai OTP (${otpMeta.resendAvailableInSeconds}s)` : "Gui lai OTP"}
              </button>
            </form>
          )}

          {step === STEPS.PASSWORD && (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
              <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-900">
                OTP da duoc xac thuc cho <span className="font-semibold">{email}</span>.
              </div>

              <div>
                <label className="field-label" htmlFor="reset-password">Mat khau moi</label>
                <input
                  id="reset-password"
                  type="password"
                  className="field-input"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="reset-confirm-password">Nhap lai mat khau moi</label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  className="field-input"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={submitting} className="primary-button w-full">
                {submitting ? "Dang cap nhat..." : "Cap nhat mat khau"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
