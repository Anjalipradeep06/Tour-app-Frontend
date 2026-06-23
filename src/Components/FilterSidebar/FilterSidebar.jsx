import { useState } from "react";
import {
  FaGlobeAsia,
  FaHiking,
  FaClock,
  FaDollarSign,
  FaSortAmountDown,
  FaRedo,
} from "react-icons/fa";

import { countries } from "../../utils/countries";
import "./FilterSidebar.css";

const initialFilters = {
  country: "",
  continent: "",
  activity: "",
  duration: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
};

const FilterSidebar = ({ onFilter }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFilters = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    // ✅ send upward only
    onFilter(cleanedFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilter({});
  };

  return (
    <aside className="filter-sidebar">

      <div className="filter-header">
        <div>
          <span className="filter-label">REFINE RESULTS</span>
          <h2>Filters</h2>
        </div>

        <button type="button" className="reset-btn" onClick={resetFilters}>
          <FaRedo />
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label><FaGlobeAsia /> Country</label>
        <select name="country" value={filters.country} onChange={handleChange}>
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label><FaGlobeAsia /> Continent</label>
        <select name="continent" value={filters.continent} onChange={handleChange}>
          <option value="">All Continents</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Africa">Africa</option>
          <option value="Australia">Australia</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
        </select>
      </div>

      <div className="filter-group">
        <label><FaHiking /> Activity</label>
        <input
          type="text"
          name="activity"
          value={filters.activity}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label><FaClock /> Duration</label>
        <input
          type="number"
          name="duration"
          value={filters.duration}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label><FaDollarSign /> Price Range</label>
        <div className="price-range">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="filter-group">
        <label><FaSortAmountDown /> Sort By</label>
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="">Newest First</option>
          <option value="price_asc">Low → High</option>
          <option value="price_desc">High → Low</option>
          <option value="rating_desc">Highest Rated</option>
        </select>
      </div>

      <button type="button" className="apply-btn" onClick={applyFilters}>
        Apply Filters
      </button>

    </aside>
  );
};

export default FilterSidebar;