import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import orderApi from "../api/orderApi";
import "./OrderDetail.css";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const formatDateTime = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN");
};

const resolveProductImage = (image) => {
  if (!image) return "https://placehold.co/120x120?text=No+Image";
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }
  return `/images/${image}`;
};

const normalizeStatus = (status) => (status || "").toLowerCase().trim();

const getStatusMeta = (status) => {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "chờ xử lý":
    case "cho xu ly":
    case "pending":
      return { label: "Chờ xử lý", tone: "pending", progress: 1 };
    case "đang xử lý":
    case "dang xu ly":
    case "processing":
    case "confirmed":
      return { label: "Đang xử lý", tone: "pending", progress: 2 };
    case "đang giao":
    case "dang giao":
    case "shipping":
    case "shipped":
      return { label: "Đang giao", tone: "shipping", progress: 3 };
    case "hoàn thành":
    case "hoan thanh":
    case "completed":
    case "delivered":
      return { label: "Hoàn thành", tone: "completed", progress: 4 };
    case "đã hủy":
    case "da huy":
    case "cancel":
    case "cancelled":
    case "canceled":
      return { label: "Đã hủy", tone: "cancelled", progress: 0 };
    default:
      return { label: status || "Không xác định", tone: "default", progress: 1 };
  }
};

const ORDER_STEPS = [
  { key: "placed", title: "Đặt hàng", hint: "Đơn đã được ghi nhận" },
  { key: "confirmed", title: "Xác nhận", hint: "Shop đang chuẩn bị đơn" },
  { key: "shipping", title: "Vận chuyển", hint: "Đơn đang trên đường giao" },
  { key: "done", title: "Hoàn thành", hint: "Đơn đã giao thành công" },
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrderDetail = async () => {
      try {
        const response = await orderApi.getOrderDetails(orderId);
        if (isMounted) {
          setOrder(response);
        }
      } catch (err) {
        console.error("Loi lay chi tiet don hang:", err);
        if (isMounted) {
          setError("Khong the tai chi tiet don hang. Vui long thu lai.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <section className="order-detail-page">
        <div className="order-detail-shell order-detail-state">
          <div className="order-detail-spinner" aria-hidden="true"></div>
          <p>Đang tải chi tiết đơn hàng...</p>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="order-detail-page">
        <div className="order-detail-shell order-detail-state order-detail-state-error">
          <h1>Không xem được chi tiết đơn hàng</h1>
          <p>{error || "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập."}</p>
          <Link to="/order/history" className="order-detail-backlink">
            Quay lại lịch sử đơn hàng
          </Link>
        </div>
      </section>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const computedTotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const status = getStatusMeta(order.status);
  const progressWidth =
    status.tone === "cancelled" ? "0%" : `${((Math.max(status.progress, 1) - 1) / (ORDER_STEPS.length - 1)) * 100}%`;

  return (
    <section className="order-detail-page">
      <div className="order-detail-shell">
        <div className="order-detail-topbar">
          <Link to="/order/history" className="order-detail-backlink">
            <i className="fas fa-arrow-left" aria-hidden="true"></i>
            Quay lại lịch sử đơn hàng
          </Link>
        </div>

        <div className="order-detail-hero">
          <div className="order-detail-hero-copy">
            <span className="order-detail-kicker">Theo dõi đơn hàng</span>
            <h1>Đơn hàng #{order.orderId}</h1>
            <p>
              Đặt lúc {formatDateTime(order.orderDate)}. Bạn có thể xem trạng thái xử lý, sản phẩm
              và thông tin giao hàng tại đây.
            </p>
          </div>

          <div className={`order-detail-status-chip ${status.tone}`}>{status.label}</div>
        </div>

        <div className="order-progress-card">
          <div className="order-progress-head">
            <div>
              <h2>Tiến độ xử lý</h2>
              <p>Cập nhật theo trạng thái hiện tại của đơn hàng.</p>
            </div>
            {status.tone === "cancelled" ? (
              <div className="order-progress-cancelled">
                <i className="fas fa-ban" aria-hidden="true"></i>
                Đơn hàng đã bị hủy
              </div>
            ) : null}
          </div>

          <div className={`order-progress-track ${status.tone === "cancelled" ? "cancelled" : ""}`}>
            <div className="order-progress-fill" style={{ width: progressWidth }} aria-hidden="true"></div>
            {ORDER_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isDone = status.tone !== "cancelled" && stepNumber <= status.progress;
              const isCurrent = status.tone !== "cancelled" && stepNumber === status.progress;

              return (
                <div
                  key={step.key}
                  className={`order-progress-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                >
                  <div className="order-progress-dot">
                    {isDone ? <i className="fas fa-check" aria-hidden="true"></i> : stepNumber}
                  </div>
                  <div className="order-progress-text">
                    <strong>{step.title}</strong>
                    <span>{step.hint}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="order-detail-grid">
          <div className="order-detail-main">
            <div className="order-detail-card">
              <div className="order-detail-card-head">
                <h2>Sản phẩm trong đơn</h2>
                <span>{items.length} mặt hàng</span>
              </div>

              {items.length === 0 ? (
                <div className="order-detail-empty">
                  API chưa trả về danh sách sản phẩm cho đơn hàng này.
                </div>
              ) : (
                <div className="order-detail-items">
                  {items.map((item) => (
                    <div
                      key={item.orderItemId || `${item.productId}-${item.quantity}`}
                      className="order-detail-item"
                    >
                      <div className="order-detail-item-media">
                        <img
                          src={resolveProductImage(item.product?.image)}
                          alt={item.product?.productName || `San pham ${item.productId}`}
                        />
                      </div>

                      <div className="order-detail-item-info">
                        <h3>{item.product?.productName || `Sản phẩm #${item.productId}`}</h3>
                        <p>Đơn giá: {formatCurrency(item.price)}</p>
                        <span>Số lượng: {item.quantity || 0}</span>
                      </div>

                      <div className="order-detail-item-total">
                        {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {order.note ? (
              <div className="order-detail-card">
                <div className="order-detail-card-head">
                  <h2>Ghi chú đơn hàng</h2>
                </div>
                <div className="order-detail-note">{order.note}</div>
              </div>
            ) : null}
          </div>

          <aside className="order-detail-side">
            <div className="order-detail-card order-detail-summary">
              <div className="order-detail-card-head">
                <h2>Tổng quan</h2>
              </div>

              <div className="order-detail-summary-list">
                <div>
                  <span>Mã đơn</span>
                  <strong>#{order.orderId}</strong>
                </div>
                <div>
                  <span>Ngày đặt</span>
                  <strong>{formatDateTime(order.orderDate)}</strong>
                </div>
                <div>
                  <span>Người nhận</span>
                  <strong>{order.fullName || "--"}</strong>
                </div>
                <div>
                  <span>Trạng thái</span>
                  <strong>{status.label}</strong>
                </div>
                <div>
                  <span>Tổng thanh toán</span>
                  <strong>{formatCurrency(order.totalAmount || computedTotal)}</strong>
                </div>
              </div>
            </div>

            <div className="order-detail-card">
              <div className="order-detail-card-head">
                <h2>Địa chỉ giao hàng</h2>
              </div>
              <div className="order-detail-address">
                <i className="fas fa-location-dot" aria-hidden="true"></i>
                <p>{order.shippingAddress || "--"}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
