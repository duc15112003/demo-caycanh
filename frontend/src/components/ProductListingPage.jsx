import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import productApi from "../api/productApi";

const ITEMS_PER_PAGE = 8;

const resolveImage = (image) => {
  if (!image) return "https://placehold.co/640x640?text=Tree+Shop";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/images/${image}`;
};

const formatCurrency = (price) =>
  Number(price || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductListingPage = ({ categoryId, title, subtitle, badgeLabel }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductsByCategory(categoryId);
        setProducts(data || []);
      } catch (error) {
        toast.error(error.customMessage || "Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  return (
    <section className="section-frame py-10 sm:py-12">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_260px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">{badgeLabel}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{subtitle}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-right shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <p className="text-sm text-slate-500">Tổng sản phẩm</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">{products.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          Đang tải sản phẩm...
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {paginatedProducts.map((product) => {
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
                      <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        {badgeLabel}
                      </div>
                      <h2 className="mt-4 line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-slate-900">
                        {product.productName || product.name}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description || "Sản phẩm phù hợp cho nhu cầu mua bán cây cảnh và trang trí không gian sống."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-semibold text-emerald-700">{formatCurrency(product.price)}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          Number(product.stock) > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {Number(product.stock) > 0 ? "Sẵn hàng" : "Hết hàng"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {products.length > ITEMS_PER_PAGE && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trang trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-11 min-w-[44px] items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductListingPage;
