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

// GET REVIEWS FOR A TOUR (public)
export const getTourReviews = createAsyncThunk(
  "review/getByTour",
  async (tourId, thunkAPI) => {
    try {
      const { data } = await api.get(`/reviews/${tourId}`);
      return data.reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// ADD REVIEW
export const addReview = createAsyncThunk(
  "review/add",
  async ({ tour, rating, comment }, thunkAPI) => {
    try {
      const { data } = await api.post(
        "/reviews",
        { tour, rating, comment },
        getAuthConfig()
      );
      return data.review;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

// DELETE REVIEW
export const deleteReview = createAsyncThunk(
  "review/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/reviews/${id}`, getAuthConfig());
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);