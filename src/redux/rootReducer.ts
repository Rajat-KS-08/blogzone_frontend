import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import blogReducer from "./slices/blogReducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  ...blogReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
