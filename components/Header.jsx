"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      document.querySelector("header")?.classList.toggle("sc", window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header>
      <div className="w bar">
        <Link className="logo" href="/" aria-label="ORACREST Consulting home">
          <Image
            src="/oracrest-logo.svg"
            alt="ORACREST logo"
            width={545}
            height={108}
            priority
          />
        </Link>
        <button
          className="menu"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
        <Navbar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <ThemeToggle />
      </div>
    </header>
  );
}
