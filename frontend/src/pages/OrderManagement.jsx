import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../api/adminApi";
import "../assets/css/admin/admin_style.css";

const defaultStatusOptions = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusByOrder, setStatusByOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await adminApi.getOrders();
        const rows = Array.isArray(response) ? response : [];
        setOrders(rows);
        setStatusByOrder(
          rows.reduce((accumulator, order) => {
            accumulator[order.orderId] = order.status || "PENDING";
            return accumulator;
          }, {})
        );
      } catch (error) {
        toast.error(error.customMessage || "Khong tai duoc danh sach don hang");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusOptions = useMemo(() => {
    const fromOrders = orders.map((order) => order.status).filter(Boolean);
    return Array.from(new Set([...defaultStatusOptions, ...fromOrders]));
  }, [orders]);

  const handleUpdateStatus = async (orderId) => {
    const nextStatus = statusByOrder[orderId];
    try {
      const response = await adminApi.updateOrderStatus(orderId, nextStatus);
      setOrders((previous) =>
        previous.map((order) => (order.orderId === orderId ? { ...order, status: response.status || nextStatus } : order))
      );
      toast.success(`Da cap nhat trang thai don #${orderId}`);
    } catch (error) {
      toast.error(error.customMessage || "Cap nhat trang thai that bai");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Ban co chac chan muon xoa don hang nay?")) {
      return;
    }

    try {
      await adminApi.deleteOrder(orderId);
      setOrders((previous) => previous.filter((order) => order.orderId !== orderId));
      toast.success(`Da xoa don #${orderId}`);
    } catch (error) {
      toast.error(error.customMessage || "Khong the xoa don hang");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase().trim();
    const customerText = `${order.fullName || ""}`.toLowerCase();
    const orderIdText = `${order.orderId || ""}`.toLowerCase();
    const matchesSearch = customerText.includes(searchText) || orderIdText.includes(searchText);
    if (statusFilter === "ALL") {
      return matchesSearch;
    }
    return matchesSearch && (order.status || "PENDING") === statusFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  return (
    <AdminLayout title="Quan ly don hang" subtitle="Cap nhat trang thai va xoa don khong hop le">
      <div className="adm-toolbar">
        <input
          type="text"
          value={search}
          placeholder="Tim theo ma don/ten khach..."
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
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="adm-loading">Dang tai danh sach don hang...</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Ma don</th>
                <th>Khach hang</th>
                <th>Ngay dat</th>
                <th>Tong tien</th>
                <th>Trang thai</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="adm-table-empty">
                    Chua co don hang nao
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{order.fullName || `User #${order.userId}`}</td>
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleString("vi-VN") : "--"}</td>
                    <td>{Number(order.totalAmount || 0).toLocaleString("vi-VN")} VND</td>
                    <td>
                      <select
                        value={statusByOrder[order.orderId] || "PENDING"}
                        onChange={(event) =>
                          setStatusByOrder((previous) => ({
                            ...previous,
                            [order.orderId]: event.target.value,
                          }))
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="adm-actions">
                      <button type="button" onClick={() => handleUpdateStatus(order.orderId)} className="adm-btn">
                        Cap nhat
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(order.orderId)}
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

export default OrderManagement;