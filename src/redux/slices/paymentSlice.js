import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  createStripeSession,
  verifyStripePayment,
} from "../../redux/thunks/paymentThunk";

// -------------------- START PAYMENT --------------------

export const startPayment = createAsyncThunk(
  "payment/startPayment",
  async (bookingId, { rejectWithValue }) => {
    try {
      return await createStripeSession(
        bookingId
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Payment failed"
      );
    }
  }
);

// -------------------- VERIFY PAYMENT --------------------

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (bookingId, { rejectWithValue }) => {
    try {
      return await verifyStripePayment(
        bookingId
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Verification failed"
      );
    }
  }
);

// -------------------- SLICE --------------------

const initialState = {
  loading: false,
  error: null,
  message: null,

  sessionUrl: null,

  success: false,
  booking: null,
};

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;

      state.sessionUrl = null;

      state.success = false;
      state.booking = null;
    },

    clearPaymentError: (state) => {
      state.error = null;
    },

    clearPaymentMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------- CREATE SESSION --------

      .addCase(
        startPayment.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.message = null;
        }
      )

      .addCase(
        startPayment.fulfilled,
        (state, action) => {
          state.loading = false;

          state.sessionUrl =
            action.payload.url;

          state.message =
            action.payload.message;
        }
      )

      .addCase(
        startPayment.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // -------- VERIFY PAYMENT --------

      .addCase(
        verifyPayment.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.message = null;
        }
      )

      .addCase(
        verifyPayment.fulfilled,
        (state, action) => {
          state.loading = false;

          state.success = true;

          state.booking =
            action.payload.booking;

          state.message =
            action.payload.message;
        }
      )

      .addCase(
        verifyPayment.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  resetPayment,
  clearPaymentError,
  clearPaymentMessage,
} = paymentSlice.actions;

export default paymentSlice.reducer;