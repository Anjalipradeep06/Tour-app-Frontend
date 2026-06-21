import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaLock, FaCheckCircle } from "react-icons/fa";

import { addReview } from "../../redux/thunks/reviewThunk";
import { resetReviewState } from "../../redux/slices/reviewSlice";

import StarRating from "../StarRating/StarRating";

import "./ReviewForm.css";

const ReviewForm = ({ tourId }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { loading, error, success } = useSelector(
    (state) => state.review
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) return;

    dispatch(
      addReview({
        tour: tourId,
        rating,
        comment,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setRating(0);
        setComment("");
      }
    });
  };

  const handleDismissError = () => {
    dispatch(resetReviewState());
  };

  if (!user) {
    return (
      <div className="review-form-locked">
        <FaLock className="review-lock-icon" />

        <h3>Share your experience</h3>

        <p>
          Sign in to leave a verified review for
          this experience.
        </p>

        <Link to="/login" className="review-login-btn">
          Log in
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="review-form-success">
        <FaCheckCircle />

        <h3>Review submitted</h3>

        <p>
          Thanks for sharing your experience with
          other travelers.
        </p>

        <button
          type="button"
          className="review-secondary-btn"
          onClick={() =>
            dispatch(resetReviewState())
          }
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form
      className="review-form"
      onSubmit={handleSubmit}
    >
      <div className="review-form-header">
        <h3>Write a review</h3>

        <p>
          Your feedback helps fellow travelers
          choose the right experience.
        </p>
      </div>

      <div className="review-form-field">
        <label>Your rating</label>

        <StarRating
          value={rating}
          onChange={setRating}
          size={28}
        />
      </div>

      <div className="review-form-field">
        <label htmlFor="review-comment">
          Your review
        </label>

        <textarea
          id="review-comment"
          rows={5}
          maxLength={1000}
          placeholder="What did you enjoy most? Share useful details about the guide, itinerary, and overall experience."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          required
        />

        <span className="review-char-count">
          {comment.length}/1000
        </span>
      </div>

      {error && (
        <div className="review-form-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={handleDismissError}
          >
            ✕
          </button>
        </div>
      )}

      <button
        type="submit"
        className="review-form-submit"
        disabled={
          loading?.action || rating === 0
        }
      >
        {loading?.action
          ? "Posting review..."
          : "Post review"}
      </button>
    </form>
  );
};

export default ReviewForm;