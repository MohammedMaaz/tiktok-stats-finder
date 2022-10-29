import { configureStore } from "@reduxjs/toolkit";
import tiktok from "./modules/tiktok/redux";

export const store = configureStore({
  reducer: {
    tiktok,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
