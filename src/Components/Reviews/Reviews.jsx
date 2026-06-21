import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTourReviews } from "../../redux/thunks/reviewThunk";
import {
  clearReviews,
  resetReviewState,
} from "../../redux/slices/reviewSlice";

import StarRating from "../StarRating/StarRating";
import ReviewList from "../ReviewList/ReviewList";
import ReviewForm from "../ReviewForm/ReviewForm";

import "./Reviews.css";

const Reviews = ({
  tourId,
  averageRating = 0,
  totalReviews = 0,
}) => {
  const dispatch = useDispatch();

  const { reviews, loading } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    if (tourId) {
      dispatch(getTourReviews(tourId));
    }

    return () => {
      dispatch(clearReviews());
      dispatch(resetReviewState());
    };
  }, [dispatch, tourId]);

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <div className="reviews-title">
          <span className="reviews-label">
            Traveler Feedback
          </span>

          <h2>Guest Reviews</h2>
        </div>

        <div className="reviews-summary">
          <span className="reviews-average">
            {Number(averageRating).toFixed(1)}
          </span>

          <div className="reviews-summary-meta">
            <StarRating
              value={averageRating}
              size={18}
            />

            <span className="reviews-count">
              {totalReviews}{" "}
              {totalReviews === 1
                ? "verified review"
                : "verified reviews"}
            </span>
          </div>
        </div>
      </div>

      <div className="reviews-body">
        <div className="reviews-list-wrapper">
          <ReviewList
            reviews={reviews}
            loading={loading?.list}
          />
        </div>

        <aside className="reviews-form-wrapper">
          <ReviewForm tourId={tourId} />
        </aside>
      </div>
    </section>
  );
};

export default Reviews;