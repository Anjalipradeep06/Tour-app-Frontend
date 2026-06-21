import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllTours,
  deleteTour,
} from "../../redux/thunks/tourThunk";

import TourFormModal from "./TourFormModal";

import "./ManageTours.css";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const ManageTours = () => {
  const dispatch = useDispatch();

  const {
    tours,
    loading,
    actionLoading,
    total,
  } = useSelector((state) => state.tours);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    dispatch(getAllTours({ limit: 100 }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();

    dispatch(
      getAllTours({
        search: search || undefined,
        limit: 100,
      })
    );
  };

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

  const handleDelete = () => {
    dispatch(deleteTour(deleteTargetId));
    setDeleteTargetId(null);
  };

  return (
    <div className="manageTours">

      {/* ================= HEADER ================= */}

      <section className="manageToursHero">

        <div className="heroLeft">

          <span className="heroBadge">
            Premium Tour Management
          </span>

          <h1>
            Manage Tours
          </h1>

          <p>
            Create, edit and organize luxury travel experiences for your
            customers from one beautiful dashboard.
          </p>

        </div>

        <div className="heroRight">

          <button
            className="createTourBtn"
            onClick={openCreate}
          >
            + Create Tour
          </button>

        </div>

      </section>

      {/* ================= SEARCH ================= */}

      <form
        className="manageToursSearch"
        onSubmit={handleSearch}
      >

        <input
          type="text"
          placeholder="Search tours, destinations or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">
          Search
        </button>

      </form>

      {/* ================= STATS ================= */}

      <section className="tourStats">

        <div className="tourStatCard">

          <div>

            <span>Total Tours</span>

            <h2>{total}</h2>

          </div>

          <div className="tourStatIcon">
            🌍
          </div>

        </div>

        <div className="tourStatCard">

          <div>

            <span>Featured Tours</span>

            <h2>
              {
                tours.filter(
                  (tour) => tour.isFeatured
                ).length
              }
            </h2>

          </div>

          <div className="tourStatIcon">
            ⭐
          </div>

        </div>

        <div className="tourStatCard">

          <div>

            <span>Available Tours</span>

            <h2>
              {
                tours.filter(
                  (tour) => tour.availableSlots > 0
                ).length
              }
            </h2>

          </div>

          <div className="tourStatIcon">
            ✈️
          </div>

        </div>

        <div className="tourStatCard">

          <div>

            <span>Inventory Value</span>

            <h2>
              ₹
              {tours
                .reduce(
                  (sum, tour) =>
                    sum + Number(tour.price || 0),
                  0
                )
                .toLocaleString()}
            </h2>

          </div>

          <div className="tourStatIcon">
            💰
          </div>

        </div>

      </section>

      {/* ================= TOUR GRID ================= */}

      {loading && tours.length === 0 ? (

        <div className="loadingState">

          Loading Tours...

        </div>

      ) : tours.length === 0 ? (

        <div className="loadingState">

          <h2>No Tours Found</h2>

          <p>
            Try changing your search or create a new tour.
          </p>

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
        <span className="featuredBadge">
          ⭐ Featured
        </span>
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

          <strong>
            {tour.duration} Days
          </strong>

        </div>

        <div>

          <span>Slots</span>

          <strong>
            {tour.availableSlots}
          </strong>

        </div>

        <div>

          <span>Rating</span>

          <strong>
            {tour.averageRating > 0 ? (
              <>
                ⭐ {tour.averageRating.toFixed(1)}
                <small>
                  {" "}
                  ({tour.totalReviews || 0})
                </small>
              </>
            ) : (
              "No Reviews"
            )}
          </strong>

        </div>

        <div>

          <span>Country</span>

          <strong>
            {tour.destination?.country || "-"}
          </strong>

        </div>

      </div>

      <div className="tourActions">

        <button
          className="editBtn"
          onClick={() => openEdit(tour)}
        >
          Edit
        </button>

        <button
          className="deleteBtn"
          onClick={() =>
            setDeleteTargetId(tour._id)
          }
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

      {/* ================= FOOTER ================= */}

      <div className="tourFooter">

        <strong>{tours.length}</strong> of{" "}
        <strong>{total}</strong> tours displayed

      </div>

      {/* ================= CREATE / EDIT MODAL ================= */}

      {modalOpen && (
        <TourFormModal
          tour={editingTour}
          onClose={closeModal}
        />
      )}

      {/* ================= DELETE MODAL ================= */}

      {deleteTargetId && (
        <div
          className="deleteOverlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="deleteModal">

            <div className="deleteIcon">
              🗑️
            </div>

            <h2>
              Delete this tour?
            </h2>

            <p>
              This action cannot be undone.
              Existing bookings will remain,
              but this tour will no longer be
              available for customers.
            </p>

            <div className="deleteActions">

              <button
                className="cancelBtn"
                onClick={() =>
                  setDeleteTargetId(null)
                }
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                className="confirmDeleteBtn"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Deleting..."
                  : "Delete Tour"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageTours;