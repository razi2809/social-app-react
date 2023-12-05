import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  initialState: { isLoggedIn: false, user: null },
  name: "auth",
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
