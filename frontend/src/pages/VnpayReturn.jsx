import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "./VnpayReturn.css";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryStr = searchParams.toString();
        const res = await axiosClient.get(`/payment/vnpay-return?${queryStr}`);

        setResult({
          success: Boolean(res.success) || res.responseCode === "00",
          message: res.message || "Thanh toán thành công.",
          orderId: res.orderId,
          amount: Number(res.amount || 0),
          responseCode: res.responseCode,
          transactionNo: res.transactionNo || res.vnp_TransactionNo,
        });
      } catch (error) {
        setResult({
          success: false,
          message: error.customMessage || error.message || "Xác thực thanh toán thất bại.",
          errorCode: error.errorCode || error.response?.data?.errorCode || "UNKNOWN_ERROR",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!searchParams.toString()) {
      setResult({ success: false, message: "Không tìm thấy dữ liệu giao dịch từ VNPAY." });
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [searchParams]);

  useEffect(() => {
    if (loading || !result || !window.opener) return;

    try {
      window.opener.postMessage(
        {
          type: "VNPAY_RESULT",
          payload: result,
        },
        window.location.origin
      );
    } catch (error) {
      console.error("Cannot post message to opener", error);
    }

    if (result.success) {
      try {
        window.opener.location.href = `${window.location.origin}/order/confirm/${result.orderId}`;
      } catch (error) {
        console.error("Cannot redirect opener", error);
      }
    }

    const closeTimer = window.setTimeout(() => {
      window.close();
    }, result.success ? 600 : 1500);

    return () => window.clearTimeout(closeTimer);
  }, [loading, result]);

  const title = useMemo(() => {
    if (loading) return "Đang xác thực thanh toán";
    return result?.success ? "Thanh toán thành công" : "Thanh toán thất bại";
  }, [loading, result]);

  return (
    <section className="vnpay-return-page home-content">
      <div className="vnpay-return-shell">
        <div className="vnpay-status-card">
          {loading ? (
            <>
              <div className="vnpay-spinner" aria-hidden="true" />
              <h1>{title}</h1>
              <p>Vui lòng chờ trong giây lát...</p>
            </>
          ) : (
            <>
              <div className={`vnpay-result-icon ${result?.success ? "success" : "error"}`}>
                <i className={`fa-solid ${result?.success ? "fa-check" : "fa-xmark"}`} aria-hidden="true"></i>
              </div>
              <h1>{title}</h1>
              <p>{result?.message}</p>

              <div className="vnpay-meta-box">
                {result?.orderId && (
                  <div>
                    <span>Mã đơn hàng</span>
                    <strong>#{result.orderId}</strong>
                  </div>
                )}
                {result?.amount ? (
                  <div>
                    <span>Số tiền</span>
                    <strong>{formatCurrency(result.amount)}</strong>
                  </div>
                ) : null}
                {result?.transactionNo && (
                  <div>
                    <span>Mã giao dịch</span>
                    <strong>{result.transactionNo}</strong>
                  </div>
                )}
                {result?.responseCode && (
                  <div>
                    <span>Mã phản hồi</span>
                    <strong>{result.responseCode}</strong>
                  </div>
                )}
                {!result?.success && result?.errorCode && (
                  <div>
                    <span>Mã lỗi</span>
                    <strong>{result.errorCode}</strong>
                  </div>
                )}
              </div>

              {window.opener ? (
                <p style={{ marginTop: 12, fontSize: 13, color: "#5b776b" }}>
                  Kết quả đã gửi về cửa sổ chính. Cửa sổ này sẽ tự đóng.
                </p>
              ) : null}

              <div className="vnpay-action-group">
                <button type="button" onClick={() => navigate("/")} className="btn-neutral">
                  Về trang chủ
                </button>
                <button
                  type="button"
                  onClick={() => navigate(result?.success ? `/order/confirm/${result.orderId}` : "/checkout")}
                  className="btn-primary"
                >
                  {result?.success ? "Xem đơn hàng" : "Thử lại thanh toán"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VnpayReturn;
