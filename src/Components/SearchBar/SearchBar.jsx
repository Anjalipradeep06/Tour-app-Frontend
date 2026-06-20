import { useState } from "react";
import { useDispatch } from "react-redux";

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
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
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

        <input
          type="text"
          name="search"
          placeholder="Search tours..."
          value={filters.search}
          onChange={handleChange}
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={filters.country}
          onChange={handleChange}
        />

        <select
          name="continent"
          value={filters.continent}
          onChange={handleChange}
        >
          <option value="">
            Continent
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

        <input
          type="text"
          name="activity"
          placeholder="Activity"
          value={filters.activity}
          onChange={handleChange}
        />

        <button type="submit">
          Search
        </button>

      </form>

    </section>
  );
};

export default SearchBar;