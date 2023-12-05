import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import chatReducer from "./chatSlice";
const store = configureStore({
  reducer: {
    authReducer,
    chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export default store;
