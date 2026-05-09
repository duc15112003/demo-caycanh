import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import productApi from "../api/productApi";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productApi.getAllProducts();
      setProducts(Array.isArray(response) ? response : []);
    } catch (error) {
      toast.error(error.customMessage || "Khong tai duoc danh sach san pham");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Ban co chac chan muon xoa san pham nay?")) {
      return;
    }

    try {
      await productApi.deleteProduct(id);
      setProducts((previous) => previous.filter((item) => item.productId !== id));
      toast.success("Xoa san pham thanh cong");
    } catch (error) {
      toast.error(error.customMessage || "Khong the xoa san pham");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.productName || ""}`.toLowerCase().includes(search.toLowerCase().trim());
    if (statusFilter === "ALL") {
      return matchesSearch;
    }
    return matchesSearch && (statusFilter === "ACTIVE" ? Boolean(product.active) : !product.active);
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  return (
    <AdminLayout title="Quan ly san pham" subtitle="Theo doi ton kho va cap nhat thong tin">
      <div className="adm-toolbar">
        <input
          type="text"
          value={search}
          placeholder="Tim theo ten san pham..."
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="adm-input"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">Tat ca trang thai</option>
          <option value="ACTIVE">Dang ban</option>
          <option value="INACTIVE">Dang an</option>
        </select>
        <Link to="/admin/product/add" className="adm-btn">
          Them san pham
        </Link>
      </div>

      {loading ? (
        <div className="adm-loading">Dang tai danh sach san pham...</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ten san pham</th>
                <th>Gia</th>
                <th>Ton kho</th>
                <th>Trang thai</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="adm-table-empty">
                    Chua co san pham nao
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{Number(product.price || 0).toLocaleString("vi-VN")} VND</td>
                    <td>{product.stock ?? 0}</td>
                    <td>
                      <span className={product.active ? "adm-badge adm-badge-success" : "adm-badge"}>
                        {product.active ? "Dang ban" : "An"}
                      </span>
                    </td>
                    <td className="adm-actions">
                      <Link to={`/admin/product/edit/${product.productId}`} className="adm-btn adm-btn-subtle">
                        Sua
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.productId)}
                        className="adm-btn adm-btn-danger"
                      >
                        Xoa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="adm-pagination">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage((previous) => previous - 1)}>
              Truoc
            </button>
            <span>
              Trang {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((previous) => previous + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductManagement;