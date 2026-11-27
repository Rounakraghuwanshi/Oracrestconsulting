"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    const light = document.documentElement.dataset.theme === "light";
    const button = document.getElementById("tg");
    button?.setAttribute(
      "aria-label",
      light ? "Switch to dark mode" : "Switch to light mode",
    );
    if (button) button.title = light ? "Dark mode" : "Light mode";
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const light = root.dataset.theme !== "light";
    const theme = light ? "light" : "dark";
    root.classList.add("tt");
    root.dataset.theme = theme;
    try {
      localStorage.setItem("oc-theme", theme);
    } catch (error) {
      console.error("Could not save the selected color theme.", error);
    }

    const button = document.getElementById("tg");
    button?.setAttribute(
      "aria-label",
      light ? "Switch to dark mode" : "Switch to light mode",
    );
    if (button) button.title = light ? "Dark mode" : "Light mode";

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = light ? "#ffffff" : "#0D1220";
    window.setTimeout(() => root.classList.remove("tt"), 450);
  }

  return (
    <button
      className="tg"
      id="tg"
      type="button"
      aria-label="Switch to light mode"
      title="Light mode"
      onClick={toggleTheme}
    >
      <svg className="sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
