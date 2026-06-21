import API from "../../api/axios";

// Create Stripe Session
export const createStripeSession = async (
  bookingId
) => {
  const { data } = await API.post(
    `/payments/create-session/${bookingId}`
  );

  return data;
};

// Verify Stripe Payment
export const verifyStripePayment = async (
  bookingId
) => {
  const { data } = await API.patch(
    `/payments/verify/${bookingId}`
  );

  return data;
};