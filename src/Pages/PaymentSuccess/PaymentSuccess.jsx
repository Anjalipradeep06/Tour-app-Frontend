import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../../redux/slices/paymentSlice";

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
        await dispatch(verifyPayment(bookingId)).unwrap();

        // optional redirect after success
        setTimeout(() => {
          navigate("/my-bookings");
        }, 2000);
      } catch (err) {
        console.error(err);
      }
    };

    verify();
  }, [bookingId, dispatch, navigate]);

  return (
    <div className="payment-success">
      {loading && <h2>Verifying payment...</h2>}

      {success && <h2>✅ Payment Successful!</h2>}

      {error && <h2>❌ {error}</h2>}
    </div>
  );
};

export default PaymentSuccess;