import React, { useState } from 'react';

const ShippingPolicy = () => {
  const [shippingRates] = useState([
    { area: "TP. Hồ Chí Minh (Nội thành)", time: "1 - 2 ngày làm việc", fee: "30.000 VNĐ (Miễn phí cho đơn hàng từ 500.000 VNĐ)" },
    { area: "Các tỉnh Miền Nam", time: "2 - 3 ngày làm việc", fee: "50.000 VNĐ (Miễn phí cho đơn hàng từ 1.000.000 VNĐ)" },
    { area: "Miền Trung và Miền Bắc", time: "3 - 5 ngày làm việc", fee: "70.000 VNĐ (Tùy thuộc kích thước cây)" }
  ]);

  return (
    <section className="home-content">
      <style>{`
        .shipping-container {
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }
        .shipping-container h1 {
          color: #1b4332;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
        }
        .shipping-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          border-radius: 8px;
          overflow: hidden;
        }
        .shipping-table th, .shipping-table td {
          padding: 15px;
          text-align: left;
          border: 1px solid #e8f5e9;
        }
        .shipping-table th {
          background-color: #2d6a4f;
          color: white;
        }
        .shipping-table tr:nth-child(even) { background-color: #f7fcf7; }
        .note-box {
          background-color: #fff8e1;
          padding: 15px;
          border-left: 5px solid #d4a373;
          border-radius: 5px;
          margin-top: 30px;
          font-size: 14px;
        }
      `}</style>

      <div className="shipping-container">
        <h1>🚚 Phương Thức Vận Chuyển</h1>
        
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          Chúng tôi đảm bảo cây của bạn được đóng gói cẩn thận và giao đến tận tay một cách an toàn nhất.
        </p>

        <h3>1. Chi phí và Thời gian Giao hàng ước tính</h3>
        
        <table className="shipping-table">
          <thead>
            <tr>
              <th>Khu vực</th>
              <th>Thời gian dự kiến</th>
              <th>Phí vận chuyển</th>
            </tr>
          </thead>
          <tbody>
            {shippingRates.map((item, index) => (
              <tr key={index}>
                <td>{item.area}</td>
                <td>{item.time}</td>
                <td>{item.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>2. Chính sách Đóng gói</h3>
        <p>
          Tất cả các loại cây đều được đóng gói theo tiêu chuẩn đặc biệt: cố định chậu, bọc lá cẩn thận, và sử dụng thùng carton 5 lớp chắc chắn để chống va đập trong quá trình vận chuyển.
        </p>

        <div className="note-box">
          <i className="fas fa-info-circle"></i> Lưu ý: Đối với các cây có kích thước lớn hoặc chậu nặng, phí vận chuyển có thể thay đổi và sẽ được thông báo cụ thể khi xác nhận đơn hàng.
        </div>
      </div>
    </section>
  );
};

export default ShippingPolicy;