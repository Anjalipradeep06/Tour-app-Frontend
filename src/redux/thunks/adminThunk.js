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
   DASHBOARD STATS
================================================= */
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

/* =================================================
   GET ALL BOOKINGS
================================================= */
export const getAllBookings = createAsyncThunk(
  "admin/getAllBookings",
  async ({ page = 1, limit = 8 } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/admin/bookings?page=${page}&limit=${limit}`,
        getAuthConfig()
      );
      return {
        bookings: data.bookings || [],
        currentPage: data.pagination?.currentPage || page,
        totalPages: data.pagination?.totalPages || 1,
        totalBookings: data.pagination?.totalItems || 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

/* =================================================
   GET PENDING BOOKINGS
================================================= */
export const getPendingBookings = createAsyncThunk(
  "admin/getPendingBookings",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/admin/bookings/pending", getAuthConfig());
      return data.bookings || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending bookings"
      );
    }
  }
);

/* =================================================
   APPROVE BOOKING
================================================= */
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

/* =================================================
   REJECT BOOKING
================================================= */
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

/* =================================================
   COMPLETE BOOKING
================================================= */
export const completeBooking = createAsyncThunk(
  "admin/completeBooking",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/bookings/${id}/complete`,
        {},
        getAuthConfig()
      );
      return data.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to complete booking"
      );
    }
  }
);