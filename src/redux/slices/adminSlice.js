import { createSlice } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  getAllBookings,
  getPendingBookings,
  approveBooking,
  rejectBooking,
  completeBooking,
} from "../thunks/adminThunk";

const initialState = {
  stats: null,

  allBookings: [],
  pendingBookings: [],

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
  },

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

      /* ---------------- DASHBOARD ---------------- */
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

      /* ---------------- ALL BOOKINGS ---------------- */
      .addCase(getAllBookings.pending, (state) => {
        state.loading.bookings = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading.bookings = false;

        state.allBookings = action.payload.bookings;

        state.pagination = {
          currentPage: action.payload.pagination?.currentPage,
          totalPages: action.payload.pagination?.totalPages,
          totalBookings: action.payload.pagination?.totalBookings,
        };
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error = action.payload;
      })

      /* ---------------- PENDING BOOKINGS ---------------- */
      .addCase(getPendingBookings.pending, (state) => {
        state.loading.bookings = true;
        state.error = null;
      })
      .addCase(getPendingBookings.fulfilled, (state, action) => {
        state.loading.bookings = false;

        // FIX: ensure correct structure
        state.pendingBookings = action.payload.bookings;
      })
      .addCase(getPendingBookings.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error = action.payload;
      })

      /* ---------------- APPROVE BOOKING ---------------- */
      .addCase(approveBooking.pending, (state, action) => {
        state.loading.action = true;
        state.actionTargetId = action.meta.arg;
        state.error = null;
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;

        const updated = action.payload;

        // remove from pending list immediately
        state.pendingBookings = state.pendingBookings.filter(
          (b) => b._id !== updated._id
        );

        // update in all bookings list
        state.allBookings = state.allBookings.map((b) =>
          b._id === updated._id ? updated : b
        );

        // update stats instantly (optional but powerful UX)
        if (state.stats) {
          state.stats.pendingBookings =
            (state.stats.pendingBookings || 1) - 1;
          state.stats.confirmedBookings =
            (state.stats.confirmedBookings || 0) + 1;
        }
      })
      .addCase(approveBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;
        state.error = action.payload;
      })

      /* ---------------- REJECT BOOKING ---------------- */
      .addCase(rejectBooking.pending, (state, action) => {
        state.loading.action = true;
        state.actionTargetId = action.meta.arg;
        state.error = null;
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;

        const updated = action.payload;

        // remove from pending immediately
        state.pendingBookings = state.pendingBookings.filter(
          (b) => b._id !== updated._id
        );

        state.allBookings = state.allBookings.map((b) =>
          b._id === updated._id ? updated : b
        );

        // stats update
        if (state.stats) {
          state.stats.pendingBookings =
            (state.stats.pendingBookings || 1) - 1;
          state.stats.cancelledBookings =
            (state.stats.cancelledBookings || 0) + 1;
        }
      })
      .addCase(rejectBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;
        state.error = action.payload;
      })

      /* ---------------- COMPLETE BOOKING ---------------- */
      .addCase(completeBooking.pending, (state, action) => {
        state.loading.action = true;
        state.actionTargetId = action.meta.arg;
        state.error = null;
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;

        const updated = action.payload;

        state.allBookings = state.allBookings.map((b) =>
          b._id === updated._id ? updated : b
        );

        // stats update
        if (state.stats) {
          state.stats.completedBookings =
            (state.stats.completedBookings || 0) + 1;
        }
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.loading.action = false;
        state.actionTargetId = null;
        state.error = action.payload;
      });
  },
});

export const { resetAdminError } = adminSlice.actions;
export default adminSlice.reducer;