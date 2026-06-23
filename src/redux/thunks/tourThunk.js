import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// =====================
// GET ALL TOURS (PAGINATED SAFE)
// =====================
export const getAllTours = createAsyncThunk(
  "tours/getAllTours",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await api.get("/tours", {
        params,
      });

      return {
        tours: data.tours || [],
        total: data.total || 0,
        page: data.page || 1,
        pages: data.pages || 1,
        count: data.count || 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tours"
      );
    }
  }
);

// =====================
// GET SINGLE TOUR
// =====================
export const getTourById = createAsyncThunk(
  "tours/getTourById",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/tours/${id}`);

      return data.tour || null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tour"
      );
    }
  }
);

// =====================
// CREATE TOUR
// =====================
export const createTour = createAsyncThunk(
  "tours/createTour",
  async (tourData, thunkAPI) => {
    try {
      const { data } = await api.post("/tours", tourData);

      return data.tour || null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create tour"
      );
    }
  }
);

// =====================
// UPDATE TOUR
// =====================
export const updateTour = createAsyncThunk(
  "tours/updateTour",
  async ({ id, tourData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/tours/${id}`, tourData);

      return data.tour || null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update tour"
      );
    }
  }
);

// =====================
// DELETE TOUR
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