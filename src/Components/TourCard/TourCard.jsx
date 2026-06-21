import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
} from "react-icons/fa";

import "./TourCard.css";

const TourCard = ({ tour }) => {
  const image =
    tour.destination?.bannerImage ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80";

  return (
    <article className="tour-card">

      <div className="tour-card-image">

        <img
          src={image}
          alt={tour.title}
        />

        <div className="tour-rating-badge">
          <FaStar />

          <span>
            {tour.averageRating?.toFixed(1) || "4.8"}
          </span>
        </div>

      </div>

      <div className="tour-card-body">

        <div className="tour-card-location">
          <FaMapMarkerAlt />

          <span>
            {tour.destination?.country || "International"}{" "}
            {tour.destination?.continent &&
              `• ${tour.destination.continent}`}
          </span>
        </div>

        <h3 className="tour-card-title">
          {tour.title}
        </h3>

        <p className="tour-card-description">
          {tour.description?.length > 110
            ? `${tour.description.slice(0, 110)}...`
            : tour.description}
        </p>

        <div className="tour-card-meta">

          <span>
            <FaClock />
            {tour.duration} days
          </span>

          <span>
            {tour.activities?.slice(0, 2).join(" • ")}
          </span>

        </div>

        <div className="tour-card-footer">

          <div className="tour-price">

            <span className="price-label">
              From
            </span>

            <h4>
              ₹{Number(tour.price).toLocaleString()}
            </h4>

            <small>per person</small>

          </div>

          <Link
            to={`/tour/${tour._id}`}
            className="tour-card-btn"
          >
            View deal
          </Link>

        </div>

      </div>

    </article>
  );
};

export default TourCard;