import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "../../redux/thunks/adminThunk";

import { resetAdminError } from "../../redux/slices/adminSlice";

import "./AdminDashboard.css";

const LIMIT = 4;

const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, allBookings = [], loading, error } = useSelector(
    (state) => state.admin
  );

  const [activeTab] = useState("all");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    dispatch(getDashboardStats());
    dispatch(getAllBookings());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveBooking(id)).then((result) => {
      if (approveBooking.fulfilled.match(result)) {
        toast.success("Booking approved successfully!");
        dispatch(getAllBookings());
      } else {
        toast.error(result.payload || "Failed to approve booking");
      }
    });
  };

  const handleReject = (id) => {
    if (!window.confirm("Reject this booking?")) return;

    dispatch(rejectBooking(id)).then((result) => {
      if (rejectBooking.fulfilled.match(result)) {
        toast.success("Booking rejected.");
        dispatch(getAllBookings());
      } else {
        toast.error(result.payload || "Failed to reject booking");
      }
    });
  };

  // ✅ SAFE: always array
  const filteredBookings = Array.isArray(allBookings)
    ? activeTab === "all"
      ? allBookings
      : allBookings.filter((b) => b?.status === activeTab)
    : [];

  const limitedBookings = filteredBookings.slice(0, LIMIT);

  const statCards = [
    { label: "Total users", value: stats?.users ?? "—" },
    { label: "Total tours", value: stats?.tours ?? "—" },
    { label: "Total bookings", value: stats?.bookings ?? "—" },
  ];

  return (
    <div className="admin-shell">

      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>
          <button onClick={() => dispatch(resetAdminError())}>
            ✕
          </button>
        </div>
      )}

      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <span>{card.label}</span>
            <h3>{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="admin-bookings-section">

        <div className="admin-section-header">
          <h2>Recent Bookings</h2>

          <button
            className="admin-view-more-btn"
            onClick={() => navigate("/admin/bookings")}
          >
            View More →
          </button>
        </div>

        <div className="admin-table-wrap">

          {loading ? (
            <div className="admin-table-state">Loading...</div>
          ) : limitedBookings.length === 0 ? (
            <div className="admin-table-state">No bookings found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Traveler</th>
                  <th>Tour</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {limitedBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b?.user?.name || "-"}</td>
                    <td>{b?.tour?.title || "-"}</td>
                    <td>{formatDate(b?.bookingDate)}</td>
                    <td>
                      <span
                        className={`admin-status admin-status--${b?.status}`}
                      >
                        {b?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;