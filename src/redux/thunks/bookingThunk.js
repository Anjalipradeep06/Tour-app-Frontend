import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// CREATE BOOKING
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkAPI) => {
    try {
      const { data } = await api.post(
        "/api/bookings",
        bookingData,
        getAuthConfig()
      );
      return data.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

// GET ALL
export const getUserBookings = createAsyncThunk(
  "booking/getAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/api/bookings", getAuthConfig());
      return data.bookings;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// GET BY ID
export const getBookingById = createAsyncThunk(
  "booking/getById",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/api/bookings/${id}`,
        getAuthConfig()
      );
      return data.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  }
);

// UPDATE
export const updateBooking = createAsyncThunk(
  "booking/update",
  async ({ id, bookingData }, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/api/bookings/${id}`,
        bookingData,
        getAuthConfig()
      );
      return data.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update booking"
      );
    }
  }
);

// CANCEL
export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/api/bookings/${id}/cancel`,
        {},
        getAuthConfig()
      );
      return data.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);
export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async (
    { tourId, date, participants },
    thunkAPI
  ) => {
    try {
      const { data } = await api.get(
        "/api/availability/check",
        {
          params: {
            tourId,
            date,
            participants,
          },
        }
      );

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to check availability"
      );
    }
  }
);