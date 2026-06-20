import { createSlice } from "@reduxjs/toolkit";

import {
  getAllDestinations,
  getFeaturedDestinations,
  getPopularDestinations,
  getDestinationsByContinent,
  getDestinationById,
  createDestination,
} from "../thunks/destinationThunk";

const initialState = {
  featuredDestinations: [],
  destinations: [],
  popularDestinations: [],

  // Admin "all destinations" list, separate from the
  // continent-scoped "destinations" array used on public pages.
  allDestinations: [],
  total: 0,
  page: 1,
  pages: 1,

  selectedDestination: null,
  destinationTours: [],

  loading: false,
  error: null,

  // Separate from list loading/error, same pattern as tourSlice,
  // so the create form doesn't blank out whatever list is on screen.
  actionLoading: false,
  actionError: null,
  actionSuccess: false,
};

const destinationSlice = createSlice({
  name: "destinations",

  initialState,

  reducers: {
    clearDestinations: (state) => {
      state.destinations = [];
      state.popularDestinations = [];
    },

    clearSelectedDestination: (state) => {
      state.selectedDestination = null;
      state.destinationTours = [];
    },

    resetDestinationActionState: (state) => {
      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // All Destinations (Admin)
      .addCase(getAllDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.allDestinations = action.payload.destinations;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })

      .addCase(getAllDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Featured Destinations
      .addCase(
        getFeaturedDestinations.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFeaturedDestinations.fulfilled,
        (state, action) => {
          state.loading = false;
          state.featuredDestinations =
            action.payload;
        }
      )

      .addCase(
        getFeaturedDestinations.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Destinations By Continent
      .addCase(
        getDestinationsByContinent.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getDestinationsByContinent.fulfilled,
        (state, action) => {
          state.loading = false;
          state.destinations =
            action.payload;
        }
      )

      .addCase(
        getDestinationsByContinent.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Popular Destinations
      .addCase(
        getPopularDestinations.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getPopularDestinations.fulfilled,
        (state, action) => {
          state.loading = false;
          state.popularDestinations =
            action.payload;
        }
      )

      .addCase(
        getPopularDestinations.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Single Destination
      .addCase(
        getDestinationById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getDestinationById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedDestination =
            action.payload.destination;

          state.destinationTours =
            action.payload.tours;
        }
      )

      .addCase(
        getDestinationById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Create Destination (Admin)
      .addCase(createDestination.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })

      .addCase(createDestination.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // Always goes to the top of the admin "all" list.
        state.allDestinations = [
          action.payload,
          ...state.allDestinations,
        ];
        state.total += 1;

        // No "get all destinations" endpoint existed when this was
        // first written, so we also prepend to whichever public lists
        // are currently relevant — featured/popular only if it qualifies.
        if (action.payload.isFeatured) {
          state.featuredDestinations = [
            action.payload,
            ...state.featuredDestinations,
          ];
        }

        if (action.payload.isPopular) {
          state.popularDestinations = [
            action.payload,
            ...state.popularDestinations,
          ];
        }

        // Also surface it in the continent-scoped list if that's
        // what's currently loaded, so it shows up immediately.
        if (
          state.destinations.length > 0 &&
          state.destinations[0]?.continent === action.payload.continent
        ) {
          state.destinations = [action.payload, ...state.destinations];
        }
      })

      .addCase(createDestination.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const {
  clearDestinations,
  clearSelectedDestination,
  resetDestinationActionState,
} = destinationSlice.actions;

export default destinationSlice.reducer;