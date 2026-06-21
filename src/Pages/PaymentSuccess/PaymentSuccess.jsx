import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  FaCheckCircle,
  FaReceipt,
} from "react-icons/fa";

import { verifyPayment } from "../../redux/slices/paymentSlice";

import "./PaymentStatus.css";

const PaymentSuccess = () => {
  const { bookingId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, loading, error } = useSelector(
    (state) => state.payment
  );

  useEffect(() => {
    const verify = async () => {
      try {
        await dispatch(
          verifyPayment(bookingId)
        ).unwrap();

        setTimeout(() => {
          navigate(`/bookings/${bookingId}`);
        }, 3000);
      } catch (err) {
        console.error(err);
      }
    };

    verify();
  }, [bookingId, dispatch, navigate]);

  return (
    <div className="payment-page">
      <div className="payment-card">
        {loading && (
          <>
            <div className="payment-spinner" />

            <h2>Verifying payment...</h2>

            <p>
              Please wait while we confirm your
              transaction.
            </p>
          </>
        )}

        {!loading && success && (
          <>
            <FaCheckCircle className="payment-icon success" />

            <span className="payment-badge success">
              Payment Confirmed
            </span>

            <h1>Your booking is confirmed!</h1>

            <p>
              Your payment was processed
              successfully. You will be redirected
              to your booking details shortly.
            </p>

            <div className="payment-reference">
              <span>Booking Reference</span>
              <strong>
                #{bookingId.slice(-6).toUpperCase()}
              </strong>
            </div>

            <div className="payment-actions">
              <Link
                to={`/bookings/${bookingId}`}
                className="primary-btn"
              >
                <FaReceipt />
                View Booking
              </Link>

              <Link
                to="/"
                className="secondary-btn"
              >
                Explore More Tours
              </Link>
            </div>
          </>
        )}

        {!loading && error && (
          <>
            <div className="payment-icon error">
              ✕
            </div>

            <span className="payment-badge error">
              Verification Failed
            </span>

            <h1>Unable to verify payment</h1>

            <p>{error}</p>

            <div className="payment-actions">
              <Link
                to="/bookings"
                className="primary-btn"
              >
                Go to My Bookings
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;