"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Services", "/services"],
  ["Careers", "/careers"],
  ["Contact Us", "/contact"],
];

export default function Navbar({ open, onNavigate }) {
  const pathname = usePathname();

  return (
    <nav id="nav" className={open ? "open" : ""} aria-label="Main navigation">
      {links.map(([label, href]) => (
        <Link
          href={href}
          key={href}
          aria-current={pathname === href ? "page" : undefined}
          onClick={onNavigate}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
