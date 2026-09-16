import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("volto_dark_mode") === "true";
  });

  const [isArabic, setIsArabic] = useState(() => {
    return localStorage.getItem("volto_is_arabic") === "true";
  });

  useEffect(() => {
    localStorage.setItem("volto_dark_mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("volto_is_arabic", isArabic);
  }, [isArabic]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleArabic = () => setIsArabic((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleDarkMode,
        isArabic,
        setIsArabic,
        toggleArabic,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}