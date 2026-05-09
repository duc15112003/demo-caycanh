import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../api/productApi";

const featureItems = [
  {
    title: "Chăm sóc tận tâm",
    description: "Mỗi cây được kiểm tra tình trạng trước khi giao, phù hợp cho nhà ở và văn phòng.",
  },
  {
    title: "Chất lượng rõ ràng",
    description: "Sản phẩm đúng mô tả, ưu tiên giống cây dễ chăm và giữ form ổn định lâu dài.",
  },
  {
    title: "Đổi trả linh hoạt",
    description: "Hỗ trợ đổi trả nhanh khi sản phẩm lỗi từ phía nhà cung cấp hoặc vận chuyển.",
  },
  {
    title: "Giao hàng nhanh",
    description: "Đóng gói gọn, chắc và tối ưu cho quá trình vận chuyển toàn quốc.",
  },
];

const testimonials = [
  {
    name: "Thành Lê",
    role: "Freelancer",
    quote:
      "Cây nhận được rất khỏe, form đẹp và gói hàng chắc. Đặt ở bàn làm việc nhìn gọn và sáng không gian hơn hẳn.",
  },
  {
    name: "Phương Nga",
    role: "Nhân viên văn phòng",
    quote:
      "Shop tư vấn cây hợp không gian nhỏ khá tốt. Mình mua nhiều lần và chất lượng các đợt đều ổn định.",
  },
];

const resolveImage = (image) => {
  if (!image) return "https://placehold.co/640x640?text=Tree+Shop";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/images/${image}`;
};

const formatCurrency = (price) =>
  Number(price || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductSection = ({ title, subtitle, products, linkTo }) => (
  <section className="section-frame py-10 sm:py-12">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Danh mục nổi bật</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>
      <Link to={linkTo} className="secondary-button">
        Xem thêm
      </Link>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => {
        const id = product.productId || product.id;
        return (
          <Link
            key={id}
            to={`/product/${id}`}
            className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(16,185,129,0.12)]"
          >
            <div className="aspect-[4/4.2] overflow-hidden bg-slate-100">
              <img
                src={resolveImage(product.image)}
                alt={product.productName || product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4 p-5">
              <div>
                <p className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-slate-900">
                  {product.productName || product.name}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {product.description || "Thiết kế xanh gọn gàng, dễ phối với không gian hiện đại."}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-emerald-700">{formatCurrency(product.price)}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Chi tiết
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);

const Home = () => {
  const [cayCanh, setCayCanh] = useState([]);
  const [chauCay, setChauCay] = useState([]);
  const [phuKien, setPhuKien] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productApi.getHomeData({ plantLimit: 4, potLimit: 4, accessoryLimit: 4 });
        setCayCanh((response.cayCanh || []).slice(0, 4));
        setChauCay((response.chauCay || []).slice(0, 4));
        setPhuKien((response.phuKien || []).slice(0, 4));
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trang chủ:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-8">
      <section className="section-frame pt-8 sm:pt-10">
        <div className="grid overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#052e16_0%,_#065f46_52%,_#d1fae5_100%)] shadow-[0_30px_80px_rgba(6,95,70,0.18)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 text-white sm:p-12 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-100">Tree Shop</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
              Chọn cây, chậu và phụ kiện phù hợp cho từng không gian sống một cách nhanh và trực quan hơn.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/90">
              Chúng tôi tập trung vào cây cảnh, chậu cây và phụ kiện có tính ứng dụng cao cho nhà ở, văn phòng và không gian nhỏ.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/product" className="inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
                Mua ngay
              </Link>
              <Link
                to="/instruction"
                className="inline-flex items-center rounded-2xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Xem hướng dẫn
              </Link>
            </div>
          </div>

          <div className="grid gap-4 bg-white/8 p-6 sm:grid-cols-2 sm:p-8">
            {featureItems.map((item, index) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-emerald-50/85">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductSection
        title="Cây cảnh văn phòng"
        subtitle="Nhóm cây dễ chăm, bố cục cân đối và phù hợp cho mặt bàn, kệ thấp hoặc góc làm việc."
        products={cayCanh}
        linkTo="/product/cay"
      />

      <ProductSection
        title="Chậu cây"
        subtitle="Chọn chậu theo phong cách tối giản, hiện đại hoặc nhấn điểm cho không gian nhỏ."
        products={chauCay}
        linkTo="/product/chau"
      />

      <ProductSection
        title="Phụ kiện trang trí"
        subtitle="Các phụ kiện hỗ trợ chăm cây và trang trí được hiển thị theo cùng cấu trúc thẻ để giao diện đồng đều hơn."
        products={phuKien}
        linkTo="/product/phukien"
      />

      <section className="section-frame py-10 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Khách hàng</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Đánh giá thực tế</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Phần tổng quan được làm lại theo hướng ít khoảng trắng thừa, chiều cao thẻ đồng đều và dễ quét nội dung hơn.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
              >
                <p className="text-base leading-7 text-slate-700">“{item.quote}”</p>
                <div className="mt-8 border-t border-slate-100 pt-5">
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
