import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaStar,
  FaCamera,
  FaSuitcaseRolling,
} from "react-icons/fa";

import {
  getDestinationById,
} from "../../redux/thunks/destinationThunk";

import {
  clearSelectedDestination,
} from "../../redux/slices/destinationSlice";

import TourCard from "../../Components/TourCard/TourCard";

import "./DestinationDetails.css";

const DestinationDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedDestination,
    destinationTours,
    loading,
    error,
  } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(getDestinationById(id));

    return () => {
      dispatch(clearSelectedDestination());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="destination-loading">
        <div className="booking-spinner" />
        <p>Loading destination...</p>
      </div>
    );
  }

  if (!selectedDestination) {
    return (
      <div className="destination-loading">
        Destination not found.
      </div>
    );
  }

  return (
    <div className="destination-details">
      {/* HERO */}
      <section className="destination-hero">
        <img
          src={selectedDestination.bannerImage}
          alt={selectedDestination.name}
        />

        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-badge">
              <FaGlobe />

              <span>
                {selectedDestination.continent}
              </span>
            </div>

            <h1>{selectedDestination.name}</h1>

            <div className="hero-meta">
              <span>
                <FaMapMarkerAlt />
                {selectedDestination.country}
              </span>

              <span>
                <FaStar />
                {selectedDestination.rating || 4.8}
              </span>

              <span>
                {destinationTours.length} tours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="facts-wrapper">
        <div className="facts-grid">
          <div className="fact-card">
            <FaGlobe />

            <div>
              <span>Continent</span>

              <h4>
                {selectedDestination.continent}
              </h4>
            </div>
          </div>

          <div className="fact-card">
            <FaMapMarkerAlt />

            <div>
              <span>Country</span>

              <h4>
                {selectedDestination.country}
              </h4>
            </div>
          </div>

          <div className="fact-card">
            <FaCamera />

            <div>
              <span>Activities</span>

              <h4>
                {selectedDestination.activities?.length || 0}
              </h4>
            </div>
          </div>

          <div className="fact-card">
            <FaSuitcaseRolling />

            <div>
              <span>Available Tours</span>

              <h4>{destinationTours.length}</h4>
            </div>
          </div>
        </div>
      </section>

      <div className="destination-container">
        {/* ABOUT */}
        <section className="content-section">
          <h2>
            About {selectedDestination.name}
          </h2>

          <p>
            {selectedDestination.description}
          </p>
        </section>

        {/* ACTIVITIES */}
        {selectedDestination.activities?.length > 0 && (
          <section className="content-section">
            <h2>Popular Activities</h2>

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

        {/* GALLERY */}
        {selectedDestination.galleryImages?.length > 0 && (
          <section className="content-section">
            <div className="section-header">
              <h2>Photo Gallery</h2>

              <span>
                {selectedDestination.galleryImages.length} photos
              </span>
            </div>

            <div className="gallery-grid">
              {selectedDestination.galleryImages.map(
                (image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedDestination.name}-${index}`}
                    loading="lazy"
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* TOURS */}
        <section className="content-section">
          <div className="section-header">
            <h2>Top Tours</h2>

            <span>
              {destinationTours.length} experiences
            </span>
          </div>

          {destinationTours.length === 0 ? (
            <div className="empty-state">
              No tours available yet.
            </div>
          ) : (
            <div className="tour-grid">
              {destinationTours.map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DestinationDetails;