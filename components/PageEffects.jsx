"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const app = document.getElementById("app");
    if (!app) return;

    app.classList.remove("pg");
    void app.offsetWidth;
    app.classList.add("pg");

    const elements = app.querySelectorAll(
      ".sec .t, .sec .lead, .card, .svc, .form, aside, .band .w",
    );
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => {
      const index = Array.from(element.parentNode.children).indexOf(element);
      element.style.setProperty("--d", `${(index % 4) * 0.09}s`);
      element.classList.add("rv");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
