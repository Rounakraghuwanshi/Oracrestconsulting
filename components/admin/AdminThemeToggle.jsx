"use client";

import { useEffect } from "react";
import AdminIcon from "./AdminIcons";

export default function AdminThemeToggle() {
  function syncLabel(theme) {
    const button = document.getElementById("tt");
    const light = theme === "light";
    button?.setAttribute(
      "aria-label",
      light ? "Switch to dark theme" : "Switch to light theme",
    );
    if (button) button.title = light ? "Dark theme" : "Light theme";
  }

  useEffect(() => {
    const root = document.querySelector(".adminRoot");
    let theme = "dark";
    try {
      theme = localStorage.getItem("oracrest-theme") === "light" ? "light" : "dark";
    } catch (error) {
      console.error("Could not read the saved admin theme.", error);
    }
    if (root) root.dataset.theme = theme;
    syncLabel(theme);
  }, []);

  function toggle() {
    const root = document.querySelector(".adminRoot");
    if (!root) return;
    const theme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = theme;
    try {
      localStorage.setItem("oracrest-theme", theme);
    } catch (error) {
      console.error("Could not save the selected admin theme.", error);
    }
    syncLabel(theme);
  }

  return (
    <button
      type="button"
      className="icb"
      id="tt"
      aria-label="Switch to light theme"
      title="Light theme"
      onClick={toggle}
    >
      <AdminIcon name="sun" className="sun" />
      <AdminIcon name="moon" className="moon" />
    </button>
  );
}
