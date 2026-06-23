import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* =========================
   REGISTER
========================= */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/register",
        userData
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);

/* =========================
   LOGIN
========================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/login",
        userData
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const response = await api.put(
        "/auth/profile",
        profileData
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  }
);