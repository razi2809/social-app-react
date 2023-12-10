import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface Props {
  displayName: string | null;
  photourl: string | null;
  uid: string;
}
const chatSlice = createSlice({
  initialState: { user: null as Props | null },
  name: "chat",
  reducers: {
    selectedUser: (state, action: PayloadAction<Props>) => {
      state.user = action.payload;
      localStorage.setItem("User", JSON.stringify(action.payload));
    },
  },
});
// export const chatActions = chatSlice.actions;
// export default chatSlice.reducer;
export const chatActions = chatSlice.actions;
export default chatSlice.reducer;
