import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "../../redux/thunks/adminThunk";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

const AdminBookings = () => {
  const dispatch = useDispatch();

  const { allBookings, pagination, loading } = useSelector(
    (state) => state.admin
  );

  const [currentPage, setCurrentPage] = useState(1);

  // FETCH FROM SERVER
  useEffect(() => {
    dispatch(
      getAllBookings({
        page: currentPage,
        limit: PAGE_SIZE,
      })
    );
  }, [dispatch, currentPage]);

  const handleApprove = (id) => {
    dispatch(approveBooking(id)).then((res) => {
      if (approveBooking.fulfilled.match(res)) {
        toast.success("Booking approved");
      }
    });
  };

  const handleReject = (id) => {
    dispatch(rejectBooking(id)).then((res) => {
      if (rejectBooking.fulfilled.match(res)) {
        toast.success("Booking rejected");
      }
    });
  };

  const goNext = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  return (
    <div className="admin-bookings-page">
      <h1>Manage Bookings</h1>

      {/* LOADING */}
      {loading.bookings && <p>Loading bookings...</p>}

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Tour</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {allBookings.map((b) => (
            <tr key={b._id}>
              <td>{b.user?.name}</td>
              <td>{b.tour?.title}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(b._id)}>
                      Approve
                    </button>
                    <button onClick={() => handleReject(b._id)}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMPTY STATE */}
      {!loading.bookings && allBookings.length === 0 && (
        <p>No bookings found</p>
      )}

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button onClick={goPrev} disabled={currentPage === 1}>
            Prev
          </button>

          <span>
            Page {currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={goNext}
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;