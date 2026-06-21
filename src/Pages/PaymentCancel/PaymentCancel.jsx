import { Link, useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

import "./PaymentStatus.css";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page">
      <div className="payment-card">
        <FaTimesCircle className="payment-icon error" />

        <span className="payment-badge error">
          Payment Cancelled
        </span>

        <h1>Your payment was not completed</h1>

        <p>
          No charges were made to your account.
          You can return to your booking and try
          again whenever you're ready.
        </p>

        <div className="payment-actions">
          <button
            className="primary-btn"
            onClick={() => navigate(-1)}
          >
            Try Again
          </button>

          <Link
            to="/bookings"
            className="secondary-btn"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;