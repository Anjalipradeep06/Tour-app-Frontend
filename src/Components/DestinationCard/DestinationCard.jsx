import { Link } from "react-router-dom";
import "./DestinationCard.css";

const DestinationCard = ({ destination }) => {
  if (!destination) return null;

  return (
    <div className="destination-card">
      <img
        src={destination.bannerImage}
        alt={destination.name}
        className="destination-image"
      />

      <div className="destination-overlay">
        <div className="destination-info">
          <h3>{destination.name}</h3>
        </div>

        <Link
          to={`/destinations/${destination._id}`}
          className="destination-btn"
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;