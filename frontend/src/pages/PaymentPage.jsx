import React from 'react';
import './PaymentPage.css';

const PaymentPage = () => {
  return (
    <div className="payment-page-content">
      <div className="payment-container">
        <h1>💳 Phương Thức Thanh Toán</h1>
        <p>Chúng tôi hỗ trợ nhiều phương thức thanh toán tiện lợi cho khách hàng.</p>
        
        <div className="methods-grid">
          <div className="method-card">
            <div className="method-icon"><i className="fas fa-hand-holding-usd"></i></div>
            <h3>Tiền mặt (COD)</h3>
            <p>Thanh toán khi nhận hàng, áp dụng toàn quốc.</p>
          </div>
          
          <div className="method-card">
            <div className="method-icon"><i className="fas fa-university"></i></div>
            <h3>Chuyển khoản Ngân hàng</h3>
            <p>Thanh toán trước qua các ngân hàng nội địa.</p>
          </div>
        </div>
        
        <div className="bank-info">
          <h3>Thông tin Chuyển khoản</h3>
          <p>Vui lòng chuyển khoản tới thông tin sau và ghi rõ <strong>Mã Đơn Hàng</strong> trong nội dung:</p>
          <div className="bank-details">
            <p>Ngân hàng: <strong>MB Bank (Ngân hàng Quân đội)</strong></p>
            <p>Số tài khoản: <strong>1986 888 888 888</strong></p>
            <p>Chủ tài khoản: <strong>HUỲNH GIA BẢO</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;