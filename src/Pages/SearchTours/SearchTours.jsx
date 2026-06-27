import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import SearchBar from "../../Components/SearchBar/SearchBar";
import FilterSidebar from "../../Components/FilterSidebar/FilterSidebar";
import TourCard from "../../Components/TourCard/TourCard";

import { getAllTours } from "../../redux/thunks/tourThunk";
import { clearTourError } from "../../redux/slices/tourSlice";

import "./SearchTours.css";

// Keys SearchBar/FilterSidebar can produce — used to read the same
// shape back out of the URL on load.
const SYNCABLE_KEYS = ["search", "country", "continent", "activity"];

const SearchTours = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { tours, loading, error, total, pages } = useSelector(
    (state) => state.tours
  );

  const [page, setPage] = useState(1);

  // Seed initial filters straight from the URL (e.g. /search?search=Japan
  // coming from the Home page hero search, or a shared/refreshed link).
  const [queryParams, setQueryParams] = useState(() => {
    const initial = {};
    SYNCABLE_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) initial[key] = value;
    });
    return initial;
  });

  const limit = 12;

  // ================= FETCH (search/filter/page driven) =================
  useEffect(() => {
    dispatch(getAllTours({ ...queryParams, page, limit }));
  }, [dispatch, page, queryParams]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearTourError());
    }
  }, [error, dispatch]);

  // Keeps the URL's query string in sync with the active filters, so
  // the page stays shareable/refreshable. Only touches the keys we
  // manage here — any unrelated params already on the URL are preserved.
  const syncUrl = (nextParams) => {
    const next = new URLSearchParams(searchParams);

    SYNCABLE_KEYS.forEach((key) => next.delete(key));

    Object.entries(nextParams).forEach(([key, value]) => {
      if (SYNCABLE_KEYS.includes(key) && value) {
        next.set(key, value);
      }
    });

    setSearchParams(next, { replace: true });
  };

  // ================= SEARCH (from SearchBar) =================
  const handleSearch = (searchValues) => {
    setPage(1); // reset to page 1 on a new search

    setQueryParams((prev) => {
      const merged = { ...prev, ...searchValues };
      syncUrl(merged);
      return merged;
    });
  };

  // ================= FILTER (from FilterSidebar) =================
  const handleFilter = (filterValues) => {
    setPage(1); // reset to page 1 on a new filter

    setQueryParams((prev) => {
      const merged = { ...prev, ...filterValues };
      syncUrl(merged);
      return merged;
    });
  };

  // ================= RESET =================
  // Hard navigation (not React Router) on purpose: this is the only way
  // to guarantee SearchBar's internal filters, FilterSidebar, Redux tour
  // state, and the URL all clear at once with zero leftover state. Using
  // window.location.origin (rather than a hardcoded domain) keeps this
  // correct on localhost and preview deployments too, not just production.
  const handleReset = () => {
    window.location.href = `${window.location.origin}/search`;
  };

  // ================= PAGINATION =================
  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, pages));
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="search-page">
      {/* HERO */}
      <section className="search-hero">
        <div className="search-hero-overlay">
          <div className="search-hero-content">
            <span className="search-badge">
              DISCOVER EXPERIENCES WORLDWIDE
            </span>

            <h1>Find tours crafted for every kind of traveler</h1>

            <p>
              Explore handpicked adventures, cultural experiences,
              guided tours, and unforgettable activities across the globe.
            </p>
          </div>
        </div>
      </section>

      <SearchBar onSearch={handleSearch} initialValues={queryParams} />

      <div className="search-layout">
        <FilterSidebar onFilter={handleFilter} />

        <div className="tour-results">
          <div className="results-header">
            <div>
              <h2>
                {loading
                  ? "Finding experiences..."
                  : `${total || tours.length} packages found`}
              </h2>

              <p>Curated tours from trusted operators worldwide.</p>
            </div>

            <button
              type="button"
              className="reset-search-btn"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="loading-state">
              <div className="booking-spinner" />
              <p>Loading tours...</p>
            </div>
          ) : tours.length > 0 ? (
            <>
              {/* TOURS GRID */}
              <div className="tour-grid">
                {tours.map((tour) => (
                  <TourCard key={tour._id} tour={tour} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="pagination">
                <button onClick={handlePrev} disabled={page === 1}>
                  Prev
                </button>

                <span>
                  Page {page} of {pages}
                </span>

                <button onClick={handleNext} disabled={page === pages}>
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>No experiences found</h3>
              <p>
                Try adjusting your search or filters to discover more destinations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTours;