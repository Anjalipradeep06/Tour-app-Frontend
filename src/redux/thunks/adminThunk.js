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

// DASHBOARD STATS
export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(
        "/api/admin/dashboard",
        getAuthConfig()
      );
      return data.stats;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

// ALL BOOKINGS
export const getAllBookings = createAsyncThunk(
  "admin/getAllBookings",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(
        "/api/admin/bookings",
        getAuthConfig()
      );
      return data.bookings;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// PENDING BOOKINGS
export const getPendingBookings = createAsyncThunk(
  "admin/getPendingBookings",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(
        "/api/admin/bookings/pending",
        getAuthConfig()
      );
      return data.bookings;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending bookings"
      );
    }
  }
);

// APPROVE BOOKING
export const approveBooking = createAsyncThunk(
  "admin/approveBooking",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/api/admin/bookings/${id}/approve`,
        {},
        getAuthConfig()
      );
      return data.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to approve booking"
      );
    }
  }
);

// REJECT BOOKING
export const rejectBooking = createAsyncThunk(
  "admin/rejectBooking",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/api/admin/bookings/${id}/reject`,
        {},
        getAuthConfig()
      );
      return data.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reject booking"
      );
    }
  }
);