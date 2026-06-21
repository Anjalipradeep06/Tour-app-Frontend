import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout } from "../../redux/slices/authSlice";
import NotificationBell from "../NotificationBell/NotificationBell";

import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const isAdminRoute = location.pathname.startsWith("/admin");

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully", {
      toastId: "logout-success",
    });

    closeMenu();

    navigate("/login");
  };

  return (
    <header
      className={`navbar ${
        scrolled || isAdminRoute
          ? "navbar-scrolled"
          : ""
      } ${
        isAdminRoute ? "navbar-admin" : ""
      }`}
    >
      <div className="navbar-container">
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          MERIDIAN
        </Link>

        <button
          className="menu-toggle"
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}
        >
          <NavLink
            to="/"
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            onClick={closeMenu}
          >
            Tours
          </NavLink>

          {user && (
            <NavLink
              to="/bookings"
              onClick={closeMenu}
            >
              Bookings
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/profile"
              onClick={closeMenu}
            >
              Profile
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="register-btn"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NotificationBell />

              <span className="user-name">
                {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;