import React from "react";
import { API_ORIGIN } from "../config/apiConfig";

const GoogleLoginButton = ({ disabled = false, className = "" }) => {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    window.location.assign(`${API_ORIGIN}:8080/oauth2/authorization/google`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.6 14.6 2.8 12 2.8A9.2 9.2 0 0 0 2.8 12 9.2 9.2 0 0 0 12 21.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.6H12Z"
        />
        <path
          fill="#34A853"
          d="M2.8 7.4 6 9.7A6 6 0 0 1 12 6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.6 14.6 2.8 12 2.8a9.2 9.2 0 0 0-9.2 4.6Z"
        />
        <path
          fill="#FBBC05"
          d="M12 21.2c2.5 0 4.7-.8 6.3-2.3l-3-2.3c-.8.6-1.8 1-3.3 1-3.8 0-5.1-2.5-5.4-3.8L3.4 16A9.2 9.2 0 0 0 12 21.2Z"
        />
        <path
          fill="#4285F4"
          d="M20.8 12.3c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.2-1.1 2.2-2.1 2.9l3 2.3c1.8-1.7 2.5-4.1 2.5-7.5Z"
        />
      </svg>
      <span>{disabled ? "Dang xu ly..." : "Dang nhap bang Google"}</span>
    </button>
  );
};

export default GoogleLoginButton;
