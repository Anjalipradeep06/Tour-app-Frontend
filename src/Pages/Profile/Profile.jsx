import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { logout } from "../../redux/slices/authSlice";

import "./Profile.css";

const Profile = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const { bookings } = useSelector(
    (state) => state.bookings || {
      bookings: [],
    }
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    ? new Date(
        user.createdAt
      ).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero-overlay">
          <div className="profile-hero-content">
            <div className="profile-avatar">
              {user.name
                ?.charAt(0)
                .toUpperCase()}
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
            <h3>{bookings?.length || 0}</h3>
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
            <h2>Account Information</h2>

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
    </div>
  );
};

export default Profile;