import API from "../../api/axios";

// create stripe session
export const createStripeSession = async (bookingId) => {
  const { data } = await API.post(
    `/payments/create-session/${bookingId}`
  );

  return data; // MUST return data
};


// verify payment
export const verifyStripePayment = async (bookingId) => {
  const { data } = await API.patch(
    `/payments/verify/${bookingId}`
  );

  return data; // MUST return data
};