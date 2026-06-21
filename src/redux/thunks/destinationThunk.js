import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Get All Destinations (Admin)
// Backend returns: { success, total, page, pages, count, destinations }
export const getAllDestinations = createAsyncThunk(
  "destinations/getAllDestinations",
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get("/destinations/all", {
        params,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch destinations"
      );
    }
  }
);

// Get Featured Destinations
export const getFeaturedDestinations =
  createAsyncThunk(
    "destinations/getFeaturedDestinations",
    async (_, thunkAPI) => {
      try {
        const response = await api.get(
          "/destinations/featured"
        );

        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch destinations"
        );
      }
    }
  );

// Get Destinations By Continent
export const getDestinationsByContinent =
  createAsyncThunk(
    "destinations/getDestinationsByContinent",
    async (continent, thunkAPI) => {
      try {
        const response = await api.get(
          `/destinations/${continent}`
        );

        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch destinations"
        );
      }
    }
  );

// Get Popular Destinations
export const getPopularDestinations =
  createAsyncThunk(
    "destinations/getPopularDestinations",
    async (continent, thunkAPI) => {
      try {
        const response = await api.get(
          `/destinations/${continent}/popular`
        );

        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch popular destinations"
        );
      }
    }
  );

// Get Single Destination + Related Tours
export const getDestinationById =
  createAsyncThunk(
    "destinations/getDestinationById",
    async (id, thunkAPI) => {
      try {
        const response = await api.get(
          `/api/destinations/details/${id}`
        );

        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch destination"
        );
      }
    }
  );

// =====================
// Create Destination (Admin)
// Backend expects multipart/form-data (multer fields:
// bannerImage, galleryImages) and returns the flat
// destination object — no wrapper, no message field.
//
// Call with a plain object, e.g.:
//   { name, country, continent, description, isFeatured,
//     isPopular, bannerImage: File, galleryImages: File[] }
// This thunk builds the FormData for you.
// =====================
export const createDestination = createAsyncThunk(
  "destinations/createDestination",
  async (destinationData, thunkAPI) => {
    try {
      const formData = new FormData();

      Object.entries(destinationData).forEach(([key, value]) => {
        if (key === "bannerImage" && value instanceof File) {
          formData.append("bannerImage", value);
        } else if (key === "galleryImages" && Array.isArray(value)) {
          value.forEach((file) => formData.append("galleryImages", file));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await api.post(
        "/api/destinations",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to create destination"
      );
    }
  }
);