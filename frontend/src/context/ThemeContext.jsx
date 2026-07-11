import { createContext, useContext, useState, useEffect } from "react";
import { GetUserSettings, SaveTheamSettings } from "../utils/saveSettings";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initial sync read from localStorage to avoid styling flash
    try {
      const raw = localStorage.getItem("ShopNowUserSettings");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.theam) {
          return parsed.theam;
        }
      }
    } catch (e) {
      console.error("Error reading theme from localStorage on init", e);
    }
    return "system";
  });

  // Fetch from the settings module async just in case there is database synchronization needed
  useEffect(() => {
    const syncTheme = async () => {
      try {
        const res = await GetUserSettings();
        if (res.status && res.data && res.data.theam) {
          setTheme(res.data.theam);
        }
      } catch (err) {
        console.error("Failed to load user settings async", err);
      }
    };
    syncTheme();
  }, []);

  // Update theme class on document element when theme state changes
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      let activeTheme = theme;

      if (theme === "system") {
        activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }

      root.setAttribute("data-theme", activeTheme);
      root.classList.remove("light-theme", "dark-theme");
      root.classList.add(`${activeTheme}-theme`);
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      await SaveTheamSettings(newTheme);
    } catch (err) {
      console.error("Failed to save theme settings via utility", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
