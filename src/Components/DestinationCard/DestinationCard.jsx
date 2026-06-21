import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

import "./DestinationCard.css";

const DestinationCard = ({ destination }) => {
  if (!destination) return null;

  return (
    <article className="destination-card">
      <div className="destination-image-wrapper">
        <img
          src={destination.bannerImage}
          alt={destination.name}
          className="destination-image"
          loading="lazy"
        />

        <div className="destination-gradient" />

        <span className="destination-badge">
          Featured
        </span>
      </div>

      <div className="destination-content">
        <div className="destination-meta">
          <span>
            <FaMapMarkerAlt />
            {destination.continent ||
              "Worldwide"}
          </span>

          <span>
            {destination.toursCount || 0}+
            experiences
          </span>
        </div>

        <h3>{destination.name}</h3>

        <p>
          Discover curated tours, authentic
          local experiences, and unforgettable
          adventures.
        </p>

        <Link
          to={`/destinations/${destination._id}`}
          className="destination-btn"
        >
          Explore destination

          <FaArrowRight />
        </Link>
      </div>
    </article>
  );
};

export default DestinationCard;