import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/tours", label: "Tours" },
  { to: "/admin/destinations", label: "Destinations" },
  { to: "/admin/users", label: "Users" },
];

const AdminLayout = () => {
  return (
    <div className="admin-page admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-eyebrow">Meridian</span>
          <span className="admin-sidebar-title">Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar-link ${
                  isActive ? "admin-sidebar-link--active" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;