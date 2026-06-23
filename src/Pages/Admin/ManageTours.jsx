import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllTours, deleteTour } from "../../redux/thunks/tourThunk";

import TourFormModal from "./TourFormModal";
import { toast } from "react-toastify";

import "./ManageTours.css";

const LIMIT = 9;

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const ManageTours = () => {
  const dispatch = useDispatch();

  const {
    tours = [],
    loading,
    actionLoading,
    total = 0,
    pages = 1,
  } = useSelector((state) => state.tours);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // ================= FETCH HELPER =================
  const fetchTours = (targetPage = 1, searchTerm = search) => {
    dispatch(
      getAllTours({
        search: searchTerm.trim() || undefined,
        page: targetPage,
        limit: LIMIT,
      })
    );
  };

  // ================= INITIAL FETCH =================
  useEffect(() => {
    fetchTours(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTours(1, search);
  };

  // ================= PAGINATION =================
  const goToPage = (targetPage) => {
    if (targetPage < 1 || targetPage > pages || targetPage === page) return;
    setPage(targetPage);
    fetchTours(targetPage, search);
  };

  const handlePrev = () => goToPage(page - 1);
  const handleNext = () => goToPage(page + 1);

  // ================= MODAL HANDLERS =================
  const openCreate = () => {
    setEditingTour(null);
    setModalOpen(true);
  };

  const openEdit = (tour) => {
    setEditingTour(tour);
    setModalOpen(true);
  };

  // didSave = true when called after a successful create/update
  const closeModal = (didSave = false) => {
    setEditingTour(null);
    setModalOpen(false);
    if (didSave) {
      fetchTours(page, search); // re-sync grid with latest data
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!deleteTargetId) return;

    const res = await dispatch(deleteTour(deleteTargetId));

    if (deleteTour.fulfilled.match(res)) {
      toast.success("Tour deleted successfully");

      const remainingOnPage = tours.length - 1;
      if (remainingOnPage === 0 && page > 1) {
        const newPage = page - 1;
        setPage(newPage);
        fetchTours(newPage, search);
      } else {
        fetchTours(page, search);
      }
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

      {/* ================= HEADER ================= */}
      <section className="manageToursHero">
        <div className="heroLeft">
          <span className="heroBadge">Premium Tour Management</span>
          <h1>Manage Tours</h1>
          <p>
            Create, edit and organize luxury travel experiences for your
            customers from one beautiful dashboard.
          </p>
        </div>

        <div className="heroRight">
          <button className="createTourBtn" onClick={openCreate}>
            + Create Tour
          </button>
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <form className="manageToursSearch" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search tours, destinations or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* ================= STATS ================= */}
      <section className="tourStats">
        <div className="tourStatCard">
          <span>Total Tours</span>
          <h2>{total}</h2>
        </div>
        <div className="tourStatCard">
          <span>Featured (this page)</span>
          <h2>{featuredCount}</h2>
        </div>
        <div className="tourStatCard">
          <span>Available (this page)</span>
          <h2>{availableCount}</h2>
        </div>
        <div className="tourStatCard">
          <span>Inventory Value (this page)</span>
          <h2>{formatCurrency(inventoryValue)}</h2>
        </div>
      </section>

      {/* ================= TOUR GRID ================= */}
      {loading && tours.length === 0 ? (
        <div className="loadingState">Loading Tours...</div>
      ) : tours.length === 0 ? (
        <div className="loadingState">
          <h2>No Tours Found</h2>
          <p>Try changing your search or create a new tour.</p>
        </div>
      ) : (
        <div className="tourGrid">
          {tours.map((tour) => (
            <div className="tourCard" key={tour._id}>
              <div className="tourImageWrapper">
                <img
                  src={
                    tour.images?.[0] ||
                    tour.image ||
                    tour.thumbnail ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
                  }
                  alt={tour.title}
                  className="tourImage"
                />
                {tour.isFeatured && (
                  <span className="featuredBadge">⭐ Featured</span>
                )}
                <div className="tourPriceBadge">
                  {formatCurrency(tour.price)}
                </div>
              </div>

              <div className="tourContent">
                <h3>{tour.title}</h3>
                <p className="tourLocation">
                  📍{" "}
                  {tour.destination?.name
                    ? `${tour.destination.name}, ${tour.destination.country}`
                    : "Destination"}
                </p>

                <div className="tourInfo">
                  <div>
                    <span>Duration</span>
                    <strong>{tour.duration} Days</strong>
                  </div>
                  <div>
                    <span>Slots</span>
                    <strong>{tour.availableSlots}</strong>
                  </div>
                  <div>
                    <span>Rating</span>
                    <strong>
                      {tour.averageRating > 0
                        ? `⭐ ${tour.averageRating.toFixed(1)}`
                        : "No Reviews"}
                    </strong>
                  </div>
                  <div>
                    <span>Country</span>
                    <strong>{tour.destination?.country || "-"}</strong>
                  </div>
                </div>

                <div className="tourActions">
                  <button
                    className="editBtn"
                    onClick={() => openEdit(tour)}
                    disabled={actionLoading}
                  >
                    Edit
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={() => setDeleteTargetId(tour._id)}
                    disabled={actionLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {pages > 1 && (
        <div className="paginationBar">
          <button
            className="pageBtn"
            onClick={handlePrev}
            disabled={page <= 1 || loading}
          >
            ← Prev
          </button>
          <span className="pageInfo">
            Page <strong>{page}</strong> of <strong>{pages}</strong>
          </span>
          <button
            className="pageBtn"
            onClick={handleNext}
            disabled={page >= pages || loading}
          >
            Next →
          </button>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <div className="tourFooter">
        Showing <strong>{tours.length}</strong> of <strong>{total}</strong>{" "}
        tours total
      </div>

      {/* ================= TOUR FORM MODAL ================= */}
      {modalOpen && (
        <TourFormModal tour={editingTour} onClose={closeModal} />
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteTargetId && (
        <div className="deleteOverlay" role="dialog">
          <div className="deleteModal">
            <h2>Delete this tour?</h2>
            <p>This action cannot be undone. Existing bookings will remain.</p>
            <div className="deleteActions">
              <button
                className="cancelBtn"
                onClick={() => setDeleteTargetId(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="confirmDeleteBtn"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete Tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTours;