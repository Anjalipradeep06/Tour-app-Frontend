import { useState } from "react";
import { useDispatch } from "react-redux";

import { getAllTours } from "../../redux/thunks/tourThunk";

import "./FilterSidebar.css";

const FilterSidebar = () => {

  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    continent: "",
    activity: "",
    duration: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    dispatch(getAllTours(filters));
  };

  return (
    <div className="filter-sidebar">

      <h2>Filters</h2>

      <label>Continent</label>

      <select
        name="continent"
        value={filters.continent}
        onChange={handleChange}
      >
        <option value="">All</option>
        <option>Asia</option>
        <option>Europe</option>
        <option>Africa</option>
        <option>Australia</option>
        <option>North America</option>
        <option>South America</option>
      </select>

      <label>Activity</label>

      <input
        type="text"
        name="activity"
        value={filters.activity}
        onChange={handleChange}
        placeholder="Hiking"
      />

      <label>Duration</label>

      <input
        type="number"
        name="duration"
        value={filters.duration}
        onChange={handleChange}
      />

      <label>Minimum Price</label>

      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleChange}
      />

      <label>Maximum Price</label>

      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <label>Sort</label>

      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
      >
        <option value="">Newest</option>
        <option value="price_asc">
          Price Low → High
        </option>
        <option value="price_desc">
          Price High → Low
        </option>
        <option value="rating_desc">
          Highest Rated
        </option>
      </select>

      <button onClick={applyFilters}>
        Apply Filters
      </button>

    </div>
  );
};

export default FilterSidebar;