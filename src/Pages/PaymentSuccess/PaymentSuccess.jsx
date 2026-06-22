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
import { toast } from "react-toastify";

import {
  FaCheckCircle,
  FaReceipt,
} from "react-icons/fa";

import { verifyPayment } from "../../redux/thunks/paymentThunk";

import {
  clearPaymentError,
  clearPaymentMessage,
  resetPayment,
} from "../../redux/slices/paymentSlice";

import "./PaymentStatus.css";

const PaymentSuccess = () => {
  const { bookingId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    success,
    loading,
    error,
    message,
  } = useSelector((state) => state.payment);

  useEffect(() => {
    // Reset any stale payment state first, then verify
    dispatch(resetPayment());
    dispatch(verifyPayment(bookingId));
  }, [dispatch, bookingId]);

  useEffect(() => {
    if (message) {
      toast.success(message, {
        toastId: "payment-success",
      });

      dispatch(clearPaymentMessage());
    }

    if (error) {
      toast.error(error, {
        toastId: "payment-error",
      });

      dispatch(clearPaymentError());
    }
  }, [message, error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/bookings/${bookingId}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, bookingId, navigate]);

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
              Your payment was processed successfully.
              You will be redirected to your booking
              details shortly.
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