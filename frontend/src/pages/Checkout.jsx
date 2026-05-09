import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import cartApi from "../api/cartApi";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";
import { notifyCartUpdated } from "../utils/cartEvents";

const PAYMENT_OPTIONS = [
  {
    value: "COD",
    title: "Thanh toán khi nhận hàng",
    subtitle: "Đặt hàng trước, thanh toán sau khi nhận sản phẩm.",
  },
  {
    value: "VNPAY",
    title: "Thanh toán qua VNPAY",
    subtitle: "Tạo giao dịch qua endpoint thanh toán và chuyển sang VNPAY.",
  },
];

const resolveProductImage = (image) => {
  if (!image) return "https://placehold.co/120x120?text=No+Image";
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }
  return `/images/${image}`;
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isWaitingVnpay, setIsWaitingVnpay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingData, setShippingData] = useState({
    shippingAddress: "",
    note: "",
  });

  const paymentResultReceivedRef = useRef(false);

  useEffect(() => {
    const fetchCartData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await cartApi.getCart();
        const items = response.items || [];
        setCartItems(items);
        setTotal(response.totalAmount || 0);
      } catch (error) {
        toast.error(`${error.customMessage || "Không thể tải giỏ hàng."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleVnpayMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const data = event.data || {};
      if (data.type !== "VNPAY_RESULT") return;

      paymentResultReceivedRef.current = true;
      setIsWaitingVnpay(false);

      const result = data.payload || {};

      if (result.success) {
        toast.success("Thanh toán VNPAY thành công.");
        notifyCartUpdated();
        navigate(`/order/confirm/${result.orderId}`);
      } else {
        toast.error(result.message || "Thanh toán VNPAY thất bại.");
      }
    };

    window.addEventListener("message", handleVnpayMessage);
    return () => window.removeEventListener("message", handleVnpayMessage);
  }, [navigate]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      shippingAddress: shippingData.shippingAddress.trim(),
      note: shippingData.note.trim(),
    };

    if (!payload.shippingAddress) {
      toast.error("Địa chỉ giao hàng không được để trống. [500]");
      return;
    }

    setSubmitting(true);
    try {
      const orderResponse = await orderApi.checkout(payload);
      const orderId =
        orderResponse?.orderId || orderResponse?.id || orderResponse?.order?.orderId || null;

      if (!orderId) {
        throw new Error("Không lấy được mã đơn hàng sau khi checkout.");
      }

      if (paymentMethod === "VNPAY") {
        const paymentRes = await paymentApi.createVnpayPayment({
          amount: Number(total),
          orderId: String(orderId),
        });

        if (!paymentRes?.paymentUrl) {
          throw new Error("Không nhận được đường dẫn thanh toán VNPAY.");
        }

        const popupWidth = 520;
        const popupHeight = 760;
        const left = Math.max((window.screen.width - popupWidth) / 2, 0);
        const top = Math.max((window.screen.height - popupHeight) / 2, 0);

        paymentResultReceivedRef.current = false;
        const popup = window.open(
          paymentRes.paymentUrl,
          "vnpay_payment",
          `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (!popup) {
          toast.info("Trình duyệt chặn popup. Chuyển sang mở VNPAY cùng tab.");
          window.location.href = paymentRes.paymentUrl;
          return;
        }

        setIsWaitingVnpay(true);
        const popupWatcher = window.setInterval(() => {
          if (popup.closed) {
            window.clearInterval(popupWatcher);
            setIsWaitingVnpay(false);
            if (!paymentResultReceivedRef.current) {
              toast.info("Bạn đã đóng cửa sổ thanh toán.");
            }
          }
        }, 500);

        popup.focus();
        return;
      }

      toast.success("Đặt hàng thành công.");
      notifyCartUpdated();
      navigate(`/order/confirm/${orderId}`);
    } catch (error) {
      toast.error(
        `${error.customMessage || error.message || "Đặt hàng thất bại."}${error.customErrorCode ? ` [${error.customErrorCode}]` : ""}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="page-section">
        <div className="glass-card p-8 text-center sm:p-12">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Thanh toán</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Bạn cần đăng nhập để tiếp tục.</h1>
          <p className="mt-4 text-slate-600">Các endpoint giỏ hàng, checkout và payment đều yêu cầu người dùng đã xác thực.</p>
          <Link to="/login" className="primary-button mt-8">
            Đăng nhập
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Thanh toán</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">Xác nhận đơn hàng</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Form này dùng đúng các API đã có: `GET /cart`, `POST /checkout` và `POST /payment/create` khi chọn VNPAY.
          </p>
        </div>
        <div className="glass-card flex items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm text-slate-500">Số lượng sản phẩm</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalQuantity}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Tổng thanh toán</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-700">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-slate-600">Đang tải giỏ hàng...</div>
      ) : cartItems.length === 0 ? (
        <div className="glass-card p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold text-slate-900">Giỏ hàng đang trống</h2>
          <p className="mt-3 text-slate-600">Hãy thêm sản phẩm trước khi tiến hành thanh toán.</p>
          <Link to="/product" className="primary-button mt-8">
            Quay lại cửa hàng
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Sản phẩm đã chọn</h2>
            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
                  <img
                    src={resolveProductImage(item.product?.image)}
                    alt={item.product?.productName || "Product"}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{item.product?.productName}</h3>
                    <p className="mt-2 text-sm text-slate-500">Đơn giá: {formatCurrency(item.product?.price)}</p>
                    <p className="mt-1 text-sm text-slate-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right text-lg font-semibold text-emerald-700">
                    {formatCurrency((item.product?.price || 0) * (item.quantity || 0))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Thông tin giao hàng</h2>
              </div>

              <div>
                <label className="field-label" htmlFor="shippingAddress">
                  Địa chỉ nhận hàng
                </label>
                <input
                  id="shippingAddress"
                  name="shippingAddress"
                  value={shippingData.shippingAddress}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="note">
                  Ghi chú đơn hàng
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={shippingData.note}
                  onChange={handleChange}
                  rows="4"
                  className="field-input resize-none"
                  placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Phương thức thanh toán</h3>
                {PAYMENT_OPTIONS.map((option) => {
                  const active = paymentMethod === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaymentMethod(option.value)}
                      className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                        active
                          ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
                          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
                      }`}
                    >
                      <p className="text-base font-semibold text-slate-900">{option.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{option.subtitle}</p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span>Liên hệ xác nhận</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-base font-semibold text-slate-900">Tổng cộng</span>
                  <span className="text-2xl font-semibold text-emerald-700">{formatCurrency(total)}</span>
                </div>
              </div>

              <button type="submit" className="primary-button w-full" disabled={submitting}>
                {submitting
                  ? "Đang xử lý..."
                  : paymentMethod === "VNPAY"
                    ? "Tạo thanh toán VNPAY"
                    : "Đặt hàng"}
              </button>

              {isWaitingVnpay && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Đang chờ kết quả từ cửa sổ thanh toán VNPAY...
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checkout;
