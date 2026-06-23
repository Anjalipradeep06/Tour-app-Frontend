import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_COLORS = {
  pending: "#B8770A",
  confirmed: "#1B7A4D",
  completed: "#8E959B",
  cancelled: "#C03B2B",
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="admin-chart-tooltip">
      {payload.map((entry) => (
        <div key={entry.name} className="admin-chart-tooltip-row">
          <span>{entry.name}</span>
          <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, allBookings, loading, actionTargetId, error } =
    useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getAllBookings());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveBooking(id)).then((result) => {
      if (approveBooking.fulfilled.match(result)) {
        toast.success("Booking approved successfully!");
      } else {
        toast.error(result.payload || "Failed to approve booking");
      }
    });
  };

  const handleReject = (id) => {
    if (window.confirm("Reject this booking?")) {
      dispatch(rejectBooking(id)).then((result) => {
        if (rejectBooking.fulfilled.match(result)) {
          toast.success("Booking rejected.");
        } else {
          toast.error(result.payload || "Failed to reject booking");
        }
      });
    }
  };

  const visibleBookings =
    activeTab === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === activeTab);

  // 👉 LIMIT FOR DASHBOARD PREVIEW
  const limitedBookings = visibleBookings.slice(0, LIMIT);

  const statCards = [
    { label: "Total users", value: stats?.users ?? "—" },
    { label: "Total tours", value: stats?.tours ?? "—" },
    { label: "Total bookings", value: stats?.bookings ?? "—" },
  ];

  return (
    <div className="admin-shell">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>
          <button onClick={() => dispatch(resetAdminError())}>✕</button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <span>{card.label}</span>
            <h3>{card.value}</h3>
          </div>
        ))}
      </div>

      {/* BOOKINGS PREVIEW */}
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

          {limitedBookings.length === 0 ? (
            <div className="admin-table-state">
              No bookings found.
            </div>
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
                    <td>{b.user?.name}</td>
                    <td>{b.tour?.title}</td>
                    <td>{formatDate(b.bookingDate)}</td>
                    <td>
                      <span className={`admin-status admin-status--${b.status}`}>
                        {b.status}
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