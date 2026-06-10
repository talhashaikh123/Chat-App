import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import Profilepage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ["/login", "/signup"];

    // Skip auth check on login/signup page
    if (!publicRoutes.includes(location.pathname)) {
      checkAuth();
    }
  }, [checkAuth, location.pathname]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route path="/Settings" element={<SettingsPage />} />

        <Route
          path="/Profile"
          element={authUser ? <Profilepage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
