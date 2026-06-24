import { createSlice } from "@reduxjs/toolkit";
import {
  startPayment,
  verifyPayment,
} from "../thunks/paymentThunk";

const initialState = {
  loading: false,
  error: null,
  message: null,

  sessionUrl: null,

  success: false,

  // latest paid/updated booking
  booking: null,

  // 🔥 optional: helps sync UI if bookings exist in same app state
  lastUpdatedBookingId: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    resetPayment: () => initialState,

    clearPaymentError: (state) => {
      state.error = null;
    },

    clearPaymentMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------------- START PAYMENT ---------------- */
      .addCase(startPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(startPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionUrl = action.payload.url;
        state.message = action.payload.message;
      })

      .addCase(startPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- VERIFY PAYMENT ---------------- */
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })

      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedBooking = action.payload.booking;

        state.booking = updatedBooking;
        state.message = action.payload.message;

        state.lastUpdatedBookingId = updatedBooking?._id;

        /*
          🔥 IMPORTANT:
          Redux cannot directly update other slices (booking/admin slice),
          but this flag allows UI to auto-sync instantly.
        */
      })

      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetPayment,
  clearPaymentError,
  clearPaymentMessage,
} = paymentSlice.actions;

export default paymentSlice.reducer;