import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/slices/authSlice";

import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h2>User not found.</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">

          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>

            <p className="profile-tag">
              MEMBER PROFILE
            </p>

            <h1>{user.name}</h1>

            <p className="profile-role">
              {user.role.toUpperCase()}
            </p>

          </div>

        </div>

        <div className="ticket-divider"></div>

        <div className="profile-details">

          <div className="detail-box">

            <span>Name</span>

            <h3>{user.name}</h3>

          </div>

          <div className="detail-box">

            <span>Email</span>

            <h3>{user.email}</h3>

          </div>

          <div className="detail-box">

            <span>Role</span>

            <h3>{user.role}</h3>

          </div>

          <div className="detail-box">

            <span>Member Since</span>

            <h3>
              {new Date(
                user.createdAt
              ).toLocaleDateString()}
            </h3>

          </div>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Profile;