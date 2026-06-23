import { useDispatch, useSelector } from "react-redux";
import {
  FaLock,
  FaCreditCard,
  FaSpinner,
  FaHourglassHalf,
} from "react-icons/fa";

import { startPayment } from "../../redux/thunks/paymentThunk";

import "./PaymentButton.css";

const PaymentButton = ({ booking }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector(
    (state) => state.payment
  );

  // ================= GUARD: booking not loaded yet =================
  if (!booking) {
    return null;
  }

  const handlePayment = async () => {
    try {
      const response = await dispatch(
        startPayment(booking._id)
      ).unwrap();

      window.location.href = response.url;
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  // ================= WAITING FOR ADMIN APPROVAL =================
  if (booking.status === "pending") {
    return (
      <div className="payment-wrapper">
        <button className="pay-btn waiting-btn" disabled>
          <FaHourglassHalf />
          Waiting for Admin Approval
        </button>

        <div className="payment-note">
          <FaLock />
          <span>
            You'll be able to pay once your booking is approved
          </span>
        </div>
      </div>
    );
  }

  // ================= ALREADY PAID =================
  if (booking.paymentStatus === "paid") {
    return null;
  }

  // ================= APPROVED — SHOW PAY BUTTON =================
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