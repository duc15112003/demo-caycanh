import React, { useMemo, useState } from "react";

const tabs = [
  {
    id: "purchase",
    label: "Mua hàng",
    eyebrow: "Quy trình",
    title: "Cách mua cây cảnh nhanh và rõ ràng hơn",
    description:
      "Tập trung vào các bước quan trọng từ chọn sản phẩm đến xác nhận đơn, tránh nội dung lan man và giúp khách dễ hoàn tất mua hàng.",
    bullets: [
      "Chọn danh mục cây, chậu hoặc phụ kiện phù hợp với nhu cầu sử dụng.",
      "Vào trang chi tiết để xem giá, mô tả, tồn kho và thêm vào giỏ hàng.",
      "Kiểm tra giỏ hàng trước khi chuyển sang bước thanh toán.",
    ],
    note: "Nếu mua làm quà tặng, bạn có thể thêm ghi chú ở bước checkout để shop chuẩn bị tốt hơn.",
  },
  {
    id: "payment",
    label: "Thanh toán",
    eyebrow: "Thanh toán & giao nhận",
    title: "Các cách thanh toán đang hỗ trợ",
    description:
      "Hệ thống hiện hỗ trợ thanh toán khi nhận hàng và thanh toán trực tuyến qua VNPAY theo đúng các API hiện có.",
    bullets: [
      "COD: xác nhận đơn trước, thanh toán khi nhận hàng.",
      "VNPAY: hệ thống tạo URL thanh toán và chuyển người dùng sang cổng thanh toán.",
      "Địa chỉ giao hàng là thông tin bắt buộc khi tạo đơn.",
    ],
    note: "Trong trường hợp thanh toán lỗi, giao diện sẽ map lại mã lỗi theo tài liệu lỗi để người dùng dễ hiểu hơn.",
  },
  {
    id: "policy",
    label: "Chính sách",
    eyebrow: "Hậu mãi",
    title: "Đổi trả và hỗ trợ sau mua",
    description:
      "Chúng tôi ưu tiên xử lý nhanh các trường hợp sản phẩm lỗi, hư hỏng do vận chuyển hoặc không đúng mô tả.",
    bullets: [
      "Kiểm tra tình trạng cây và chậu ngay khi nhận hàng.",
      "Liên hệ hỗ trợ sớm khi phát hiện sản phẩm có vấn đề.",
      "Cung cấp mã đơn hàng và hình ảnh để quá trình hỗ trợ nhanh hơn.",
    ],
    note: "Việc hỗ trợ cụ thể có thể thay đổi theo tình trạng thực tế của sản phẩm khi bàn giao.",
  },
  {
    id: "care",
    label: "Chăm cây",
    eyebrow: "Mẹo sử dụng",
    title: "Mẹo cơ bản để cây ổn định sau khi mua",
    description:
      "Cây mới về thường cần vài ngày để thích nghi. Chăm đúng giai đoạn đầu sẽ giúp cây vào form nhanh và giữ được vẻ đẹp lâu hơn.",
    bullets: [
      "Đặt cây ở nơi có ánh sáng phù hợp với từng loại cây.",
      "Không tưới quá nhiều nước ngay trong ngày đầu tiên.",
      "Theo dõi lá, đất trồng và độ thoáng khí trong tuần đầu sau khi nhận hàng.",
    ],
    note: "Nếu bạn chưa quen chăm cây, nên ưu tiên các dòng cây dễ sống và ít cần bảo dưỡng.",
  },
  {
    id: "support",
    label: "Hỗ trợ",
    eyebrow: "Liên hệ",
    title: "Kênh hỗ trợ khi cần tư vấn thêm",
    description:
      "Khi có thắc mắc về sản phẩm, đơn hàng hoặc chăm sóc cây, bạn có thể liên hệ qua các kênh hỗ trợ để được phản hồi nhanh hơn.",
    bullets: [
      "Hotline: 0838 369 639 - 09 6688 9393",
      "Email: support@treeshop.vn",
      "Trang liên hệ: khu vực Contact trên website",
    ],
    note: "Khi liên hệ, nên cung cấp mã đơn hàng hoặc tên sản phẩm để việc hỗ trợ chính xác hơn.",
  },
];

const GuidePage = () => {
  const [activeTab, setActiveTab] = useState("purchase");

  const activeContent = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) || tabs[0],
    [activeTab]
  );

  return (
    <section className="section-frame py-10 sm:py-12">
      <div className="mb-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] bg-[linear-gradient(140deg,_#052e16,_#065f46_55%,_#d1fae5)] p-8 text-white shadow-[0_28px_80px_rgba(6,95,70,0.18)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Trung tâm hướng dẫn</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Mọi thông tin cần thiết để mua cây cảnh và chăm cây dễ hơn.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/90">
            Trang này đã được làm lại bằng Tailwind để nội dung thoáng hơn, đọc nhanh hơn và không còn cảm giác rối như bản cũ.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-[1.75rem] border p-5 text-left transition ${
                activeTab === tab.id
                  ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
                  : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">0{index + 1}</p>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">{tab.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{tab.eyebrow}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center rounded-[1.25rem] px-4 py-4 text-left text-sm font-medium transition ${
                  activeTab === tab.id ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">{activeContent.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{activeContent.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{activeContent.description}</p>

          <div className="mt-8 grid gap-4">
            {activeContent.bullets.map((bullet, index) => (
              <div key={bullet} className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-700">{bullet}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            {activeContent.note}
          </div>
        </article>
      </div>
    </section>
  );
};

export default GuidePage;
