"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function ThemeSwitcher() {
  const t = useTranslations();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for user preference in localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || 
        (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Update DOM and localStorage
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === "light" ? t("theme.dark") : t("theme.light")}
    </button>
  );
}
