import { useSelector } from "react-redux";
import {
  FaUserShield,
  FaEnvelope,
  FaCalendarAlt,
  FaUserCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import "./AdminProfile.css";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
const navigate = useNavigate();
  return (
    <div className="admin-profile-page">
<div className="admin-profile-top">
  <button
    className="admin-back-btn"
    onClick={() => navigate("/admin")}
  >
    <FaArrowLeft />
    Dashboard
  </button>
</div>
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
  <h2>Account Summary</h2>

  <div className="admin-summary-item">
    <span>Role</span>
    <strong>Administrator</strong>
  </div>

  <div className="admin-summary-item">
    <span>Permissions</span>
    <strong>Full Access</strong>
  </div>

  <div className="admin-summary-item">
    <span>Status</span>
    <strong className="status-active">
      Active
    </strong>
  </div>
</div>

      </div>
    </div>
  );
};

export default AdminProfile;