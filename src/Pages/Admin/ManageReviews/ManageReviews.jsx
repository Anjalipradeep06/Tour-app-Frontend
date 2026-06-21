import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTourReviews, deleteReview } from "../../../redux/thunks/reviewThunk";

import "./ManageReviews.css";

const ManageReviews = () => {
  const dispatch = useDispatch();

  const { reviews, loading } = useSelector((state) => state.review);

  useEffect(() => {
    // Replace with admin endpoint later
    dispatch(getTourReviews("all"));
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      dispatch(deleteReview(id));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin</p>
          <h1>Reviews</h1>
        </div>
      </div>

      <div className="mt-table-section">
        <div className="mt-table-wrap">
          {loading.list ? (
            <div className="mt-table-state">Loading reviews...</div>
          ) : (
            <table className="mt-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Tour</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review.user?.name}</td>
                    <td>{review.tour?.title}</td>
                    <td>★ {review.rating}</td>
                    <td>{review.comment}</td>

                    <td>
                      <button
                        className="mt-delete-btn"
                        onClick={() => handleDelete(review._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;