import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

import {
  getBookingById,
  cancelBooking,
} from "../../redux/thunks/bookingThunk";

import {
  resetBookingState,
  clearBookingMessage,
  clearBookingError,
} from "../../redux/slices/bookingSlice";

import PaymentButton from "../../Components/PaymentButton/PaymentButton";

import "./BookingDetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedBooking,
    loading,
    error,
    success,
    message,
  } = useSelector((state) => state.booking);

  // Fetch booking details
  useEffect(() => {
    dispatch(getBookingById(id));

    return () => {
      dispatch(resetBookingState());
    };
  }, [dispatch, id]);

  // Toast notifications
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearBookingMessage());
    }

    if (error) {
      toast.error(error);
      dispatch(clearBookingError());
    }
  }, [
    success,
    message,
    error,
    dispatch,
  ]);

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (confirmed) {
      dispatch(cancelBooking(id));
    }
  };

  if (loading.detail) {
    return (
      <div className="booking-page">
        <div className="booking-state">
          <div className="booking-spinner" />

          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!loading.detail && !selectedBooking && !error) {
    return (
      <div className="booking-page">
        <div className="booking-state">
          <p>Booking not found.</p>

          <Link
            to="/bookings"
            className="outline-btn"
          >
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const booking = selectedBooking;

  const status =
    booking?.status || "pending";

  const paymentStatus =
    booking?.paymentStatus || "unpaid";

  const canCancel =
    status === "pending" ||
    status === "confirmed";

  const formattedDate = booking?.bookingDate
    ? new Date(
        booking.bookingDate
      ).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const statusIcon =
    status === "confirmed" ? (
      <FaCheckCircle />
    ) : status === "cancelled" ? (
      <FaTimesCircle />
    ) : (
      <FaClock />
    );

  return (
    <div className="booking-page">
      <div className="booking-container">
        <Link
          to="/bookings"
          className="back-link"
        >
          ← Back to My Trips
        </Link>

        <div className="booking-header">
          <div>
            <p className="booking-reference">
              Booking Reference
            </p>

            <h1>
              {booking?.tour?.title ||
                "Tour Booking"}
            </h1>

            <p className="booking-id">
              #{booking?._id}
            </p>
          </div>

          <div className="status-group">
            <span
              className={`status-badge status-${status}`}
            >
              {statusIcon}
              {status}
            </span>

            <span
              className={`payment-badge payment-${paymentStatus}`}
            >
              <FaCreditCard />
              {paymentStatus}
            </span>
          </div>
        </div>

        <div className="booking-layout">
          {/* LEFT SIDE */}

          <div className="booking-main">
            <div className="tour-card">
              <img
                src={
                  booking?.tour?.image ||
                  booking?.tour?.destination
                    ?.bannerImage ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                }
                alt={
                  booking?.tour?.title ||
                  "Tour"
                }
              />

              <div className="tour-content">
                <div className="info-grid">
                  <div className="info-item">
                    <FaCalendarAlt />

                    <div>
                      <span>
                        Travel Date
                      </span>

                      <strong>
                        {formattedDate}
                      </strong>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaUsers />

                    <div>
                      <span>Guests</span>

                      <strong>
                        {
                          booking?.participants
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaMapMarkerAlt />

                    <div>
                      <span>
                        Destination
                      </span>

                      <strong>
                        {booking?.tour
                          ?.country ||
                          booking?.tour
                            ?.destination
                            ?.country ||
                          "International"}
                      </strong>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaCreditCard />

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {paymentStatus}
                      </strong>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/tour/${booking?.tour?._id}`}
                  className="outline-btn"
                >
                  View Tour Details
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <aside className="summary-card">
            <p className="summary-label">
              Total Amount
            </p>

            <h2>
              ₹
              {Number(
                booking?.totalAmount || 0
              ).toLocaleString(
                "en-IN"
              )}
            </h2>

            <p className="summary-note">
              Includes taxes and fees
            </p>

            <div className="summary-divider" />

            <div className="action-group">
              {paymentStatus !==
                "paid" &&
                status !==
                  "cancelled" && (
                  <PaymentButton
                    bookingId={
                      booking?._id
                    }
                  />
                )}

              {canCancel ? (
                <button
                  className="danger-btn"
                  onClick={
                    handleCancel
                  }
                  disabled={
                    loading.action
                  }
                >
                  {loading.action
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              ) : (
                <p className="locked-note">
                  This booking can no
                  longer be modified.
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