import { createSlice } from "@reduxjs/toolkit";

type ThemeState = "light" | "dark";

const initialState: { theme: ThemeState } = {
  theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
};

const themeSlice = createSlice({
  name: "themeReducer",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
