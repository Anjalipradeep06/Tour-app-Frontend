import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  logout,
  clearMessage,
  clearError,
} from "../../redux/slices/authSlice";

import { getUserBookings } from "../../redux/thunks/bookingThunk";

import EditProfileModal from "./EditProfileModal";

import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, message, error } = useSelector(
    (state) => state.auth
  );

  // ⚠️ Verify this matches your store.js key — should be
  // whatever key bookingSlice is registered under in configureStore.
  const { totalBookings } = useSelector(
    (state) =>
      state.booking || {
        totalBookings: 0,
      }
  );

  const [showEditModal, setShowEditModal] =
    useState(false);

  // ================= FETCH USER'S BOOKINGS =================
  useEffect(() => {
    dispatch(getUserBookings({ page: 1, limit: 5 }));
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <h2>User not found</h2>
        </div>
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "Recently";

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero-overlay">
          <div className="profile-hero-content">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <span className="profile-badge">
                VERIFIED TRAVELER
              </span>

              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="profile-container">
        <div className="profile-stats">
          <div className="stat-card">
            <h3>{totalBookings}</h3>
            <span>Total Bookings</span>
          </div>

          <div className="stat-card">
            <h3>{joinDate}</h3>
            <span>Member Since</span>
          </div>

          <div className="stat-card">
            <h3>
              {user.role === "admin"
                ? "Admin"
                : "Traveler"}
            </h3>
            <span>Account Type</span>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Account Information</h2>

              <button
                className="profile-edit-btn"
                onClick={() =>
                  setShowEditModal(true)
                }
              >
                <FaPencilAlt />
              </button>
            </div>

            <div className="detail-item">
              <span>Full Name</span>
              <p>{user.name}</p>
            </div>

            <div className="detail-item">
              <span>Email Address</span>
              <p>{user.email}</p>
            </div>

            <div className="detail-item">
              <span>Role</span>
              <p>
                {user.role === "admin"
                  ? "Administrator"
                  : "Traveler"}
              </p>
            </div>

            <div className="detail-item">
              <span>Member Since</span>
              <p>{joinDate}</p>
            </div>
          </div>

          <div className="profile-card">
            <h2>Quick Actions</h2>

            <div className="action-list">
              <Link
                to="/bookings"
                className="action-link"
              >
                View My Bookings
              </Link>

              <Link
                to="/notifications"
                className="action-link"
              >
                Notifications
              </Link>

              <Link
                to="/search"
                className="action-link"
              >
                Explore Tours
              </Link>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() =>
            setShowEditModal(false)
          }
        />
      )}
    </div>
  );
};

export default Profile;