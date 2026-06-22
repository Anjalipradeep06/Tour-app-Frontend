import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaGlobeAsia,
  FaHiking,
  FaClock,
  FaDollarSign,
  FaSortAmountDown,
  FaRedo,
} from "react-icons/fa";

import { getAllTours } from "../../redux/thunks/tourThunk";

import "./FilterSidebar.css";

const initialFilters = {
  continent: "",
  activity: "",
  duration: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
};

const FilterSidebar = () => {
  const dispatch = useDispatch();

  const [filters, setFilters] =
    useState(initialFilters);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFilters = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) =>
          value !== "" &&
          value !== null &&
          value !== undefined
      )
    );

    dispatch(
      getAllTours({
        ...cleanedFilters,
        page: 1,
        limit: 12,
      })
    );
  };

  const resetFilters = () => {
    setFilters(initialFilters);

    dispatch(
      getAllTours({
        page: 1,
        limit: 12,
      })
    );
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <div>
          <span className="filter-label">
            REFINE RESULTS
          </span>

          <h2>Filters</h2>
        </div>

        <button
          type="button"
          className="reset-btn"
          onClick={resetFilters}
        >
          <FaRedo />
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label>
          <FaGlobeAsia />
          Continent
        </label>

        <select
          name="continent"
          value={filters.continent}
          onChange={handleChange}
        >
          <option value="">
            All Continents
          </option>

          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Africa">Africa</option>
          <option value="Australia">Australia</option>
          <option value="North America">
            North America
          </option>
          <option value="South America">
            South America
          </option>
        </select>
      </div>

      <div className="filter-group">
        <label>
          <FaHiking />
          Activity
        </label>

        <input
          type="text"
          name="activity"
          value={filters.activity}
          onChange={handleChange}
          placeholder="Hiking, Safari, Cruise..."
        />
      </div>

      <div className="filter-group">
        <label>
          <FaClock />
          Duration (days)
        </label>

        <input
          type="number"
          min="1"
          name="duration"
          value={filters.duration}
          onChange={handleChange}
          placeholder="e.g. 5"
        />
      </div>

      <div className="filter-group">
        <label>
          <FaDollarSign />
          Price Range
        </label>

        <div className="price-range">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min"
          />

          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>
          <FaSortAmountDown />
          Sort By
        </label>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
        >
          <option value="">
            Newest First
          </option>

          <option value="price_asc">
            Price: Low to High
          </option>

          <option value="price_desc">
            Price: High to Low
          </option>

          <option value="rating_desc">
            Highest Rated
          </option>
        </select>
      </div>

      <button
        type="button"
        className="apply-btn"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;