import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaStar,
  FaClock,
} from "react-icons/fa";

import { getDestinationById } from "../../redux/thunks/destinationThunk";

import "./DestinationDetails.css";

const DestinationDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    selectedDestination,
    destinationTours,
    loading,
    error,
  } = useSelector(
    (state) => state.destinations
  );

  useEffect(() => {
    dispatch(getDestinationById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="destination-loading">
        Loading destination...
      </div>
    );
  }

  if (error) {
    return (
      <div className="destination-loading">
        {error}
      </div>
    );
  }

  if (!selectedDestination) {
    return (
      <div className="destination-loading">
        Destination not found
      </div>
    );
  }

  return (
    <div className="destination-details">
      {/* HERO */}

      <div className="destination-hero">
        <img
          src={selectedDestination.bannerImage}
          alt={selectedDestination.name}
        />

        <div className="destination-overlay">
          <h1>{selectedDestination.name}</h1>

          <p>
            <FaMapMarkerAlt />
            {" "}
            {selectedDestination.country}
            {" • "}
            <FaGlobe />
            {" "}
            {selectedDestination.continent}
          </p>

          {selectedDestination.rating > 0 && (
            <div className="destination-rating">
              <FaStar />
              <span>
                {selectedDestination.rating}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}

      <div className="destination-container">
        <section className="destination-section">
          <h2>About</h2>

          <p>
            {selectedDestination.description}
          </p>
        </section>

        {selectedDestination.activities
          ?.length > 0 && (
          <section className="destination-section">
            <h2>Activities</h2>

            <div className="activity-list">
              {selectedDestination.activities.map(
                (activity, index) => (
                  <span key={index}>
                    {activity}
                  </span>
                )
              )}
            </div>
          </section>
        )}

        {selectedDestination.galleryImages
          ?.length > 0 && (
          <section className="destination-section">
            <h2>Gallery</h2>

            <div className="gallery-grid">
              {selectedDestination.galleryImages.map(
                (image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedDestination.name}-${index}`}
                  />
                )
              )}
            </div>
          </section>
        )}

        <section className="destination-section">
          <h2>
            Available Tours (
            {destinationTours.length})
          </h2>

          {destinationTours.length === 0 ? (
            <p>
              No tours available for this
              destination yet.
            </p>
          ) : (
            <div className="tour-grid">
              {destinationTours.map(
                (tour) => (
                  <div
                    key={tour._id}
                    className="tour-card"
                  >
                    <h3>{tour.title}</h3>

                    <p>{tour.description}</p>

                    <div className="tour-meta">
                      <span>
                        <FaClock />
                        {" "}
                        {tour.duration} Days
                      </span>

                      <span>
                        ₹{tour.price}
                      </span>
                    </div>

                    <Link
                      to={`/tour/${tour._id}`}
                      className="tour-btn"
                    >
                      View Tour
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DestinationDetails;