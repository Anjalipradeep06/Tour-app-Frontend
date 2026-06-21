import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../thunks/authThunk";

const storedAuth = localStorage.getItem("auth");

const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;

const initialState = {
  user: parsedAuth?.user || null,
  token: parsedAuth?.token || null,

  loading: false,
  error: null,
  success: false,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
      state.success = false;
    },

    logout: (state) => {
      localStorage.removeItem("auth");

      state.user = null;
      state.token = null;
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;

        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
          })
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;

        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
          })
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, logout } = authSlice.actions;
export default authSlice.reducer;