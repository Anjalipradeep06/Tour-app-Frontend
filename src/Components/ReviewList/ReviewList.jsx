import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";

import { deleteReview } from "../../redux/thunks/reviewThunk";
import StarRating from "../StarRating/StarRating";

import "./ReviewList.css";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getInitials = (name = "Traveler") => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const ReviewList = ({ reviews = [], loading }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      dispatch(deleteReview(id));
    }
  };

  if (loading) {
    return (
      <div className="review-list-state">
        Loading reviews…
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="review-list-state">
        <h3>No reviews yet</h3>

        <p>
          Be the first traveler to share your
          experience.
        </p>
      </div>
    );
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => {
        const name =
          review.user?.name || "Anonymous Traveler";

        const canDelete =
          user &&
          (user._id === review.user?._id ||
            user.role === "admin");

        return (
          <li
            key={review._id}
            className="review-card"
          >
            <div className="review-header">
              <div className="review-user">
                <div className="review-avatar">
                  {getInitials(name)}
                </div>

                <div className="review-user-info">
                  <div className="review-name-row">
                    <span className="review-author">
                      {name}
                    </span>

                    <span className="review-badge">
                      <FaCheckCircle />
                      Verified traveler
                    </span>
                  </div>

                  <span className="review-date">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>

              <StarRating
                value={review.rating}
                size={16}
              />
            </div>

            {review.comment && (
              <p className="review-comment">
                {review.comment}
              </p>
            )}

            {canDelete && (
              <button
                className="review-delete-btn"
                onClick={() =>
                  handleDelete(review._id)
                }
              >
                <FaTrashAlt />
                Delete review
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ReviewList;