import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTourReviews } from "../../redux/thunks/reviewThunk";
import { clearReviews, resetReviewState } from "../../redux/slices/reviewSlice";
import StarRating from "../StarRating/StarRating";
import ReviewList from "../ReviewList/ReviewList";
import ReviewForm from "../ReviewForm/ReviewForm";

import "./Reviews.css";

/**
 * tourId: the tour to show/add reviews for
 * averageRating, totalReviews: from the Tour document (already aggregated server-side)
 */
const Reviews = ({ tourId, averageRating = 0, totalReviews = 0 }) => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getTourReviews(tourId));

    return () => {
      dispatch(clearReviews());
      dispatch(resetReviewState());
    };
  }, [dispatch, tourId]);

  return (
    <section className="reviews-section">
      <div className="reviews-summary">
        <h2>Reviews</h2>

        <div className="reviews-summary-stats">
          <span className="reviews-average">{averageRating || 0}</span>
          <div className="reviews-summary-meta">
            <StarRating value={averageRating} size={16} />
            <span className="reviews-count">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>

      <div className="reviews-body">
        <ReviewList reviews={reviews} loading={loading.list} />
        <ReviewForm tourId={tourId} />
      </div>
    </section>
  );
};

export default Reviews;