import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }
    const stored = window.localStorage.getItem(storageKey);
    return stored || defaultTheme;
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (value) => {
      const resolvedTheme = value === "system" ? (mediaQuery.matches ? "dark" : "light") : value;
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
    };

    applyTheme(theme);

    if (theme === "system") {
      const listener = () => applyTheme("system");
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme: (nextTheme) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, nextTheme);
      }
      setThemeState(nextTheme);
    },
  }), [theme, storageKey]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
