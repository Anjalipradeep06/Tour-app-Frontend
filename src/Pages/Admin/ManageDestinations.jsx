import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllDestinations } from "../../redux/thunks/destinationThunk";

import DestinationFormModal from "./DestinationFormModal";

import "./ManageDestinations.css";

const CONTINENTS = [
  "",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Australia",
  "Antarctica",
];

const LIMIT = 12;

const ManageDestinations = () => {
  const dispatch = useDispatch();

  const {
    allDestinations = [],
    loading,
    total = 0,
    page = 1,
    pages = 1,
  } = useSelector(
    (state) => state.destinations
  );

  const [search, setSearch] =
    useState("");

  const [continent, setContinent] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [showModal, setShowModal] =
    useState(false);

  const [
    editingDestination,
    setEditingDestination,
  ] = useState(null);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, continent]);

  useEffect(() => {
    dispatch(
      getAllDestinations({
        search,
        continent:
          continent || undefined,
        page: currentPage,
        limit: LIMIT,
      })
    );
  }, [
    dispatch,
    search,
    continent,
    currentPage,
  ]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pages) {
      setCurrentPage((p) => p + 1);
    }
  };

  // Build a compact page list with ellipses for larger ranges
  const getPageNumbers = () => {
    const totalPages = pages || 1;
    const current = page || 1;
    const range = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
      return range;
    }

    range.push(1);
    if (current > 3) range.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);
    for (let i = start; i <= end; i++) range.push(i);

    if (current < totalPages - 2) range.push("...");
    range.push(totalPages);

    return range;
  };

  return (
    <div className="admin-shell">
      <div className="md-header">
        <div>
          <p className="admin-eyebrow">
            Meridian Admin
          </p>

          <h1>Destinations</h1>

          <span className="md-subtitle">
            Manage every destination
            displayed to travelers.
          </span>
        </div>

        <button
          className="md-create-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          + New Destination
        </button>
      </div>

      <div className="md-filter-card">
        <input
          type="text"
          placeholder="Search destination..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={continent}
          onChange={(e) =>
            setContinent(
              e.target.value
            )
          }
        >
          {CONTINENTS.map((c) => (
            <option
              key={c}
              value={c}
            >
              {c ||
                "All Continents"}
            </option>
          ))}
        </select>
      </div>

      {!loading && (
        <div className="md-total">
          {total} Destination
          {total !== 1 && "s"}
        </div>
      )}

      {loading ? (
        <div className="md-loading">
          Loading destinations...
        </div>
      ) : allDestinations.length ===
        0 ? (
        <div className="md-loading">
          No destinations found.
        </div>
      ) : (
        <div className="md-grid">
          {allDestinations.map(
            (destination) => (
              <div
                key={
                  destination._id
                }
                className="md-card"
              >
                <div className="md-image">
                  <img
                    src={
                      destination.bannerImage
                    }
                    alt={
                      destination.name
                    }
                  />

                  {destination.isFeatured && (
                    <span className="md-featured">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="md-body">
                  <h3>
                    {
                      destination.name
                    }
                  </h3>

                  <p>
                    {
                      destination.country
                    }
                  </p>

                  <span>
                    {
                      destination.continent
                    }
                  </span>

                  <div className="md-actions">
                    <button
                      className="md-edit-btn"
                      onClick={() =>
                        setEditingDestination(
                          destination
                        )
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && pages > 1 && (
        <div className="md-pagination">
          <button
            className="md-page-btn"
            onClick={handlePrev}
            disabled={page <= 1}
          >
            Prev
          </button>

          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="md-page-ellipsis"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                className={
                  p === page
                    ? "md-page-btn md-page-btn-active"
                    : "md-page-btn"
                }
                onClick={() =>
                  setCurrentPage(p)
                }
              >
                {p}
              </button>
            )
          )}

          <button
            className="md-page-btn"
            onClick={handleNext}
            disabled={page >= pages}
          >
            Next
          </button>
        </div>
      )}

      {/* CREATE */}

      {showModal && (
        <DestinationFormModal
          onClose={() =>
            setShowModal(false)
          }
        />
      )}

      {/* EDIT */}

      {editingDestination && (
        <DestinationFormModal
          destination={
            editingDestination
          }
          onClose={() =>
            setEditingDestination(
              null
            )
          }
        />
      )}
    </div>
  );
};

export default ManageDestinations;