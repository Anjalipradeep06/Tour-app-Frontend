import { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaGlobeEurope,
  FaHiking,
} from "react-icons/fa";

import { countries } from "../../utils/countries";
import "./SearchBar.css";

const emptyFilters = {
  search: "",
  country: "",
  continent: "",
  activity: "",
};

// initialValues lets a parent (e.g. SearchTours reading a `?search=`
// URL param coming from Home's hero search) pre-fill the form on
// first load, so the inputs visually match results already being
// shown instead of looking empty. This is read ONCE on mount only —
// SearchBar fully owns `filters` after that. It does not re-sync if
// initialValues changes later, so picking a filter on this page never
// clobbers text the user has already typed here.
const SearchBar = ({ onSearch, initialValues }) => {
  const [filters, setFilters] = useState({
    ...emptyFilters,
    ...initialValues,
  });

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    // ✅ ONLY SEND UP, DO NOT DISPATCH
    onSearch(cleanedFilters);
  };

  return (
    <section className="search-section">
      <form className="search-bar" onSubmit={handleSearch}>

        <div className="search-field">
          <FaSearch />
          <input
            type="text"
            name="search"
            placeholder="Search tours..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <FaMapMarkerAlt />
          <select name="country" value={filters.country} onChange={handleChange}>
            <option value="">Any Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <FaGlobeEurope />
          <select
            name="continent"
            value={filters.continent}
            onChange={handleChange}
          >
            <option value="">Any Continent</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Africa">Africa</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        <div className="search-field">
          <FaHiking />
          <input
            type="text"
            name="activity"
            placeholder="Hiking, Safari..."
            value={filters.activity}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </section>
  );
};

export default SearchBar;