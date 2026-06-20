import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { addReview } from "../../redux/thunks/reviewThunk";
import { resetReviewState } from "../../redux/slices/reviewSlice";
import StarRating from "../StarRating/StarRating";

import "./ReviewForm.css";

const ReviewForm = ({ tourId }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) return;

    dispatch(addReview({ tour: tourId, rating, comment })).then((res) => {
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
        <p>
          <Link to="/login">Log in</Link> to write a review.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="review-form-success">
        <p>Thanks — your review has been posted.</p>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a review</h3>

      <div className="review-form-field">
        <label>Your rating</label>
        <StarRating value={rating} onChange={setRating} size={24} />
      </div>

      <div className="review-form-field">
        <label htmlFor="review-comment">Your review</label>
        <textarea
          id="review-comment"
          rows={4}
          maxLength={1000}
          placeholder="Share details of your experience on this tour…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="review-form-error">
          <span>{error}</span>
          <button type="button" onClick={handleDismissError}>
            ✕
          </button>
        </div>
      )}

      <button
        type="submit"
        className="review-form-submit"
        disabled={loading.action || rating === 0}
      >
        {loading.action ? "Posting…" : "Post review"}
      </button>
    </form>
  );
};

export default ReviewForm;