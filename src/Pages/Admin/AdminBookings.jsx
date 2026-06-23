import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAllBookings,
  approveBooking,
  rejectBooking,
  completeBooking, // ← add this thunk
} from "../../redux/thunks/adminThunk";

import "./AdminBookings.css";

const PAGE_SIZE = 8;

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

// Pencil SVG icon
const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

// Complete Booking Modal
const CompleteModal = ({ booking, onConfirm, onCancel, isLoading }) => {
  if (!booking) return null;

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2 id="modal-title">Mark as Completed</h2>
          <button className="admin-modal-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <div className="admin-modal-body">
          <p>Mark this booking as <strong>completed</strong>?</p>
          <div className="admin-modal-meta">
            <span><span className="admin-modal-label">Traveler</span>{booking.user?.name || "—"}</span>
            <span><span className="admin-modal-label">Tour</span>{booking.tour?.title || "—"}</span>
            <span><span className="admin-modal-label">Date</span>{formatDate(booking.bookingDate)}</span>
            <span><span className="admin-modal-label">Amount</span>{formatCurrency(booking.totalAmount)}</span>
          </div>
          <p className="admin-modal-note">
            This action cannot be undone. The traveler will be notified.
          </p>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn--ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="admin-btn admin-btn--complete" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Marking…" : "Mark as Completed"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminBookings = () => {
  const dispatch = useDispatch();

  const {
    allBookings = [],
    pagination,
    loading,
    actionTargetId,
  } = useSelector((state) => state.admin);

  const [currentPage, setCurrentPage] = useState(1);
  const [completeTarget, setCompleteTarget] = useState(null); // booking to complete

  useEffect(() => {
    dispatch(getAllBookings({ page: currentPage, limit: PAGE_SIZE }));
  }, [dispatch, currentPage]);

  const handleApprove = (id) => {
    dispatch(approveBooking(id)).then((res) => {
      if (approveBooking.fulfilled.match(res)) {
        toast.success("Booking approved");
      } else {
        toast.error(res.payload || "Failed to approve booking");
      }
    });
  };

  const handleReject = (id) => {
    if (window.confirm("Reject this booking? The traveler will be notified.")) {
      dispatch(rejectBooking(id)).then((res) => {
        if (rejectBooking.fulfilled.match(res)) {
          toast.success("Booking rejected");
        } else {
          toast.error(res.payload || "Failed to reject booking");
        }
      });
    }
  };

  const handleCompleteConfirm = () => {
    if (!completeTarget) return;
    dispatch(completeBooking(completeTarget._id)).then((res) => {
      if (completeBooking.fulfilled.match(res)) {
        toast.success("Booking marked as completed");
        setCompleteTarget(null);
        dispatch(getAllBookings({ page: currentPage, limit: PAGE_SIZE }));
      } else {
        toast.error(res.payload || "Failed to complete booking");
      }
    });
  };

  const goNext = () => {
    if (currentPage < pagination.totalPages) setCurrentPage((p) => p + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const isActioning = loading.action && actionTargetId === completeTarget?._id;

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <p className="admin-eyebrow">Admin</p>
        <h1>Manage Bookings</h1>
      </div>

      <div className="admin-bookings-section">
        <div className="admin-table-wrap">
          {loading.bookings && allBookings.length === 0 ? (
            <div className="admin-table-state">Loading bookings…</div>
          ) : allBookings.length === 0 ? (
            <div className="admin-table-state">No bookings found</div>
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
                {allBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="admin-table-primary">{b.user?.name || "—"}</span>
                      <span className="admin-table-secondary">{b.user?.email || ""}</span>
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
                      <span className={`admin-status admin-status--${b.paymentStatus || "unpaid"}`}>
                        {b.paymentStatus || "unpaid"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        {/* Pending: approve / reject */}
                        {b.status === "pending" && (
                          <>
                            <button
                              className="admin-btn admin-btn--approve"
                              onClick={() => handleApprove(b._id)}
                              disabled={loading.action && actionTargetId === b._id}
                            >
                              {loading.action && actionTargetId === b._id ? "…" : "Approve"}
                            </button>
                            <button
                              className="admin-btn admin-btn--reject"
                              onClick={() => handleReject(b._id)}
                              disabled={loading.action && actionTargetId === b._id}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* Confirmed: pencil → mark complete */}
                        {b.status === "confirmed" && (
                          <button
                            className="admin-btn admin-btn--icon"
                            onClick={() => setCompleteTarget(b)}
                            title="Mark as completed"
                            aria-label="Mark booking as completed"
                          >
                            <PencilIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <button className="admin-page-btn" onClick={goPrev} disabled={currentPage === 1}>
              ← Prev
            </button>
            <span className="admin-page-info">
              Page {pagination.currentPage} of {pagination.totalPages}{" "}
              <span className="admin-page-total">({pagination.totalBookings} total)</span>
            </span>
            <button className="admin-page-btn" onClick={goNext} disabled={currentPage === pagination.totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Complete booking modal */}
      <CompleteModal
        booking={completeTarget}
        onConfirm={handleCompleteConfirm}
        onCancel={() => setCompleteTarget(null)}
        isLoading={isActioning}
      />
    </div>
  );
};

export default AdminBookings;