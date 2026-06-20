import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaStar } from "react-icons/fa";

import "./TourCard.css";

const TourCard = ({ tour }) => {
  return (
    <div className="tour-card">

      <div className="tour-image">

        <img
          src={
            tour.destination?.bannerImage ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
          }
          alt={tour.title}
        />

        <span className="tour-price">
          ${tour.price}
        </span>

      </div>

      <div className="tour-content">

        <p className="ticket-number">
          ITINERARY #{tour._id.slice(-6).toUpperCase()}
        </p>

        <h2>{tour.title}</h2>

        <div className="tour-location">

          <FaMapMarkerAlt />

          <span>
            {tour.country},{" "}
            {tour.continent}
          </span>

        </div>

        <p className="tour-description">
          {tour.description.length > 120
            ? tour.description.substring(0, 120) +
              "..."
            : tour.description}
        </p>

        <div className="tour-meta">

          <span>
            <FaClock />
            {tour.duration} Days
          </span>

          <span>
            <FaStar />
            {tour.averageRating || 0}
          </span>

        </div>

        <div className="activity-list">

          {tour.activities
            ?.slice(0, 3)
            .map((activity, index) => (
              <span key={index}>
                {activity}
              </span>
            ))}

        </div>

        <Link
          to={`/tour/${tour._id}`}
          className="details-btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

export default TourCard;