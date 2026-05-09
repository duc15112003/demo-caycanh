import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="section-frame grid gap-10 py-16 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.28em] text-emerald-300">Tree Shop</p>
          <h3 className="text-2xl font-semibold text-white">Cây xanh, chậu đẹp và phụ kiện cho không gian sống tinh gọn.</h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Giao diện đã được chuyển sang Tailwind theo hướng hiện đại hơn, tập trung vào trải nghiệm mua hàng và theo dõi đơn.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Điều hướng</h4>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <Link to="/about" className="transition hover:text-emerald-300">
              Giới thiệu
            </Link>
            <Link to="/contact" className="transition hover:text-emerald-300">
              Liên hệ
            </Link>
            <Link to="/instruction" className="transition hover:text-emerald-300">
              Hướng dẫn chăm cây
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Liên hệ</h4>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>Hà Nội, Việt Nam</p>
            <p>0838 369 639 - 09 6688 9393</p>
            <p>support@treeshop.vn</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-frame flex flex-col gap-3 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Tree Shop. All rights reserved.</p>
          <p>Thiết kế lại bằng Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
