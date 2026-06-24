import { useSelector } from "react-redux";
import {
  FaUserShield,
  FaEnvelope,
  FaCalendarAlt,
  FaUserCog,
  FaLock,
} from "react-icons/fa";

import "./AdminProfile.css";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="admin-profile-page">

      <div className="admin-profile-header">
        <div className="admin-profile-avatar">
          <FaUserShield />
        </div>

        <div>
          <h1>{user?.name}</h1>
          <p>Administrator Account</p>
        </div>
      </div>

      <div className="admin-profile-grid">

        <div className="admin-profile-card">
          <h2>Account Information</h2>

          <div className="admin-info-item">
            <FaUserShield />
            <div>
              <span>Name</span>
              <strong>{user?.name}</strong>
            </div>
          </div>

          <div className="admin-info-item">
            <FaEnvelope />
            <div>
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>
          </div>

          <div className="admin-info-item">
            <FaUserCog />
            <div>
              <span>Role</span>
              <strong>
                {user?.role?.toUpperCase()}
              </strong>
            </div>
          </div>

          <div className="admin-info-item">
            <FaCalendarAlt />
            <div>
              <span>Account Status</span>
              <strong>Active</strong>
            </div>
          </div>
        </div>

        <div className="admin-profile-card">
          <h2>Quick Actions</h2>

          <button className="admin-action-btn">
            <FaUserCog />
            Edit Profile
          </button>

          <button className="admin-action-btn">
            <FaLock />
            Change Password
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;