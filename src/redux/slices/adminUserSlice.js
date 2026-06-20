import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers, softDeleteUser, restoreUser } from "../thunks/adminUserThunk";

const initialState = {
  users: [],
  count: 0,

  loading: false,
  error: null,

  // Separate from list loading, so deactivate/restore on one row
  // doesn't flicker the whole table into a loading state.
  actionLoading: false,
  actionError: null,
  actionTargetId: null,
};

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    resetAdminUserError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.count = action.payload.count;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Soft Delete User
      .addCase(softDeleteUser.pending, (state, action) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionTargetId = action.meta.arg;
      })
      .addCase(softDeleteUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(softDeleteUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        state.actionError = action.payload;
      })

      // Restore User
      .addCase(restoreUser.pending, (state, action) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionTargetId = action.meta.arg;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        state.actionError = action.payload;
      });
  },
});

export const { resetAdminUserError } = adminUserSlice.actions;
export default adminUserSlice.reducer;