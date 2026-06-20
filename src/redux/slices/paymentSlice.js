import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createStripeSession,
  verifyStripePayment,
} from "../thunks/paymentThunk";


// -------------------- START PAYMENT --------------------
export const startPayment = createAsyncThunk(
  "payment/startPayment",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await createStripeSession(bookingId);

      // IMPORTANT: backend returns { success, url }
      return res.url;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Payment failed"
      );
    }
  }
);


// -------------------- VERIFY PAYMENT --------------------
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await verifyStripePayment(bookingId);

      // backend returns { success, booking }
      return res.booking;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Verification failed"
      );
    }
  }
);


// -------------------- SLICE --------------------
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    sessionUrl: null,
    success: false,
    booking: null,
  },

  reducers: {
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.sessionUrl = null;
      state.success = false;
      state.booking = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------- CREATE SESSION --------
      .addCase(startPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionUrl = action.payload;
      })
      .addCase(startPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // -------- VERIFY PAYMENT --------
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.booking = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;