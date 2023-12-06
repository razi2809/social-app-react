import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";
const authSlice = createSlice({
  initialState: {
    isLoggedIn: false,
    user: null as firebase.User | null,
  },
  name: "auth",
  reducers: {
    login: (state, action: PayloadAction<firebase.User | null>) => {
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
