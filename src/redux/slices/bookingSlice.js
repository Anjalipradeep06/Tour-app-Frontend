import { createSlice } from "@reduxjs/toolkit";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} from "../thunks/bookingThunk";

const initialState = {
  bookings: [],
  selectedBooking: null,

  loading: {
    list: false,
    detail: false,
    action: false,
  },

  error: null,
  success: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,

  reducers: {
    resetBookingState: (state) => {
      state.bookings = state.bookings;
      state.selectedBooking = null;

      state.loading = {
        list: false,
        detail: false,
        action: false,
      };

      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.success = true;
        state.selectedBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getUserBookings.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading.list = false;
        state.bookings = action.payload;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getBookingById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.selectedBooking = action.payload;

        state.bookings = state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      // CANCEL
      .addCase(cancelBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.selectedBooking = action.payload;

        state.bookings = state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;