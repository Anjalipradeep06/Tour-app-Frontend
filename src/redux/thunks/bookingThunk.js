import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* =================================================
   AUTH HEADER
================================================= */
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =================================================
   CREATE BOOKING
================================================= */
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkAPI) => {
    try {
      const { data } = await api.post(
        "/bookings",
        bookingData,
        getAuthConfig()
      );

      return {
        booking: data.booking,
        message: data.message,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

/* =================================================
   GET USER BOOKINGS (FIXED + STANDARDIZED)
================================================= */
export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async ({ page = 1, limit = 5 } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/bookings?page=${page}&limit=${limit}`,
        getAuthConfig()
      );

      return {
        bookings: data.bookings || [],
        currentPage: data.currentPage || page,
        totalPages: data.totalPages || 1,
        totalBookings: data.totalBookings || 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

/* =================================================
   GET BOOKING BY ID
================================================= */
export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/bookings/${id}`,
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

/* =================================================
   UPDATE BOOKING
================================================= */
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ id, bookingData }, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/bookings/${id}`,
        bookingData,
        getAuthConfig()
      );

      return {
        booking: data.booking,
        message: data.message,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update booking"
      );
    }
  }
);

/* =================================================
   CANCEL BOOKING
================================================= */
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/bookings/${id}/cancel`,
        {},
        getAuthConfig()
      );

      return {
        booking: data.booking,
        message: data.message,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

/* =================================================
   CHECK AVAILABILITY
================================================= */
export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async ({ tourId, date, participants }, thunkAPI) => {
    try {
      const { data } = await api.get(
        "/availability/check",
        {
          params: { tourId, date, participants },
        }
      );

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to check availability"
      );
    }
  }
);