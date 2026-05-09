import React, { useState } from 'react';
import './AboutUs.css'; // File CSS đính kèm bên dưới

const AboutUs = () => {
  // Dữ liệu mẫu (có thể thay thế bằng API sau này)
  const [missionData] = useState([
    {
      id: 1,
      title: "Sứ Mệnh Của Chúng Tôi",
      content: "Cung cấp những loại cây cảnh chất lượng cao, dễ chăm sóc, cùng với kiến thức và công cụ cần thiết để bất kỳ ai cũng có thể trở thành một 'người làm vườn' thành công.",
      type: "text"
    },
    {
      id: 2,
      title: "Giá Trị Cốt Lõi",
      content: [
        "Chất lượng: Tuyển chọn kỹ lưỡng từng chậu cây, đảm bảo cây khỏe mạnh, xanh tốt.",
        "Tận tâm: Hỗ trợ và tư vấn chăm sóc cây trọn đời, giải đáp mọi thắc mắc của khách hàng.",
        "Bền vững: Ưu tiên các sản phẩm thân thiện với môi trường và bao bì có thể tái chế."
      ],
      type: "list"
    },
    {
      id: 3,
      title: "Tầm Nhìn",
      content: "Trở thành chuỗi cửa hàng cây cảnh và phụ kiện hàng đầu Việt Nam, được khách hàng tin tưởng và lựa chọn nhờ vào sự chuyên nghiệp, thân thiện và chất lượng sản phẩm vượt trội.",
      type: "text"
    }
  ]);

  return (
    <section className="home-content about-page">
      <div className="about-container">
        <h1>🌱 Về cửa hàng cây cảnh của chúng tôi</h1>
        
        <p>
          Plants được thành lập với niềm đam mê bất tận dành cho cây xanh và mong muốn mang thiên nhiên vào không gian sống của mỗi người Việt. Chúng tôi tin rằng, một chút màu xanh không chỉ làm đẹp thêm ngôi nhà, văn phòng mà còn là liệu pháp tinh thần tuyệt vời.
        </p>

        {missionData.map((item) => (
          <div key={item.id} className="mission-box">
            <h3>{item.title}</h3>
            {item.type === "list" ? (
              <ul>
                {item.content.map((li, index) => (
                  <li key={index}>{li}</li>
                ))}
              </ul>
            ) : (
              <p>{item.content}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;
