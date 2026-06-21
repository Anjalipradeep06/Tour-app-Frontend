import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChartPie,
  FaSuitcase,
  FaGlobeAsia,
  FaUsers,
  FaBell,
  FaCog,
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

import { logout } from "../../redux/slices/authSlice";
import { getUnreadCount } from "../../redux/thunks/notificationThunk";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);

  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    dispatch(getUnreadCount());

    const interval = setInterval(() => {
      dispatch(getUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAccountOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* Topbar */}

      <header className="admin-topbar">

        <div className="admin-topbar-search">
          <FaSearch className="admin-topbar-search-icon" />
          <input
            type="text"
            placeholder="Search bookings, tours, travelers…"
          />
        </div>

        <div className="admin-topbar-right">

          <button
            className="admin-topbar-icon-btn"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="admin-topbar-dot" />
            )}
          </button>

          <div className="admin-topbar-account-wrapper" ref={accountRef}>
            <button
              className="admin-topbar-account"
              onClick={() => setAccountOpen((prev) => !prev)}
              aria-expanded={accountOpen}
            >
              <FaUserCircle className="admin-topbar-avatar" />
              <span>{user?.name || "Admin"}</span>
              <FaChevronDown className="admin-topbar-caret" />
            </button>

            {accountOpen && (
              <div className="admin-topbar-dropdown" role="menu">
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

          <button
            className="sidebar-btn"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle />
            Profile
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/notifications")}
          >
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