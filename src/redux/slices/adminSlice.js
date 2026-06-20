import { createSlice } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  getAllBookings,
  getPendingBookings,
  approveBooking,
  rejectBooking,
} from "../thunks/adminThunk";

const initialState = {
  stats: null,
  allBookings: [],
  pendingBookings: [],

  loading: {
    stats: false,
    bookings: false,
    action: false,
  },

  actionTargetId: null,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    resetAdminError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // DASHBOARD STATS
      .addCase(getDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload;
      })

      // ALL BOOKINGS
      .addCase(getAllBookings.pending, (state) => {
        state.loading.bookings = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading.bookings = false;
        state.allBookings = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error = action.payload;
      })

      // PENDING BOOKINGS
      .addCase(getPendingBookings.pending, (state) => {
        state.loading.bookings = true;
        state.error = null;
      })
      .addCase(getPendingBookings.fulfilled, (state, action) => {
        state.loading.bookings = false;
        state.pendingBookings = action.payload;
      })
      .addCase(getPendingBookings.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error = action.payload;
      })

      // APPROVE
      .addCase(approveBooking.pending, (state, action) => {
        state.loading.action = true;
        state.actionTargetId = action.meta.arg;
        state.error = null;
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;

        const updated = action.payload;

        state.pendingBookings = state.pendingBookings.filter(
          (b) => b._id !== updated._id
        );

        state.allBookings = state.allBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      .addCase(approveBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;
        state.error = action.payload;
      })

      // REJECT
      .addCase(rejectBooking.pending, (state, action) => {
        state.loading.action = true;
        state.actionTargetId = action.meta.arg;
        state.error = null;
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;

        const updated = action.payload;

        state.pendingBookings = state.pendingBookings.filter(
          (b) => b._id !== updated._id
        );

        state.allBookings = state.allBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      .addCase(rejectBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;
        state.error = action.payload;
      });
  },
});

export const { resetAdminError } = adminSlice.actions;
export default adminSlice.reducer;