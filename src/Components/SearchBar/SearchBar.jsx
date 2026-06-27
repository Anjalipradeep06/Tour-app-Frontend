import { useState, useEffect } from "react";
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
// URL param coming from Home's hero search) pre-fill the form so the
// inputs visually match the results already being shown, instead of
// the form looking empty while filtered results are displayed.
const SearchBar = ({ onSearch, initialValues }) => {
  const [filters, setFilters] = useState({
    ...emptyFilters,
    ...initialValues,
  });

  // Keep the form in sync if initialValues changes after mount — e.g.
  // the user goes back to Home and searches a different term, or uses
  // browser back/forward navigation while already on the Search page.
  useEffect(() => {
    if (!initialValues) return;

    setFilters((prev) => ({
      ...emptyFilters,
      ...initialValues,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues?.search,
    initialValues?.country,
    initialValues?.continent,
    initialValues?.activity,
  ]);

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