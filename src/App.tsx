import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./components/Auth_Components/ProtectedRoutes";
import HomePage from "./pages/HomePage";
import MyProfilePage from "./pages/MyProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./components/Auth_Components/LoginPage";
import AppLayout from "./components/Layout_Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./redux/rootReducer";
import { getUserData } from "./apiServices/authService";
import { setUserData } from "./redux/slices/authReducer";

function App() {
  const dispatch = useDispatch();
  const user_id = useSelector(
    (state: RootState) => state?.auth?.user?.user_id || ""
  );
  
  const fetchUser = async () => {
    try {
      const userData = await getUserData(user_id);
      // console.log("Fetched user data:", userData);
      dispatch(setUserData(userData));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchUser();
    }
  }, [user_id]);

  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        {/* 🔒 Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="my_profile/" element={<MyProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
        {/* catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
