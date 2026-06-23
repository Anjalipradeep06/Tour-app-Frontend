import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllTours,
  deleteTour,
} from "../../redux/thunks/tourThunk";

import TourFormModal from "./TourFormModal";
import { toast } from "react-toastify";

import "./ManageTours.css";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const ManageTours = () => {
  const dispatch = useDispatch();

  const {
    tours = [],
    loading,
    actionLoading,
    total = 0,
  } = useSelector((state) => state.tours);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // ✅ Prevent duplicate initial fetch (IMPORTANT FIX)
  const didFetch = useRef(false);

  // ================= FETCH TOURS =================
  useEffect(() => {
    if (didFetch.current) return;

    didFetch.current = true;

    dispatch(getAllTours({ limit: 100 }));
  }, [dispatch]);

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();

    dispatch(
      getAllTours({
        search: search.trim() || undefined,
        limit: 100,
      })
    );
  };

  // ================= MODAL HANDLERS =================
  const openCreate = () => {
    setEditingTour(null);
    setModalOpen(true);
  };

  const openEdit = (tour) => {
    setEditingTour(tour);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingTour(null);
    setModalOpen(false);
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!deleteTargetId) return;

    const res = await dispatch(deleteTour(deleteTargetId));

    if (deleteTour.fulfilled.match(res)) {
      toast.success("Tour deleted successfully");

      // 🔥 refresh list after delete (safe)
      dispatch(getAllTours({ limit: 100 }));
    } else {
      toast.error(res.payload || "Delete failed");
    }

    setDeleteTargetId(null);
  };

  // ================= STATS =================
  const featuredCount = tours.filter((t) => t.isFeatured).length;
  const availableCount = tours.filter((t) => t.availableSlots > 0).length;

  const inventoryValue = tours.reduce(
    (sum, t) => sum + Number(t.price || 0),
    0
  );

  return (
    <div className="manageTours">

      {/* HEADER */}
      <section className="manageToursHero">
        <div className="heroLeft">
          <span className="heroBadge">Premium Tour Management</span>
          <h1>Manage Tours</h1>
          <p>
            Create, edit and organize luxury travel experiences from one dashboard.
          </p>
        </div>

        <div className="heroRight">
          <button className="createTourBtn" onClick={openCreate}>
            + Create Tour
          </button>
        </div>
      </section>

      {/* SEARCH */}
      <form className="manageToursSearch" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search tours, destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {/* STATS */}
      <section className="tourStats">
        <div className="tourStatCard">
          <span>Total Tours</span>
          <h2>{total}</h2>
        </div>

        <div className="tourStatCard">
          <span>Featured Tours</span>
          <h2>{featuredCount}</h2>
        </div>

        <div className="tourStatCard">
          <span>Available Tours</span>
          <h2>{availableCount}</h2>
        </div>

        <div className="tourStatCard">
          <span>Inventory Value</span>
          <h2>{formatCurrency(inventoryValue)}</h2>
        </div>
      </section>

      {/* CONTENT */}
      {loading && tours.length === 0 ? (
        <div className="loadingState">Loading Tours...</div>
      ) : tours.length === 0 ? (
        <div className="loadingState">
          <h2>No Tours Found</h2>
          <p>Try searching or create a new tour.</p>
        </div>
      ) : (
        <div className="tourGrid">
          {tours.map((tour) => (
            <div className="tourCard" key={tour._id}>
              <div className="tourImageWrapper">
                <img
                  src={
                    tour.images?.[0] ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"
                  }
                  alt={tour.title}
                />

                {tour.isFeatured && (
                  <span className="featuredBadge">⭐ Featured</span>
                )}
              </div>

              <div className="tourContent">
                <h3>{tour.title}</h3>

                <p>{formatCurrency(tour.price)}</p>

                <div className="tourActions">
                  <button onClick={() => openEdit(tour)}>
                    Edit
                  </button>

                  <button onClick={() => setDeleteTargetId(tour._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="tourFooter">
        <strong>{tours.length}</strong> of <strong>{total}</strong> tours
      </div>

      {/* MODAL */}
      {modalOpen && (
        <TourFormModal tour={editingTour} onClose={closeModal} />
      )}

      {/* DELETE CONFIRM */}
      {deleteTargetId && (
        <div className="deleteOverlay">
          <div className="deleteModal">
            <h2>Delete this tour?</h2>

            <div className="deleteActions">
              <button onClick={() => setDeleteTargetId(null)}>
                Cancel
              </button>

              <button onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTours;