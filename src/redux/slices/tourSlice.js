import { createSlice } from "@reduxjs/toolkit";

import {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from "../thunks/tourThunk";

const initialState = {
  tours: [],
  selectedTour: null,

  loading: false,
  error: null,

  // Separate from list loading/error so submitting the
  // create/edit form doesn't blank out the tours table.
  actionLoading: false,
  actionError: null,
  actionSuccess: false,

  total: 0,
  page: 1,
  pages: 1,
};

const tourSlice = createSlice({
  name: "tours",

  initialState,

  reducers: {
    clearSelectedTour: (state) => {
      state.selectedTour = null;
    },

    resetTourActionState: (state) => {
      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // Get All Tours
      .addCase(getAllTours.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllTours.fulfilled, (state, action) => {
        state.loading = false;

        state.tours = action.payload.tours;

        state.total = action.payload.total;

        state.page = action.payload.page;

        state.pages = action.payload.pages;
      })

      .addCase(getAllTours.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // Get Tour Details
      .addCase(getTourById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getTourById.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedTour = action.payload;
      })

      .addCase(getTourById.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // Create Tour (Admin)
      .addCase(createTour.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })

      .addCase(createTour.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // New tour goes to the top of the list, matching the
        // backend's default sort (createdAt: -1 / newest first).
        state.tours = [action.payload, ...state.tours];
        state.total += 1;
      })

      .addCase(createTour.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Update Tour (Admin)
      .addCase(updateTour.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })

      .addCase(updateTour.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        state.tours = state.tours.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );

        if (state.selectedTour?._id === action.payload._id) {
          state.selectedTour = action.payload;
        }
      })

      .addCase(updateTour.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Delete Tour (Admin)
      .addCase(deleteTour.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })

      .addCase(deleteTour.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // payload here is the deleted tour's id (see tourThunk.js —
        // the backend's delete response has no tour data to match on).
        state.tours = state.tours.filter((t) => t._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })

      .addCase(deleteTour.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearSelectedTour, resetTourActionState } = tourSlice.actions;

export default tourSlice.reducer;