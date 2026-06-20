import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllTours, deleteTour } from "../../redux/thunks/tourThunk";

import TourFormModal from "./TourFormModal";
import "./ManageTours.css";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const ManageTours = () => {
  const dispatch = useDispatch();

  const { tours, loading, actionLoading, total } = useSelector(
    (state) => state.tours
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    dispatch(getAllTours({ search: search || undefined, limit: 50 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(getAllTours({ search: search || undefined, limit: 50 }));
  };

  const openCreateModal = () => {
    setEditingTour(null);
    setModalOpen(true);
  };

  const openEditModal = (tour) => {
    setEditingTour(tour);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTour(null);
  };

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      dispatch(deleteTour(deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-header mt-header">
        <div>
          <p className="admin-eyebrow">Admin</p>
          <h1>Tours</h1>
        </div>

        <button className="mt-create-btn" onClick={openCreateModal}>
          + Create Tour
        </button>
      </div>

      <form className="mt-search-row" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="mt-search-input"
          placeholder="Search tours by title or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="tf-btn tf-btn--secondary">
          Search
        </button>
      </form>

      <div className="mt-table-section">
        <div className="mt-table-wrap">
          {loading && tours.length === 0 ? (
            <div className="mt-table-state">Loading tours…</div>
          ) : tours.length === 0 ? (
            <div className="mt-table-state">
              No tours found{search ? ` for "${search}"` : ""}.
            </div>
          ) : (
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Tour</th>
                  <th>Destination</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Slots</th>
                  <th>Rating</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour._id}>
                    <td>
                      <span className="mt-table-primary">{tour.title}</span>
                      {tour.isFeatured && (
                        <span className="mt-featured-badge">Featured</span>
                      )}
                    </td>
                    <td>
                      {tour.destination?.name
                        ? `${tour.destination.name}, ${tour.destination.country}`
                        : "—"}
                    </td>
                    <td>{tour.duration} days</td>
                    <td>{formatCurrency(tour.price)}</td>
                    <td>{tour.availableSlots}</td>
                    <td>
                      {tour.averageRating > 0
                        ? `★ ${tour.averageRating.toFixed(1)} (${tour.totalReviews})`
                        : "No reviews"}
                    </td>
                    <td>
                      <div className="mt-row-actions">
                        <button
                          className="tf-btn tf-btn--ghost"
                          onClick={() => openEditModal(tour)}
                        >
                          Edit
                        </button>
                        <button
                          className="mt-delete-btn"
                          onClick={() => confirmDelete(tour._id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && tours.length > 0 && (
          <p className="mt-total-count">
            Showing {tours.length} of {total} tours
          </p>
        )}
      </div>

      {modalOpen && (
        <TourFormModal tour={editingTour} onClose={closeModal} />
      )}

      {deleteTargetId && (
        <div className="tf-overlay" role="dialog" aria-modal="true">
          <div className="mt-confirm-modal">
            <h3>Delete this tour?</h3>
            <p>
              This can't be undone. Existing bookings referencing this tour
              will keep their data, but the tour will no longer be bookable.
            </p>
            <div className="tf-modal-footer">
              <button
                className="tf-btn tf-btn--secondary"
                onClick={cancelDelete}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="mt-delete-btn mt-delete-btn--confirm"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting…" : "Delete tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTours;