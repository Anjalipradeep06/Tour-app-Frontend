import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaGlobeEurope,
  FaHiking,
} from "react-icons/fa";

import { getAllTours } from "../../redux/thunks/tourThunk";

import "./SearchBar.css";

const SearchBar = () => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    search: "",
    country: "",
    continent: "",
    activity: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllTours(filters));
  };

  return (
    <section className="search-section">
      <form
        className="search-bar"
        onSubmit={handleSearch}
      >
        <div className="search-field">
          <FaSearch />

          <input
            type="text"
            name="search"
            placeholder="Where do you want to go?"
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <FaMapMarkerAlt />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={filters.country}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <FaGlobeEurope />

          <select
            name="continent"
            value={filters.continent}
            onChange={handleChange}
          >
            <option value="">
              Any Continent
            </option>

            <option value="Asia">
              Asia
            </option>

            <option value="Europe">
              Europe
            </option>

            <option value="Africa">
              Africa
            </option>

            <option value="North America">
              North America
            </option>

            <option value="South America">
              South America
            </option>

            <option value="Australia">
              Australia
            </option>
          </select>
        </div>

        <div className="search-field">
          <FaHiking />

          <input
            type="text"
            name="activity"
            placeholder="Activity"
            value={filters.activity}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="search-btn"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default SearchBar;