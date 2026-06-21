import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaUsers,
  FaCreditCard,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
} from "react-icons/fa";

import { createBooking } from "../../../redux/thunks/bookingThunk";
import { getTourById } from "../../../redux/thunks/tourThunk";
import { resetBookingState } from "../../../redux/slices/bookingSlice";

import "./BookingRequest.css";

const BookingRequest = () => {
  const { tourId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, selectedBooking } =
    useSelector((state) => state.booking);

  const { selectedTour: tour } = useSelector(
    (state) => state.tours
  );

  const [formData, setFormData] = useState({
    bookingDate: "",
    participants: 1,
    specialRequirements: "",
    paymentMethod: "stripe",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (tourId) {
      dispatch(getTourById(tourId));
    }
  }, [dispatch, tourId]);

  useEffect(() => {
    if (success && selectedBooking?._id) {
      const id = selectedBooking._id;

      dispatch(resetBookingState());

      navigate(`/bookings/${id}`);
    }
  }, [
    success,
    selectedBooking,
    navigate,
    dispatch,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "participants"
          ? Number(value)
          : value,
    }));

    if (formError) setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.bookingDate) {
      return setFormError(
        "Please select a travel date."
      );
    }

    dispatch(
      createBooking({
        tourId,
        ...formData,
      })
    );
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const totalAmount =
    (tour?.price || 0) *
    formData.participants;

  return (
    <div className="booking-request-page">
      <div className="booking-request-container">
        <div className="booking-request-header">
          <Link to={`/tour/${tourId}`}>
            ← Back to experience
          </Link>

          <h1>Complete your booking</h1>
        </div>

        <div className="booking-request-layout">
          {/* LEFT */}

          <div className="booking-form-card">
            <h2>Traveler details</h2>

            {error && (
              <div className="form-alert error">
                {error}
              </div>
            )}

            {formError && (
              <div className="form-alert error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <FaCalendarAlt />
                  Travel date
                </label>

                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaUsers />
                  Number of travelers
                </label>

                <input
                  type="number"
                  name="participants"
                  min="1"
                  max={tour?.availableSlots || 20}
                  value={formData.participants}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaCreditCard />
                  Payment method
                </label>

                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="stripe">
                    Pay online (Stripe)
                  </option>

                  <option value="cod">
                    Pay later
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Special requirements
                </label>

                <textarea
                  name="specialRequirements"
                  rows="5"
                  value={
                    formData.specialRequirements
                  }
                  onChange={handleChange}
                  placeholder="Dietary needs, accessibility requests, pickup details..."
                />
              </div>

              <button
                type="submit"
                className="reserve-btn"
                disabled={loading?.action}
              >
                {loading?.action
                  ? "Processing..."
                  : "Reserve now"}
              </button>
            </form>
          </div>

          {/* RIGHT */}

          <aside className="booking-summary-card">
            {tour && (
              <>
                <img
                  src={
                    tour.destination
                      ?.bannerImage ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={tour.title}
                />

                <div className="summary-content">
                  <h3>{tour.title}</h3>

                  <p>
                    ₹
                    {Number(
                      tour.price
                    ).toLocaleString("en-IN")}
                    <span>
                      {" "}
                      / traveler
                    </span>
                  </p>

                  <div className="summary-row">
                    <span>Travelers</span>

                    <strong>
                      {formData.participants}
                    </strong>
                  </div>

                  <div className="summary-row">
                    <span>Duration</span>

                    <strong>
                      {tour.duration} days
                    </strong>
                  </div>

                  <div className="summary-row total">
                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        totalAmount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="trust-list">
                    <div>
                      <FaShieldAlt />
                      Secure booking
                    </div>

                    <div>
                      <FaBolt />
                      Instant confirmation
                    </div>

                    <div>
                      <FaCheckCircle />
                      Free cancellation*
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingRequest;