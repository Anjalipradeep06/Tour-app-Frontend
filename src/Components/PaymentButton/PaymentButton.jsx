import { useDispatch, useSelector } from "react-redux";
import { startPayment } from "../../redux/slices/paymentSlice";

const PaymentButton = ({ bookingId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.payment);

  const handlePayment = async () => {
    try {
      const res = await dispatch(startPayment(bookingId)).unwrap();

      // redirect to Stripe Checkout
      window.location.href = res;
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="pay-btn"
    >
      {loading ? "Redirecting..." : "Pay Now"}
    </button>
  );
};

export default PaymentButton;