import { createSlice } from "@reduxjs/toolkit";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  checkAvailability,
} from "../thunks/bookingThunk";

const initialState = {
  bookings: [],
  selectedBooking: null,

  availability: null,

  loading: {
    list: false,
    detail: false,
    action: false,
  },

  error: null,
  success: false,
  message: null,
};

const bookingSlice = createSlice({
  name: "booking",

  initialState,

  reducers: {
    resetBookingState: (state) => {
      state.selectedBooking = null;
      state.availability = null;

      state.loading = {
        list: false,
        detail: false,
        action: false,
      };

      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearBookingMessage: (state) => {
      state.message = null;
      state.success = false;
    },

    clearBookingError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE BOOKING
      .addCase(createBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })

      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.success = true;

        state.selectedBooking = action.payload.booking;
        state.message = action.payload.message;
      })

      .addCase(createBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      // GET USER BOOKINGS
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

      // GET BOOKING BY ID
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

      // UPDATE BOOKING
      .addCase(updateBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })

      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.success = true;

        state.selectedBooking = action.payload.booking;
        state.message = action.payload.message;

        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.booking._id
            ? action.payload.booking
            : booking
        );
      })

      .addCase(updateBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      // CANCEL BOOKING
      .addCase(cancelBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })

      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.success = true;

        state.selectedBooking = action.payload.booking;
        state.message = action.payload.message;

        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.booking._id
            ? action.payload.booking
            : booking
        );
      })

      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      // CHECK AVAILABILITY
      .addCase(checkAvailability.pending, (state) => {
        state.availability = null;
      })

      .addCase(
        checkAvailability.fulfilled,
        (state, action) => {
          state.availability = action.payload;
        }
      )

      .addCase(
        checkAvailability.rejected,
        (state, action) => {
          state.availability = null;
          state.error = action.payload;
        }
      );
  },
});

export const {
  resetBookingState,
  clearBookingMessage,
  clearBookingError,
} = bookingSlice.actions;

export default bookingSlice.reducer;