import React from 'react';

const WarrantyPolicy = () => {
  return (
    <section className="home-content">
      <style>{`
        .warranty-container {
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }
        .warranty-container h1 {
          color: #1b4332;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
        }
        .warranty-section {
          padding: 20px;
          border: 1px solid #c7e8d2;
          border-radius: 10px;
          margin-bottom: 25px;
          background-color: #f7fcf7;
        }
        .warranty-section h3 {
          color: #2d6a4f;
          font-size: 20px;
          margin-bottom: 10px;
        }
        .warranty-section ul { list-style: none; padding: 0; }
        .warranty-section li {
          position: relative;
          padding-left: 25px;
          line-height: 1.8;
          margin-bottom: 10px;
        }
        .warranty-section li:before {
          content: "✔";
          position: absolute;
          left: 0;
          color: #d4a373;
          font-weight: bold;
        }
      `}</style>

      <div className="warranty-container">
        <h1>🛡️ Chính Sách Bảo Hành</h1>
        
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          Chúng tôi cam kết chất lượng sản phẩm. Chính sách bảo hành này đảm bảo quyền lợi tốt nhất cho cây của bạn.
        </p>
        
        <div className="warranty-section">
          <h3>1. Thời gian Bảo hành</h3>
          <ul>
            <li>Thời gian bảo hành mặc định: 07 ngày kể từ ngày nhận hàng.</li>
            <li>Áp dụng cho tất cả các loại cây cảnh có giá trị từ 100.000 VNĐ trở lên.</li>
          </ul>
        </div>

        <div className="warranty-section">
          <h3>2. Điều kiện được Bảo hành</h3>
          <ul>
            <li>Cây bị chết hoặc có dấu hiệu bệnh nặng, không thể phục hồi trong vòng 07 ngày.</li>
            <li>Cây bị gãy, dập nát nghiêm trọng do quá trình vận chuyển.</li>
            <li>Giao sai loại cây hoặc kích thước đã đặt.</li>
          </ul>
        </div>
        
        <div className="warranty-section">
          <h3>3. Trường hợp từ chối Bảo hành</h3>
          <ul>
            <li>Cây chết do chăm sóc sai kỹ thuật, tưới nước quá nhiều/quá ít, hoặc đặt sai vị trí ánh sáng (sau 07 ngày).</li>
            <li>Thiệt hại do thiên tai (bão lũ, động đất) hoặc do côn trùng, thú cưng gây ra.</li>
            <li>Khách hàng đã tự ý thay chậu, cắt tỉa hoặc can thiệp mạnh vào cây.</li>
          </ul>
        </div>
        
        <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#888' }}>
          Vui lòng giữ lại hóa đơn và liên hệ ngay với chúng tôi khi có vấn đề về cây qua hotline.
        </p>
      </div>
    </section>
  );
};

export default WarrantyPolicy;