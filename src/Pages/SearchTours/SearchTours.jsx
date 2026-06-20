import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "../../Components/SearchBar/SearchBar";
import FilterSidebar from "../../Components/FilterSidebar/FilterSidebar";
import TourCard from "../../Components/TourCard/TourCard";

import { getAllTours } from "../../redux/thunks/tourThunk";

import "./SearchTours.css";

const SearchTours = () => {
  const dispatch = useDispatch();

  const { tours, loading } = useSelector(
    (state) => state.tours
  );

  useEffect(() => {
    dispatch(getAllTours({}));
  }, [dispatch]);

  return (
    <div className="search-page">

      <SearchBar />

      <div className="search-layout">

        <FilterSidebar />

        <div className="tour-results">

          {loading ? (
            <h2>Loading Tours...</h2>
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
            <h2>No Tours Found</h2>
          )}

        </div>

      </div>

    </div>
  );
};

export default SearchTours;