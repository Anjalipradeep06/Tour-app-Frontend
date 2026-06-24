import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaChartPie,
  FaSuitcase,
  FaGlobeAsia,
  FaUsers,
  FaCog,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

import { logout } from "../../redux/slices/authSlice";

import "./AdminLayout.css";

const NAV_ITEMS = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: <FaChartPie />,
    end: true,
  },
  {
    to: "/admin/bookings",
    label: "Manage Bookings",
    icon: <FaSuitcase />,
  },
  {
    to: "/admin/tours",
    label: "Tours",
    icon: <FaGlobeAsia />,
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    setAccountOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* TOPBAR */}
      <header className="admin-topbar">

        <div className="admin-brand">
          MERIDIAN ADMIN
        </div>

        <div className="admin-topbar-right">

          <div
            className="admin-topbar-account-wrapper"
            ref={accountRef}
          >
            <button
              className="admin-topbar-account"
              onClick={() =>
                setAccountOpen((prev) => !prev)
              }
            >
              <FaUserCircle
                className="admin-topbar-avatar"
              />

              <span>
                {user?.name || "Admin"}
              </span>

              <FaChevronDown
                className="admin-topbar-caret"
              />
            </button>

            {accountOpen && (
              <div className="admin-topbar-dropdown">

                <button
                  className="admin-topbar-dropdown-item"
                  onClick={() => {
                    setAccountOpen(false);
                    navigate("/admin/profile");
                  }}
                >
                  <FaUserCircle />
                  Profile
                </button>

                <button
                  className="admin-topbar-dropdown-item"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="sidebar-logo">
          <p className="sidebar-small">
            MERIDIAN
          </p>

          <h2>Travel Admin</h2>
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

          <button
            className="sidebar-btn"
            onClick={() =>
              navigate("/admin/profile")
            }
          >
            <FaUserCircle />
            Profile
          </button>

          <button
            className="sidebar-btn"
           
          >
            <FaCog />
            Settings
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;