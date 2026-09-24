import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Navigation from "./components/layout/Navigation";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// Guard component that verifies user authentication
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  return children;
}

function MainApp() {
  const { darkMode, isArabic } = useTheme();
  const location = useLocation();

  // Hide navigation bar when on the /signup route
  const hideNavigation = location.pathname === "/signup";

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home darkMode={darkMode} isArabic={isArabic} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home darkMode={darkMode} isArabic={isArabic} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions darkMode={darkMode} isArabic={isArabic} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNavigation && <Navigation darkMode={darkMode} isArabic={isArabic} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </ThemeProvider>
  );
}