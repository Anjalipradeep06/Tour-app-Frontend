import { useDispatch, useSelector } from "react-redux";

import { deleteReview } from "../../redux/thunks/reviewThunk";
import StarRating from "../StarRating/StarRating";

import "./ReviewList.css";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ReviewList = ({ reviews, loading }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      dispatch(deleteReview(id));
    }
  };

  if (loading) {
    return <p className="review-list-state">Loading reviews…</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="review-list-state">
        No reviews yet. Be the first to share your experience.
      </p>
    );
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => {
        const canDelete =
          user &&
          (user._id === review.user?._id || user.role === "admin");

        return (
          <li key={review._id} className="review-list-item">
            <div className="review-list-item-header">
              <div>
                <span className="review-author">
                  {review.user?.name || "Anonymous traveler"}
                </span>
                <span className="review-date">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <StarRating value={review.rating} size={15} />
            </div>

            {review.comment && (
              <p className="review-comment">{review.comment}</p>
            )}

            {canDelete && (
              <button
                className="review-delete-btn"
                onClick={() => handleDelete(review._id)}
              >
                Delete
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ReviewList;