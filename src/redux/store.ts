import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { blogApi } from "./services/blogApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogApi.middleware),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type { RootState } from "./rootReducer";
