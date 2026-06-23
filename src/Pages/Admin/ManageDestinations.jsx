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

const ManageDestinations = () => {
  const dispatch = useDispatch();

  const {
    allDestinations = [],
    loading,
    total = 0,
  } = useSelector(
    (state) => state.destinations
  );

  const [search, setSearch] =
    useState("");

  const [continent, setContinent] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [
    editingDestination,
    setEditingDestination,
  ] = useState(null);

  useEffect(() => {
    dispatch(
      getAllDestinations({
        search,
        continent:
          continent || undefined,
      })
    );
  }, [
    dispatch,
    search,
    continent,
  ]);

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