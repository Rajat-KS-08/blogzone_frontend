import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import blogReducer from "./slices/blogReducer";
import authReducer from "./slices/authReducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  ...blogReducer,
  auth: authReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
