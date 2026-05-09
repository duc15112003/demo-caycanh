import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import authApi from "../api/authApi";
import { logoutSuccess } from "../redux/slices/authSlice";
import "../assets/css/admin/admin_style.css";

const navItems = [
  { path: "/admin/dashboard", label: "Tong quan", icon: "▦" },
  { path: "/admin/product", label: "San pham", icon: "◫" },
  { path: "/admin/orders", label: "Don hang", icon: "◎" },
  { path: "/admin/users", label: "Nguoi dung", icon: "◉" },
];

const AdminLayout = ({ children, title = "Quan tri he thong", subtitle = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Van cho phep logout local state ngay ca khi backend loi.
    } finally {
      dispatch(logoutSuccess());
      toast.success("Da dang xuat khoi trang quan tri");
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="adm-brand-logo">PC</div>
          <div>
            <strong>Plant Commerce</strong>
            <p>Admin Workspace</p>
          </div>
        </div>
        <nav className="adm-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "adm-nav-link active" : "adm-nav-link")}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <span>He thong quan tri da ket noi API</span>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <div className="adm-topbar-right">
            <div className="adm-profile">
              <span className="adm-user-chip">{(user?.fullName || user?.email || "Admin").slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{user?.fullName || user?.email || "Admin"}</strong>
                <p>{user?.role || "ADMIN"}</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="adm-btn adm-btn-danger">
              Dang xuat
            </button>
          </div>
        </header>
        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;