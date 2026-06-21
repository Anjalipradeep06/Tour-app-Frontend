import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import {
  getDashboardStats,
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "../../redux/thunks/adminThunk";
import { resetAdminError } from "../../redux/slices/adminSlice";

import "./AdminDashboard.css";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// Keep in sync with the CSS variables in AdminDashboard.css —
// recharts can't read CSS vars directly, so the hex values are
// duplicated here deliberately.
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

  const { stats, allBookings, loading, actionTargetId, error } = useSelector(
    (state) => state.admin
  );

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getAllBookings());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveBooking(id));
  };

  const handleReject = (id) => {
    if (window.confirm("Reject this booking? The traveler will be notified.")) {
      dispatch(rejectBooking(id));
    }
  };

  const visibleBookings =
    activeTab === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === activeTab);

  const statCards = [
    { label: "Total users", value: stats?.users ?? "—" },
    { label: "Total tours", value: stats?.tours ?? "—" },
    { label: "Total bookings", value: stats?.bookings ?? "—" },
    { label: "Pending", value: stats?.pendingBookings ?? "—", accent: "pending" },
    { label: "Confirmed", value: stats?.confirmedBookings ?? "—", accent: "confirmed" },
    { label: "Completed", value: stats?.completedBookings ?? "—", accent: "completed" },
    { label: "Cancelled", value: stats?.cancelledBookings ?? "—", accent: "cancelled" },
    {
      label: "Total revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : "—",
      accent: "revenue",
    },
  ];

  const statusChartData = stats
    ? [
        { key: "pending", name: "Pending", value: stats.pendingBookings || 0 },
        { key: "confirmed", name: "Confirmed", value: stats.confirmedBookings || 0 },
        { key: "completed", name: "Completed", value: stats.completedBookings || 0 },
        { key: "cancelled", name: "Cancelled", value: stats.cancelledBookings || 0 },
      ].filter((d) => d.value > 0)
    : [];

  const hasStatusData = statusChartData.length > 0;

  const entityChartData = stats
    ? [
        { name: "Users", value: stats.users || 0 },
        { name: "Tours", value: stats.tours || 0 },
        { name: "Bookings", value: stats.bookings || 0 },
      ]
    : [];

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <p className="admin-eyebrow">Admin</p>
        <h1>Dashboard</h1>
      </div>

      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>
          <button onClick={() => dispatch(resetAdminError())}>✕</button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="admin-stats-grid">
        {loading.stats && !stats
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="admin-stat-card admin-stat-card--skeleton" />
            ))
          : statCards.map((card) => (
              <div
                key={card.label}
                className={`admin-stat-card ${
                  card.accent ? `admin-stat-card--${card.accent}` : ""
                }`}
              >
                <span className="admin-stat-label">{card.label}</span>
                <span className="admin-stat-value">{card.value}</span>
              </div>
            ))}
      </div>

      {/* CHARTS */}
      <div className="admin-charts-grid">
        <div className="admin-chart-card">
          <h2 className="admin-chart-title">Booking status breakdown</h2>

          {!loading.stats && !hasStatusData ? (
            <div className="admin-chart-empty">No bookings yet.</div>
          ) : (
            <div className="admin-chart-donut-row">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={hasStatusData ? statusChartData : []}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={84}
                    paddingAngle={2}
                  >
                    {statusChartData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={STATUS_COLORS[entry.key]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <ul className="admin-chart-legend">
                {statusChartData.map((entry) => (
                  <li key={entry.key}>
                    <span
                      className="admin-chart-legend-dot"
                      style={{ background: STATUS_COLORS[entry.key] }}
                    />
                    {entry.name}
                    <strong>{entry.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="admin-chart-card">
          <h2 className="admin-chart-title">Platform scale</h2>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={entityChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#8E959B" }}
                axisLine={{ stroke: "#E6E4DD" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#8E959B" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(201,166,105,0.08)" }} />
              <Bar dataKey="value" fill="#C9A669" radius={[6, 6, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="admin-bookings-section">
        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab ${
                activeTab === tab.key ? "admin-tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === "pending" && stats?.pendingBookings > 0 && (
                <span className="admin-tab-count">
                  {stats.pendingBookings}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="admin-table-wrap">
          {loading.bookings && allBookings.length === 0 ? (
            <div className="admin-table-state">Loading bookings…</div>
          ) : visibleBookings.length === 0 ? (
            <div className="admin-table-state">
              No {activeTab !== "all" ? activeTab : ""} bookings found.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Traveler</th>
                  <th>Tour</th>
                  <th>Date</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visibleBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="admin-table-primary">
                        {b.user?.name || "—"}
                      </span>
                      <span className="admin-table-secondary">
                        {b.user?.email || ""}
                      </span>
                    </td>
                    <td>{b.tour?.title || "Tour unavailable"}</td>
                    <td>{formatDate(b.bookingDate)}</td>
                    <td>{b.participants}</td>
                    <td>{formatCurrency(b.totalAmount)}</td>
                    <td>
                      <span className={`admin-status admin-status--${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-status admin-status--${
                          b.paymentStatus || "unpaid"
                        }`}
                      >
                        {b.paymentStatus || "unpaid"}
                      </span>
                    </td>
                    <td>
                      {b.status === "pending" && (
                        <div className="admin-row-actions">
                          <button
                            className="admin-btn admin-btn--approve"
                            onClick={() => handleApprove(b._id)}
                            disabled={
                              loading.action && actionTargetId === b._id
                            }
                          >
                            {loading.action && actionTargetId === b._id
                              ? "…"
                              : "Approve"}
                          </button>
                          <button
                            className="admin-btn admin-btn--reject"
                            onClick={() => handleReject(b._id)}
                            disabled={
                              loading.action && actionTargetId === b._id
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
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