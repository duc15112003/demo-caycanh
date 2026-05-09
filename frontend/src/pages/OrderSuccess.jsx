import React from "react";
import { Link, useLocation } from "react-router-dom";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const OrderSuccess = () => {
  const location = useLocation();

  const fallbackOrder = {
    orderId: "--",
    status: "Chờ xử lý",
    totalAmount: 0,
    shippingAddress: "Đang cập nhật từ hệ thống",
    paymentMethod: "COD",
  };

  const order = {
    ...fallbackOrder,
    ...(location.state?.order || {}),
  };

  return (
    <section className="home-content" style={{ padding: "46px 20px" }}>
      <div
        className="success-container"
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "18px",
          border: "1px solid #e2ece5",
          boxShadow: "0 12px 30px rgba(27,54,39,0.08)",
          padding: "28px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "82px",
            height: "82px",
            borderRadius: "50%",
            margin: "0 auto 16px",
            background: "#eaf8f0",
            color: "#2f6f4d",
            display: "grid",
            placeItems: "center",
            fontSize: "32px",
          }}
        >
          <i className="fa-solid fa-check" aria-hidden="true"></i>
        </div>

        <h1 style={{ color: "#1d4031", marginBottom: "8px" }}>Đặt hàng thành công</h1>
        <p style={{ color: "#587164", marginBottom: "18px" }}>
          Đơn hàng đã được ghi nhận. Bạn có thể theo dõi tiến trình tại mục đơn hàng.
        </p>

        <div
          style={{
            textAlign: "left",
            border: "1px solid #e1ebe4",
            borderRadius: "14px",
            padding: "12px 14px",
            background: "#fbfdfc",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #deebe2" }}>
            <span>Mã đơn hàng</span>
            <strong>#{order.orderId}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #deebe2" }}>
            <span>Trạng thái</span>
            <strong>{order.status}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #deebe2" }}>
            <span>Phương thức thanh toán</span>
            <strong>{order.paymentMethod}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #deebe2" }}>
            <span>Tổng thanh toán</span>
            <strong>{formatCurrency(order.totalAmount)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "8px 0" }}>
            <span>Địa chỉ giao hàng</span>
            <strong style={{ textAlign: "right" }}>{order.shippingAddress}</strong>
          </div>
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/order/history"
            style={{
              borderRadius: "999px",
              background: "#f0f4f1",
              color: "#315743",
              padding: "12px 20px",
              fontWeight: 700,
            }}
          >
            Xem đơn hàng
          </Link>
          <Link
            to="/product"
            style={{
              borderRadius: "999px",
              background: "linear-gradient(120deg, #1f5f43, #2a7a55)",
              color: "#fff",
              padding: "12px 20px",
              fontWeight: 700,
            }}
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
