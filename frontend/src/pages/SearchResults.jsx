import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import productApi from "../api/productApi";

const resolveImage = (image) => {
  if (!image) return "https://placehold.co/640x640?text=Tree+Shop";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/images/${image}`;
};

const formatCurrency = (price) =>
  Number(price || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await productApi.searchProducts(keyword.trim());
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  return (
    <section className="section-frame py-10 sm:py-12">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(140deg,_#052e16,_#065f46_55%,_#d1fae5)] p-8 text-white shadow-[0_28px_80px_rgba(6,95,70,0.18)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Tìm kiếm sản phẩm</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Kết quả cho từ khóa “{keyword || "..." }”</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/90">
          Khi bấm tìm kiếm từ thanh search, hệ thống gọi API `GET /api/products/search` và trả về danh sách sản phẩm phù hợp.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          Đang tìm sản phẩm...
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <h2 className="text-2xl font-semibold text-slate-900">Không tìm thấy sản phẩm phù hợp</h2>
          <p className="mt-3 text-slate-600">Hãy thử từ khóa khác hoặc quay lại danh mục sản phẩm để tiếp tục mua sắm.</p>
          <Link to="/product" className="primary-button mt-8">
            Xem tất cả sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {results.map((product) => (
            <Link
              key={product.productId}
              to={`/product/${product.productId}`}
              className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(16,185,129,0.12)]"
            >
              <div className="aspect-[4/4.2] overflow-hidden bg-slate-100">
                <img
                  src={resolveImage(product.image)}
                  alt={product.productName}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div>
                  <p className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-slate-900">
                    {product.productName}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {product.description || "Sản phẩm phù hợp với nhu cầu mua bán cây cảnh và trang trí không gian sống."}
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
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;
