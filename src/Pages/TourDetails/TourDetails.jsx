import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import DestinationMap from "../../Components/DestinationMap/DestinationMap";
import Reviews from "../../Components/Reviews/Reviews";
import { getTourById } from "../../redux/thunks/tourThunk";

import "./TourDetails.css";

const TourDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const { selectedTour, loading, error } = useSelector(
    (state) => state.tours
  );

  useEffect(() => {
    dispatch(getTourById(id));
  }, [dispatch, id]);

  // Deep-link support: /tour/:id#reviews scrolls to the reviews section
  // once the tour (and therefore the section) has rendered.
  useEffect(() => {
    if (location.hash === "#reviews" && selectedTour) {
      const el = document.getElementById("reviews");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash, selectedTour]);

  if (loading) {
    return (
      <div className="tour-loading">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="tour-loading">
        {error}
      </div>
    );
  }

  if (!selectedTour) {
    return (
      <div className="tour-loading">
        Tour not found
      </div>
    );
  }

  const tour = selectedTour;

  return (
    <div className="tour-details">

      {/* HERO */}

      <div className="tour-hero">
        <img
          src={
            tour.destination?.bannerImage ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          }
          alt={tour.title}
        />

        <div className="hero-overlay">
          <p className="ticket">
            ITINERARY #{tour._id.slice(-6)}
          </p>

          <h1>{tour.title}</h1>

          <p>
            <FaMapMarkerAlt />
            {" "}
            {tour.destination?.country || "Unknown Country"}
            {tour.destination?.continent &&
              `, ${tour.destination.continent}`}
          </p>
        </div>
      </div>

      {/* CONTENT */}

      <div className="details-container">

        {/* LEFT */}

        <div className="details-left">

          <section>
            <h2>Overview</h2>

            <p>{tour.description}</p>
          </section>

          {tour.highlights?.length > 0 && (
            <section>
              <h2>Highlights</h2>

              <ul>
                {tour.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {tour.activities?.length > 0 && (
            <section>
              <h2>Activities</h2>

              <div className="chips">
                {tour.activities.map((activity, index) => (
                  <span key={index}>
                    {activity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {tour.itinerary?.length > 0 && (
            <section>
              <h2>Itinerary</h2>

              {tour.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="itinerary-card"
                >
                  <h3>Day {day.day}</h3>

                  <h4>{day.title}</h4>

                  <p>{day.description}</p>
                </div>
              ))}
            </section>
          )}

          {(tour.inclusions?.length > 0 ||
            tour.exclusions?.length > 0) && (
            <section className="two-column">

              <div>
                <h2>Included</h2>

                {tour.inclusions?.map((item, index) => (
                  <p key={index}>
                    <FaCheckCircle />
                    {" "}
                    {item}
                  </p>
                ))}
              </div>

              <div>
                <h2>Excluded</h2>

                {tour.exclusions?.map((item, index) => (
                  <p key={index}>
                    <FaTimesCircle />
                    {" "}
                    {item}
                  </p>
                ))}
              </div>

            </section>
          )}

          <section id="reviews">
            <Reviews
              tourId={tour._id}
              averageRating={tour.averageRating}
              totalReviews={tour.totalReviews}
            />
          </section>
        </div>

        {/* RIGHT */}

        <div className="details-right">

          <div className="booking-card">

            <h2>₹{tour.price}</h2>

            <p>per traveler</p>

            <div className="info">

              <span>
                <FaClock />
                {" "}
                {tour.duration} Days
              </span>

              <span>
                <FaUsers />
                {" "}
                {tour.availableSlots} Seats
              </span>

              <span>
                <FaStar />
                {" "}
                {tour.averageRating || 0}
              </span>

            </div>

            <Link
              to={`/book-tour/${tour._id}`}
              className="book-btn"
            >
              Book Now
            </Link>

          </div>

          {tour.meetingPoint?.address && (
            <div className="meeting">

              <h3>Meeting Point</h3>

              <p>{tour.meetingPoint.address}</p>

              {tour.meetingPoint.latitude &&
                tour.meetingPoint.longitude && (
                  <DestinationMap
                    latitude={tour.meetingPoint.latitude}
                    longitude={tour.meetingPoint.longitude}
                  />
                )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default TourDetails;