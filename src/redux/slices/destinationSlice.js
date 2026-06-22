import { createSlice } from "@reduxjs/toolkit";

import {
  getAllDestinations,
  getFeaturedDestinations,
  getPopularDestinations,
  getDestinationsByContinent,
  getDestinationById,
  createDestination,
} from "../thunks/destinationThunk";
const storedAuth = localStorage.getItem("auth");

const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
const initialState = {
  featuredDestinations: parsedAuth?.featuredDestinations||null,
  destinations: parsedAuth?.destinations || null,
  popularDestinations: parsedAuth?.popularDestinations || null ,

  allDestinations:parsedAuth?.allDestinations || null,

  selectedDestination: parsedAuth?.selectedDestination || null,
  destinationTours: parsedAuth?.destinationTours || null,

  total: 0,
  page: 1,
  pages: 1,

  loading: false,
  error: null,

  actionLoading: false,
  actionError: null,
  actionSuccess: false,
};

const destinationSlice =
  createSlice({
    name: "destinations",

    initialState,

    reducers: {
      clearDestinations: (
        state
      ) => {
        state.destinations = [];
        state.popularDestinations = [];
      },

      clearSelectedDestination:
        (state) => {
          state.selectedDestination =
            null;
          state.destinationTours =
            [];
        },

      resetDestinationActionState:
        (state) => {
          state.actionLoading =
            false;
          state.actionError = null;
          state.actionSuccess =
            false;
        },
    },

    extraReducers: (builder) => {
      builder

        // ALL
        .addCase(
          getAllDestinations.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getAllDestinations.fulfilled,
          (state, action) => {
            state.loading = false;

            state.allDestinations =
              action.payload.destinations ||
              [];

            state.total =
              action.payload.total || 0;

            state.page =
              action.payload.page || 1;

            state.pages =
              action.payload.pages || 1;
          }
        )

        .addCase(
          getAllDestinations.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // FEATURED
        .addCase(
          getFeaturedDestinations.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          getFeaturedDestinations.fulfilled,
          (state, action) => {
            state.loading = false;

            state.featuredDestinations =
              action.payload
                .destinations ||
              action.payload ||
              [];
          }
        )

        .addCase(
          getFeaturedDestinations.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // POPULAR
        .addCase(
          getPopularDestinations.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          getPopularDestinations.fulfilled,
          (state, action) => {
            state.loading = false;

            state.popularDestinations =
              action.payload
                .destinations ||
              action.payload ||
              [];
          }
        )

        .addCase(
          getPopularDestinations.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // CONTINENT
        .addCase(
          getDestinationsByContinent.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          getDestinationsByContinent.fulfilled,
          (state, action) => {
            state.loading = false;

            state.destinations =
              action.payload
                .destinations ||
              action.payload ||
              [];
          }
        )

        .addCase(
          getDestinationsByContinent.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // SINGLE
        .addCase(
          getDestinationById.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          getDestinationById.fulfilled,
          (state, action) => {
            state.loading = false;

            state.selectedDestination =
              action.payload
                .destination ||
              action.payload;

            state.destinationTours =
              action.payload.tours ||
              [];
          }
        )

        .addCase(
          getDestinationById.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // CREATE
        .addCase(
          createDestination.pending,
          (state) => {
            state.actionLoading =
              true;
            state.actionError =
              null;
          }
        )

        .addCase(
          createDestination.fulfilled,
          (state, action) => {
            state.actionLoading =
              false;

            state.actionSuccess =
              true;

            state.allDestinations = [
              action.payload,
              ...state.allDestinations,
            ];
          }
        )

        .addCase(
          createDestination.rejected,
          (state, action) => {
            state.actionLoading =
              false;

            state.actionError =
              action.payload;
          }
        );
    },
  });

export const {
  clearDestinations,
  clearSelectedDestination,
  resetDestinationActionState,
} = destinationSlice.actions;

export default destinationSlice.reducer;