import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import SearchBar from "../../Components/SearchBar/SearchBar";
import FilterSidebar from "../../Components/FilterSidebar/FilterSidebar";
import TourCard from "../../Components/TourCard/TourCard";

import { getAllTours } from "../../redux/thunks/tourThunk";
import { clearTourError } from "../../redux/slices/tourSlice";

import "./SearchTours.css";

const SearchTours = () => {
  const dispatch = useDispatch();

  const {
    tours,
    loading,
    error,
  } = useSelector((state) => state.tours);

  useEffect(() => {
    dispatch(getAllTours({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearTourError());
    }
  }, [error, dispatch]);

  return (
    <div className="search-page">
      <section className="search-hero">
        <div className="search-hero-overlay">
          <div className="search-hero-content">
            <span className="search-badge">
              DISCOVER EXPERIENCES WORLDWIDE
            </span>

            <h1>
              Find tours crafted for every
              kind of traveler
            </h1>

            <p>
              Explore handpicked adventures,
              cultural experiences, guided
              tours, and unforgettable
              activities across the globe.
            </p>
          </div>
        </div>
      </section>

      <SearchBar />

      <div className="search-layout">
        <FilterSidebar />

        <div className="tour-results">
          <div className="results-header">
            <div>
              <h2>
                {loading
                  ? "Finding experiences..."
                  : `${tours.length} experiences found`}
              </h2>

              <p>
                Curated tours from trusted
                operators worldwide.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="booking-spinner" />

              <p>Loading tours...</p>
            </div>
          ) : tours.length > 0 ? (
            <div className="tour-grid">
              {tours.map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No experiences found</h3>

              <p>
                Try adjusting your search or
                filters to discover more
                destinations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTours;