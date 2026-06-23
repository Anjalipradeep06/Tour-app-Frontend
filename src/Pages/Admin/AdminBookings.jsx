import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAllBookings,
  approveBooking,
  rejectBooking,
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

const AdminBookings = () => {
  const dispatch = useDispatch();

  const {
    allBookings = [],
    pagination,
    loading,
    actionTargetId,
  } = useSelector((state) => state.admin);

  const [currentPage, setCurrentPage] = useState(1);

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

  const goNext = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

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
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="admin-page-btn"
              onClick={goPrev}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>

            <span className="admin-page-info">
              Page {pagination.currentPage} of {pagination.totalPages}{" "}
              <span className="admin-page-total">
                ({pagination.totalBookings} total)
              </span>
            </span>

            <button
              className="admin-page-btn"
              onClick={goNext}
              disabled={currentPage === pagination.totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;