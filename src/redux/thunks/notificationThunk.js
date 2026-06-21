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

// GET NOTIFICATIONS (paginated)
export const getNotifications = createAsyncThunk(
  "notification/getAll",
  async ({ page = 1, limit = 20 } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/api/notifications?page=${page}&limit=${limit}`,
        getAuthConfig()
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// GET UNREAD COUNT
export const getUnreadCount = createAsyncThunk(
  "notification/getUnreadCount",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(
        "/api/notifications/unread-count",
        getAuthConfig()
      );
      return data.unreadCount;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

// MARK ONE AS READ
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.patch(
        `/api/notifications/${id}/read`,
        {},
        getAuthConfig()
      );
      return data.notification;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

// MARK ALL AS READ
export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.patch(
        "/api/notifications/read-all",
        {},
        getAuthConfig()
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);