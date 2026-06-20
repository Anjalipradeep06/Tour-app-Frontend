import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { createBooking } from "../../redux/thunks/bookingThunk";
import { getTourById } from "../../redux/thunks/tourThunk";
import { resetBookingState } from "../../redux/slices/bookingSlice";

import "./BookingRequest.css";

const BookingRequest = () => {
  const { tourId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, selectedBooking } = useSelector(
    (state) => state.booking
  );

  const { selectedTour: tour } = useSelector(
    (state) => state.tours
  );

  const [formData, setFormData] = useState({
    bookingDate: "",
    participants: 1,
    specialRequirements: "",
    paymentMethod: "cod",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (tourId) dispatch(getTourById(tourId));
  }, [dispatch, tourId]);

  useEffect(() => {
    if (success && selectedBooking?._id) {
      const id = selectedBooking._id;
      dispatch(resetBookingState());
      navigate(`/bookings/${id}`);
    }
  }, [success, selectedBooking, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "participants" ? Number(value) : value,
    }));

    if (formError) setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.bookingDate) {
      return setFormError("Select booking date");
    }

    dispatch(
      createBooking({
        tourId,
        ...formData,
      })
    );
  };

  const totalAmount = (tour?.price || 0) * formData.participants;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-request">
      <h2>Request Booking</h2>

      {tour && (
        <div>
          <h3>{tour.title}</h3>
          <p>₹{tour.price} / person</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          min={today}
        />

        <input
          type="number"
          name="participants"
          value={formData.participants}
          onChange={handleChange}
          min="1"
        />

        <textarea
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleChange}
        />

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="cod">COD</option>
          <option value="stripe">Stripe</option>
        </select>

        <h3>Total: ₹{totalAmount}</h3>

        {formError && <p>{formError}</p>}
        {error && <p>{error}</p>}

        <button disabled={loading.action}>
          {loading.action ? "Submitting..." : "Book Now"}
        </button>
      </form>
    </div>
  );
};

export default BookingRequest;