import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-cancel">
      <h2>❌ Payment Cancelled</h2>

      <button onClick={() => navigate(-1)}>
        Try Again
      </button>
    </div>
  );
};

export default PaymentCancel;