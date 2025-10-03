import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthState, IUser } from "../../models/authModel";

const storedUser = sessionStorage.getItem("user");

const initialState: IAuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: sessionStorage.getItem("accessToken"),
  isAuthenticated: !!sessionStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: IUser; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      sessionStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("accessToken");
    },
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserData: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    }
  },
});

export const { loginSuccess, logout, refreshTokenSuccess, setUserData } = authSlice.actions;
export default authSlice.reducer;