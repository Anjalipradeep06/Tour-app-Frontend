import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import {
  getBookingById,
  cancelBooking,
} from "../../redux/thunks/bookingThunk";

import { resetBookingState } from "../../redux/slices/bookingSlice";

import PaymentButton from "../../Components/PaymentButton/PaymentButton";

import "./BookingDetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedBooking, loading, error } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(getBookingById(id));

    return () => dispatch(resetBookingState());
  }, [dispatch, id]);

  const handleCancel = () => {
    if (window.confirm("Cancel this booking? This can't be undone.")) {
      dispatch(cancelBooking(id));
    }
  };

  // ---------------- LOADING ----------------
  if (loading?.detail) {
    return (
      <div className="booking-details-page">
        <div className="booking-state-card">
          <div className="booking-spinner" />
          <p>Loading your booking…</p>
        </div>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="booking-details-page">
        <div className="booking-state-card booking-state-card--error">
          <p>{error}</p>
          <Link to="/bookings" className="booking-btn booking-btn--ghost">
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  // ---------------- EMPTY ----------------
  if (!selectedBooking) {
    return (
      <div className="booking-details-page">
        <div className="booking-state-card">
          <p>No booking found.</p>
          <Link to="/bookings" className="booking-btn booking-btn--ghost">
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const booking = selectedBooking;

  const status = booking.status || "pending";
  const paymentStatus = booking.paymentStatus || "unpaid";

  const canCancel = status === "pending" || status === "confirmed";

  const formattedDate = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="booking-details-page">
      <div className="booking-details-shell">
        <Link to="/bookings" className="booking-back-link">
          ← Back to bookings
        </Link>

        <div className="booking-header">
          <p className="booking-eyebrow">Booking reference · {id}</p>

          <h1>{booking.tour?.title || "Tour Booking"}</h1>

          <span className={`booking-status booking-status--${status}`}>
            <span className="booking-status-dot" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>

          {/* Payment Status */}
          <span
            className={`booking-status booking-status--${paymentStatus}`}
            style={{ marginLeft: "10px" }}
          >
            Payment: {paymentStatus}
          </span>
        </div>

        <div className="booking-layout">
          {/* LEFT SIDE */}
          <section className="booking-card booking-card--main">
            {booking.tour?.image && (
              <div className="booking-card-media">
                <img src={booking.tour.image} alt={booking.tour?.title} />
              </div>
            )}

            <div className="booking-info-grid">
              <div className="booking-info-item">
                <span className="booking-info-label">Travel date</span>
                <span className="booking-info-value">
                  {formattedDate}
                </span>
              </div>

              <div className="booking-info-item">
                <span className="booking-info-label">Participants</span>
                <span className="booking-info-value">
                  {booking.participants}{" "}
                  {booking.participants === 1 ? "guest" : "guests"}
                </span>
              </div>

              <div className="booking-info-item">
                <span className="booking-info-label">Booking ID</span>
                <span className="booking-info-value booking-info-value--mono">
                  {id}
                </span>
              </div>
            </div>

            <Link
              to={`/tour/${booking.tour?._id}`}
              className="booking-btn booking-btn--ghost booking-view-tour"
            >
              View tour details
            </Link>
          </section>

          {/* RIGHT SIDE */}
          <aside className="booking-card booking-card--summary">
            <div className="booking-summary-top">
              <span className="booking-summary-label">Total amount</span>

              <p className="booking-summary-price">
                <span className="booking-currency">₹</span>
                {Number(booking.totalAmount).toLocaleString("en-IN")}
              </p>

              <span className="booking-summary-sub">
                For {booking.participants}{" "}
                {booking.participants === 1 ? "guest" : "guests"}
              </span>
            </div>

            <div className="booking-perforation" />

            <div className="booking-summary-bottom">
              {/* PAYMENT BUTTON */}
              {paymentStatus !== "paid" && (
                <PaymentButton bookingId={booking._id} />
              )}

              {/* CANCEL BUTTON */}
              {canCancel ? (
                <button
                  onClick={handleCancel}
                  disabled={loading?.action}
                  className="booking-btn booking-btn--danger"
                >
                  {loading?.action ? "Cancelling…" : "Cancel booking"}
                </button>
              ) : (
                <p className="booking-locked-note">
                  This booking is {status} and can no longer be changed.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;