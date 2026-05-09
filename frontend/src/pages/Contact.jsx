import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [contactInfo] = useState({
    address: "123 Đường Cây Xanh, Phường Mầm Cây, Quận Thảo Mộc, TP. HCM",
    phone: "0838 369 639 - 09 6668 9993",
    email: "hotro@gmail.com",
    openingHours: "Thứ Hai - Chủ Nhật: 08:30 - 22:00"
  });

  return (
    <section className="home-content contact-page">
      <div className="contact-container">
        <h1>🌿 Liên Hệ Với HCMUNRE</h1>
        
        <div className="contact-grid">
          <div className="contact-info-wrapper">
            <h3 className="section-title">Thông tin liên hệ</h3>
            <p className="section-desc">
              Chúng tôi luôn sẵn lòng lắng nghe và phục vụ bạn. Đừng ngần ngại liên hệ qua các kênh dưới đây.
            </p>
            
            <div className="info-card">
              <div className="info-item">
                <div className="item-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="item-content">
                  <div className="item-label">Địa chỉ</div>
                  <div className="item-value">{contactInfo.address}</div>
                </div>
              </div>
              
              <div className="info-item">
                <div className="item-icon"><i className="fas fa-phone-alt"></i></div>
                <div className="item-content">
                  <div className="item-label">Điện thoại</div>
                  <div className="item-value">{contactInfo.phone}</div>
                </div>
              </div>
              
              <div className="info-item">
                <div className="item-icon"><i className="fas fa-envelope"></i></div>
                <div className="item-content">
                  <div className="item-label">Email hỗ trợ</div>
                  <div className="item-value">{contactInfo.email}</div>
                </div>
              </div>
              
              <div className="info-item">
                <div className="item-icon"><i className="fas fa-clock"></i></div>
                <div className="item-content">
                  <div className="item-label">Giờ mở cửa</div>
                  <div className="item-value">{contactInfo.openingHours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;