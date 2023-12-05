import { createSlice } from "@reduxjs/toolkit";
const chatSlice = createSlice({
  initialState: { user: null },
  name: "chat",
  reducers: {
    selctedUser: (state, action) => {
      state.user = action.payload;
      //   console.log(action.payload);
    },
  },
});
export const chatActions = chatSlice.actions;
export default chatSlice.reducer;
