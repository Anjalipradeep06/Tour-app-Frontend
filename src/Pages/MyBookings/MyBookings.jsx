import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserBookings } from "../../redux/thunks/bookingThunk";
import "./MyBookings.css";

const MyBookings = () => {
  const dispatch = useDispatch();

  const { bookings = [], loading, error } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  return (
    <div className="mybookings-page">
      <h1 className="page-title">My Trips</h1>

      {loading.list && <div className="loader">Loading your trips...</div>}

      {error && <div className="error-box">{error}</div>}

      {!loading.list && bookings.length === 0 && (
        <div className="empty-state">
          No bookings found. Start exploring amazing tours ✈️
        </div>
      )}

      <div className="bookings-grid">
        {bookings.map((b) => (
          <div className="booking-card" key={b._id}>
            
            {/* IMAGE */}
            <div className="booking-image">
              <img
                src={
                  b.tour?.image ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                }
                alt="tour"
              />
            </div>

            {/* CONTENT */}
            <div className="booking-content">
              
              <div className="top-row">
                <h2>{b.tour?.title || "Tour unavailable"}</h2>

                <span className={`status ${b.status}`}>
                  {b.status}
                </span>
              </div>

              <p className="location">
                🌍 {b.tour?.location || "International Destination"}
              </p>

              <div className="meta">
                <span>👥 {b.participants} guests</span>
                <span>📅 {new Date(b.bookingDate).toLocaleDateString()}</span>
              </div>

              <div className="bottom-row">
                <p className="price">
                  ₹{b.totalAmount}
                </p>

                <div className="bottom-row-actions">
                  {b.status === "completed" && b.tour?._id && (
                    <Link
                      to={`/tour/${b.tour._id}#reviews`}
                      className="review-btn"
                    >
                      Write a review
                    </Link>
                  )}

                  <Link
                    to={`/bookings/${b._id}`}
                    className="view-btn"
                  >
                    View Details →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;