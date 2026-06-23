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

// ---------------- DASHBOARD STATS ----------------
export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/admin/dashboard", getAuthConfig());
      return data.stats;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

// ---------------- ALL BOOKINGS (PAGINATED) ----------------
export const getAllBookings = createAsyncThunk(
  "admin/getAllBookings",
  async ({ page = 1, limit = 8 } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/admin/bookings?page=${page}&limit=${limit}`,
        getAuthConfig()
      );

      return data; 
      // { bookings, currentPage, totalPages, totalBookings }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// ---------------- PENDING BOOKINGS (NO PAGINATION YET OPTIONAL) ----------------
export const getPendingBookings = createAsyncThunk(
  "admin/getPendingBookings",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(
        "/admin/bookings/pending",
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

// ---------------- APPROVE ----------------
export const approveBooking = createAsyncThunk(
  "admin/approveBooking",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/admin/bookings/${id}/approve`,
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

// ---------------- REJECT ----------------
export const rejectBooking = createAsyncThunk(
  "admin/rejectBooking",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/admin/bookings/${id}/reject`,
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