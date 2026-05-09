import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logoutSuccess } from "../redux/slices/authSlice";
import userApi from "../api/userApi";
import authApi from "../api/authApi";
import cartApi from "../api/cartApi";
import productApi from "../api/productApi";
import { CART_UPDATED_EVENT } from "../utils/cartEvents";
import { toast } from "react-toastify";
import GoogleLoginButton from "./GoogleLoginButton";

const navItems = [
  { to: "/product/cay", label: "Cây cảnh" },
  { to: "/product/chau", label: "Chậu cây" },
  { to: "/product/phukien", label: "Phụ kiện" },
  { to: "/instruction", label: "Hướng dẫn" },
  { to: "/order/history", label: "Đơn hàng" },
];

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [wishlistCount] = useState(2);
  const [cartCount, setCartCount] = useState(0);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const isAuthPage = useMemo(
    () => ["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated) {
        setCartCount(0);
        return;
      }

      try {
        const response = await cartApi.getCart();
        setCartCount(Number(response?.totalQuantity || 0));
      } catch (error) {
        setCartCount(0);
      }
    };

    fetchCartCount();
    window.addEventListener(CART_UPDATED_EVENT, fetchCartCount);
    return () => window.removeEventListener(CART_UPDATED_EVENT, fetchCartCount);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!showLoginModal) {
      setShowAdminMenu(false);
    }
  }, [showLoginModal]);

  useEffect(() => {
    const keyword = searchKeyword.trim();

    if (!keyword) {
      setSearchSuggestions([]);
      setSearchLoading(false);
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await productApi.searchProducts(keyword);
        setSearchSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        setSearchSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchKeyword]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchKeyword.trim()) {
      setShowSearchSuggestions(false);
      navigate(`/product/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowSearchSuggestions(false);
    setSearchKeyword("");
    navigate(`/product/${productId}`);
  };

  const resolveImage = (image) => {
    if (!image) return "https://placehold.co/120x120?text=Tree+Shop";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `/images/${image}`;
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await authApi.logout();
    } catch (error) {
      // Logout vẫn nên xoá state local ngay cả khi backend trả lỗi.
    }
    dispatch(logoutSuccess());
    setCartCount(0);
    navigate("/");
  };

  const handleModalLogin = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      try {
        await authApi.login({ email: loginData.username.trim(), password: loginData.password });
      } catch (error) {
        toast.error(
          `${error.customMessage || "Dang nhap that bai."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`,
          { toastId: "modal-login-error" }
        );
        return;
      }

      const userProfile = await userApi.getMe();
      dispatch(loginSuccess({ user: userProfile }));
      setShowLoginModal(false);
      setLoginData({ username: "", password: "" });
      setShowPassword(false);
      toast.success("Đăng nhập thành công.");
    } catch (error) {
      toast.error(
        `${error.customMessage || "Đăng nhập thất bại."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async (idToken) => {
    if (submitting) return;

    setSubmitting(true);
    try {
      try {
        await authApi.googleLogin({ idToken });
      } catch (error) {
        toast.error(
          `${error.customMessage || "Dang nhap Google that bai."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`,
          { toastId: "google-login-error" }
        );
        return;
      }

      const userProfile = await userApi.getMe();
      dispatch(loginSuccess({ user: userProfile }));
      setShowLoginModal(false);
      setLoginData({ username: "", password: "" });
      setShowPassword(false);
      toast.success("Đăng nhập Google thành công.");
    } catch (error) {
      toast.error(
        `${error.customMessage || "Đăng nhập Google thất bại."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="border-b border-emerald-900/60 bg-emerald-950 text-emerald-50">
        <div className="section-frame flex min-h-[44px] flex-col gap-2 py-2 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-emerald-100/85">
            <span>08:30 - 22:00</span>
            <span>0838 369 639 - 09 6688 9393</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-emerald-50 transition hover:bg-white/10 hover:text-white">
              <span>Yêu thích</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{wishlistCount}</span>
            </Link>

            {!isAuthenticated ? (
              !isAuthPage && (
                <button
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/10"
                >
                  Đăng nhập
                </button>
              )
            ) : (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAdminMenu((prev) => !prev)}
                      className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/10"
                    >
                      {user?.fullName || "Admin"}
                    </button>
                    {showAdminMenu && (
                      <div className="absolute right-0 top-12 w-52 rounded-2xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
                        <Link
                          to="/admin/dashboard"
                          className="block rounded-xl px-3 py-2 text-sm transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Vào trang quản trị
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/profile" className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-white transition hover:bg-white/10 hover:text-emerald-200">
                    {user?.fullName || "Tài khoản"}
                  </Link>
                )}

                <button type="button" onClick={handleLogout} className="inline-flex h-9 items-center rounded-full px-3 text-sm text-emerald-100 transition hover:bg-white/10 hover:text-white">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 backdrop-blur-md">
        <div className="section-frame flex flex-col gap-4 py-3 xl:grid xl:grid-cols-[260px_minmax(0,1fr)_320px] xl:items-center">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-100">
                TS
              </div>
              <div className="min-w-0">
                <p className="truncate text-[18px] font-semibold tracking-tight text-slate-900">Cây Cảnh</p>
                <p className="truncate text-[13px] text-slate-500">Không gian sống xanh, gọn và hiện đại</p>
              </div>
            </Link>

            <Link
              to="/cart"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 xl:hidden"
            >
              Giỏ hàng
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{cartCount}</span>
            </Link>
          </div>

          <nav className="flex flex-wrap items-center justify-start gap-1.5 xl:justify-center">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center justify-end gap-3 xl:flex">
            <div className="relative w-full max-w-[320px]">
              <form onSubmit={handleSearch} className="flex h-11 w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm">
                <input
                  type="text"
                  value={searchKeyword}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  placeholder="Tìm cây cảnh, chậu cây..."
                  className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button type="submit" className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                  Tìm
                </button>
              </form>

              {showSearchSuggestions && searchKeyword.trim() && (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-40 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_55px_rgba(15,23,42,0.12)]">
                  {searchLoading ? (
                    <div className="px-4 py-4 text-sm text-slate-500">Đang tìm sản phẩm...</div>
                  ) : searchSuggestions.length > 0 ? (
                    <div className="max-h-[360px] overflow-y-auto p-2">
                      {searchSuggestions.map((product) => (
                        <button
                          key={product.productId}
                          type="button"
                          onClick={() => handleSuggestionClick(product.productId)}
                          className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left transition hover:bg-emerald-50"
                        >
                          <img
                            src={resolveImage(product.image)}
                            alt={product.productName}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">{product.productName}</p>
                            <p className="truncate text-xs text-slate-500">
                              {Number(product.price || 0).toLocaleString("vi-VN")} đ
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-sm text-slate-500">Không có gợi ý phù hợp.</div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Giỏ hàng
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.05fr_1.25fr]">
            <div className="bg-[linear-gradient(160deg,_#052e16,_#065f46_55%,_#34d399)] p-8 text-white sm:p-10">
              <p className="mb-3 text-sm uppercase tracking-[0.28em] text-emerald-100">Tree Shop</p>
              <h2 className="max-w-sm text-3xl font-semibold leading-tight">Đăng nhập để theo dõi đơn hàng và thanh toán nhanh hơn.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-emerald-50/85">
                Backend đang dùng HttpOnly cookie theo tài liệu API, nên sau khi đăng nhập hệ thống sẽ tự đồng bộ lại phiên từ `user/me`.
              </p>
              <Link
                to="/register"
                onClick={() => setShowLoginModal(false)}
                className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Tạo tài khoản mới
              </Link>
            </div>

            <div className="p-8 sm:p-10">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Đăng nhập</h3>
                  <p className="mt-2 text-sm text-slate-500">Nhập email và mật khẩu để tiếp tục.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:text-slate-900"
                >
                  Đóng
                </button>
              </div>

              <form onSubmit={handleModalLogin} className="space-y-5">
                <div>
                  <label className="field-label" htmlFor="modal-email">
                    Email
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    value={loginData.username}
                    onChange={(event) => setLoginData((prev) => ({ ...prev, username: event.target.value }))}
                    className="field-input"
                    placeholder="ban@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="modal-password">
                    Mật khẩu
                  </label>
                  <input
                    id="modal-password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
                    className="field-input"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Hiển thị mật khẩu
                </label>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <Link
                    to="/forgot-password"
                    onClick={() => setShowLoginModal(false)}
                    className="font-medium text-emerald-700 transition hover:text-emerald-800"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <button type="submit" disabled={submitting} className="primary-button w-full">
                  {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="mt-6">
                <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                  <span className="h-px flex-1 bg-slate-200"></span>
                  <span>hoặc</span>
                  <span className="h-px flex-1 bg-slate-200"></span>
                </div>
                <GoogleLoginButton
                  disabled={submitting}
                  onCredential={handleGoogleLogin}
                  onError={(error) => {
                    if (error?.message?.includes("Thiếu cấu hình")) {
                      toast.error(error.message);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
