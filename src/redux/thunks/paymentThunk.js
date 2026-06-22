import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const startPayment = createAsyncThunk(
  "payment/startPayment",
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        `/payments/create-session/${bookingId}`,
        {},
        getAuthConfig()
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to start payment"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(
        `/payments/verify/${bookingId}`,
        {},
        getAuthConfig()
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to verify payment"
      );
    }
  }
);