import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  initialState: { theme: "light" } as { theme: string },
  name: "theme",
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
  },
});
export const themeActions = themeSlice.actions;
export default themeSlice.reducer;
