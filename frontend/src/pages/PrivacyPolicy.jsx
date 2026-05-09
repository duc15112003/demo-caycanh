import React, { useState } from 'react';

const PrivacyPolicy = () => {
  const [lastUpdate] = useState("25/11/2025");

  return (
    <section className="home-content">
      {/* Bạn có thể chuyển phần style này vào file CSS riêng */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');
        .home-content {
          font-family: 'Quicksand', sans-serif;
          background-color: #f7fcf7;
          padding: 40px 20px;
          color: #444;
          min-height: 70vh;
        }
        .policy-container {
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }
        .policy-container h1 {
          color: #1b4332;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 25px;
          text-align: center;
        }
        .policy-container h3 {
          color: #2d6a4f;
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
          border-bottom: 2px solid #e8f5e9;
          padding-bottom: 5px;
        }
        .policy-container p, .policy-container ul {
          line-height: 1.8;
          margin-bottom: 15px;
          font-size: 15px;
        }
        .policy-container ul { padding-left: 20px; }
        .policy-container li { margin-bottom: 8px; }
        .update-time {
          font-size: 13px;
          color: #999;
          text-align: center;
          margin-top: -15px;
          margin-bottom: 30px;
        }
      `}</style>

      <div className="policy-container">
        <h1>🔒 Chính Sách Bảo Mật</h1>
        <div className="update-time">Cập nhật lần cuối: {lastUpdate}</div>
        
        <p>
          Chúng tôi cam kết bảo vệ tuyệt đối thông tin cá nhân của khách hàng. Chúng tôi tôn trọng quyền riêng tư của bạn và đảm bảo mọi dữ liệu thu thập được sử dụng đúng mục đích.
        </p>

        <h3>1. Loại Thông Tin Thu Thập</h3>
        <ul>
          <li>Thông tin liên hệ: Tên, địa chỉ giao hàng, số điện thoại, email (dùng cho việc đặt hàng và giao nhận).</li>
          <li>Thông tin giao dịch: Chi tiết đơn hàng, phương thức thanh toán.</li>
          <li>Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt (dùng để cải thiện website).</li>
        </ul>

        <h3>2. Mục Đích Sử Dụng Thông Tin</h3>
        <p>
          Chúng tôi chỉ sử dụng thông tin khách hàng cho các mục đích sau: Xử lý và giao hàng, liên hệ xác nhận đơn hàng, hỗ trợ dịch vụ khách hàng, gửi thông tin khuyến mãi (nếu khách hàng đồng ý).
        </p>

        <h3>3. Cam Kết Bảo Mật</h3>
        <p>
          Chúng tôi sử dụng các biện pháp bảo mật tiên tiến (mã hóa SSL) để bảo vệ thông tin cá nhân của bạn khỏi sự truy cập, sử dụng hoặc tiết lộ trái phép. Chúng tôi không bao giờ bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba.
        </p>
        
        <h3>4. Quyền của Khách Hàng</h3>
        <p>
          Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa bỏ thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ với bộ phận hỗ trợ của chúng tôi.
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;