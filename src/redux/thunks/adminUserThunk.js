import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Get All Users (Admin)
// Backend returns: { success, count, users }
export const getAllUsers = createAsyncThunk(
  "adminUsers/getAllUsers",
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get("/admin/users", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Soft Delete (Deactivate) User
// Backend returns: { success, message, user }
export const softDeleteUser = createAsyncThunk(
  "adminUsers/softDeleteUser",
  async (id, thunkAPI) => {
    try {
      const response = await api.patch(`/admin/users/${id}/delete`);
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to deactivate user"
      );
    }
  }
);

// Restore User
// Backend returns: { success, message, user }
export const restoreUser = createAsyncThunk(
  "adminUsers/restoreUser",
  async (id, thunkAPI) => {
    try {
      const response = await api.patch(`/admin/users/${id}/restore`);
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to restore user"
      );
    }
  }
);