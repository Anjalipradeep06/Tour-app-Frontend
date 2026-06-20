import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// =====================
// Get All Tours
// =====================
export const getAllTours = createAsyncThunk(
  "tours/getAllTours",
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get("/tours", {
        params,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tours"
      );
    }
  }
);

// =====================
// Get Single Tour
// =====================
export const getTourById = createAsyncThunk(
  "tours/getTourById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/tours/${id}`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tour"
      );
    }
  }
);

// =====================
// Create Tour (Admin)
// Backend returns: { message, tour }
// =====================
export const createTour = createAsyncThunk(
  "tours/createTour",
  async (tourData, thunkAPI) => {
    try {
      const response = await api.post("/tours", tourData);

      return response.data.tour;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create tour"
      );
    }
  }
);

// =====================
// Update Tour (Admin)
// Backend returns: { message, tour }
// =====================
export const updateTour = createAsyncThunk(
  "tours/updateTour",
  async ({ id, tourData }, thunkAPI) => {
    try {
      const response = await api.put(`/tours/${id}`, tourData);

      return response.data.tour;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update tour"
      );
    }
  }
);

// =====================
// Delete Tour (Admin)
// Backend returns only: { message } — no tour data.
// We pass the id back out explicitly so the slice can
// remove the right item from state without relying on payload.
// =====================
export const deleteTour = createAsyncThunk(
  "tours/deleteTour",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/tours/${id}`);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete tour"
      );
    }
  }
);