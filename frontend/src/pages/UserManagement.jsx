import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../api/adminApi";
import userApi from "../api/userApi";
import { isAdminRole } from "../utils/auth";
import "../assets/css/admin/admin_style.css";

const initialCreateUser = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  role: "USER",
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [passwordByUser, setPasswordByUser] = useState({});
  const [createUser, setCreateUser] = useState(initialCreateUser);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        const rows = Array.isArray(response) ? response : [];
        setUsers(rows);
        setPasswordByUser(
          rows.reduce((accumulator, user) => {
            accumulator[user.userId] = "";
            return accumulator;
          }, {})
        );
      } catch (error) {
        toast.error(error.customMessage || "Khong tai duoc danh sach nguoi dung");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdatePassword = async (userId) => {
    const password = passwordByUser[userId];
    if (!password || password.length < 6) {
      toast.warning("Mat khau moi toi thieu 6 ky tu");
      return;
    }

    try {
      await adminApi.updateUserPassword(userId, password);
      setPasswordByUser((previous) => ({ ...previous, [userId]: "" }));
      toast.success(`Cap nhat mat khau cho user #${userId} thanh cong`);
    } catch (error) {
      toast.error(error.customMessage || "Cap nhat mat khau that bai");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Ban co chac chan muon xoa user nay?")) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      setUsers((previous) => previous.filter((user) => user.userId !== userId));
      toast.success(`Da xoa user #${userId}`);
    } catch (error) {
      toast.error(error.customMessage || "Khong the xoa user");
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      const response = await adminApi.createUser(createUser);
      if (response?.user) {
        setUsers((previous) => [response.user, ...previous]);
      }
      setCreateUser(initialCreateUser);
      toast.success("Tao user moi thanh cong");
    } catch (error) {
      toast.error(error.customMessage || "Khong the tao user moi");
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase().trim();
    const nameText = `${user.fullName || ""}`.toLowerCase();
    const emailText = `${user.email || ""}`.toLowerCase();
    const matchesSearch = nameText.includes(keyword) || emailText.includes(keyword);
    if (roleFilter === "ALL") {
      return matchesSearch;
    }
    return matchesSearch && (roleFilter === "ADMIN" ? isAdminRole(user.role) : !isAdminRole(user.role));
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return (
    <AdminLayout title="Quan ly nguoi dung" subtitle="Tao user, doi mat khau va xoa tai khoan">
      <form onSubmit={handleCreateUser} className="adm-form">
        <h3>Tao nguoi dung moi</h3>
        <div className="adm-form-grid">
          <label>
            Ho ten
            <input
              type="text"
              value={createUser.fullName}
              onChange={(event) => setCreateUser((previous) => ({ ...previous, fullName: event.target.value }))}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={createUser.email}
              onChange={(event) => setCreateUser((previous) => ({ ...previous, email: event.target.value }))}
              required
            />
          </label>
          <label>
            Mat khau
            <input
              type="password"
              value={createUser.password}
              onChange={(event) => setCreateUser((previous) => ({ ...previous, password: event.target.value }))}
              required
            />
          </label>
          <label>
            So dien thoai
            <input
              type="text"
              value={createUser.phone}
              onChange={(event) => setCreateUser((previous) => ({ ...previous, phone: event.target.value }))}
            />
          </label>
          <label className="adm-form-full">
            Dia chi
            <input
              type="text"
              value={createUser.address}
              onChange={(event) => setCreateUser((previous) => ({ ...previous, address: event.target.value }))}
            />
          </label>
          <label>
            Vai tro
            <select
              value={createUser.role}
              onChange={(event) => setCreateUser((previous) => ({ ...previous, role: event.target.value }))}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
        </div>
        <button type="submit" className="adm-btn">
          Tao user
        </button>
      </form>

      {loading ? (
        <div className="adm-loading">Dang tai danh sach user...</div>
      ) : (
        <div className="adm-table-wrap">
          <div className="adm-toolbar adm-toolbar-inner">
            <input
              type="text"
              value={search}
              placeholder="Tim theo ten/email..."
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="adm-input"
            />
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">Tat ca vai tro</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Thong tin</th>
                <th>Vai tro</th>
                <th>Cap nhat mat khau</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="adm-table-empty">
                    Chua co user nao
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>
                      <strong>{user.fullName}</strong>
                      <br />
                      <span>{user.email}</span>
                    </td>
                    <td>
                      <span className={isAdminRole(user.role) ? "adm-badge adm-badge-admin" : "adm-badge"}>
                        {isAdminRole(user.role) ? "ADMIN" : "USER"}
                      </span>
                    </td>
                    <td>
                      <div className="adm-inline-control">
                        <input
                          type="password"
                          value={passwordByUser[user.userId] || ""}
                          placeholder="Mat khau moi"
                          onChange={(event) =>
                            setPasswordByUser((previous) => ({
                              ...previous,
                              [user.userId]: event.target.value,
                            }))
                          }
                        />
                        <button type="button" onClick={() => handleUpdatePassword(user.userId)} className="adm-btn">
                          Luu
                        </button>
                      </div>
                    </td>
                    <td className="adm-actions">
                      <button
                        type="button"
                        onClick={() => handleDelete(user.userId)}
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

export default UserManagement;