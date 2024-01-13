import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";
interface Props {
  displayName: string | null;
  photourl: string | null;
  uid: string;
  timestamp: Timestamp;
}
const chatSlice = createSlice({
  initialState: { user: null as Props | null },
  name: "chat",
  reducers: {
    selectedUser: (state, action: PayloadAction<Props>) => {
      state.user = action.payload;
      localStorage.setItem("userUid", action.payload.uid);
    },
  },
});
// export const chatActions = chatSlice.actions;
// export default chatSlice.reducer;
export const chatActions = chatSlice.actions;
export default chatSlice.reducer;
