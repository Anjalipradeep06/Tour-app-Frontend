import {
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "./DestinationMap.css";

const DestinationMap = ({
  latitude,
  longitude,
  destinationName = "Destination",
}) => {
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <section className="destination-map">
      <div className="destination-map-header">
        <div>
          <span className="map-label">
            LOCATION
          </span>

          <h3>
            <FaMapMarkerAlt />
            Explore {destinationName}
          </h3>

          <p>
            Discover the meeting point and
            nearby attractions.
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="directions-btn"
        >
          Get Directions
          <FaExternalLinkAlt />
        </a>
      </div>

      <div className="map-frame">
        <iframe
          title={`${destinationName} Map`}
          src={mapUrl}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
};

export default DestinationMap;