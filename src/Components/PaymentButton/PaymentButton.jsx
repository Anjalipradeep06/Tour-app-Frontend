import { useDispatch, useSelector } from "react-redux";
import {
  FaLock,
  FaCreditCard,
  FaSpinner,
} from "react-icons/fa";

import { startPayment } from "../../redux/thunks/paymentThunk";

import "./PaymentButton.css";

const PaymentButton = ({ bookingId }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector(
    (state) => state.payment
  );

  const handlePayment = async () => {
    try {
      const response = await dispatch(
        startPayment(bookingId)
      ).unwrap();

      window.location.href = response.url;
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="payment-wrapper">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="pay-btn"
      >
        {loading ? (
          <>
            <FaSpinner className="pay-spinner" />
            Redirecting...
          </>
        ) : (
          <>
            <FaCreditCard />
            Pay Securely
          </>
        )}
      </button>

      <div className="payment-note">
        <FaLock />

        <span>
          Secure checkout powered by Stripe
        </span>
      </div>
    </div>
  );
};

export default PaymentButton;