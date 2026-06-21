import { NavLink, Outlet } from "react-router-dom";
import {
  FaChartPie,
  FaSuitcase,
  FaGlobeAsia,
  FaUsers,
  FaBell,
  FaCog,
} from "react-icons/fa";

import "./AdminLayout.css";

const NAV_ITEMS = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: <FaChartPie />,
    end: true,
  },
  {
    to: "/admin/tours",
    label: "Tours",
    icon: <FaSuitcase />,
  },
  {
    to: "/admin/destinations",
    label: "Destinations",
    icon: <FaGlobeAsia />,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: <FaUsers />,
  },
];

const AdminLayout = () => {
  return (
    <div className="admin-layout">

      {/* Sidebar */}

      <aside className="admin-sidebar">

        <div className="sidebar-logo">

          <p className="sidebar-small">
            MERIDIAN
          </p>

          <h2>
            Travel Admin
          </h2>

        </div>

        <nav className="sidebar-menu">

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}

        </nav>

        <div className="sidebar-footer">

          <button className="sidebar-btn">
            <FaBell />
            Notifications
          </button>

          <button className="sidebar-btn">
            <FaCog />
            Settings
          </button>

        </div>

      </aside>

      {/* Content */}

      <main className="admin-content">

        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;