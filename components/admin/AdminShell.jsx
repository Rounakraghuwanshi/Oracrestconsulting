"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminIcon from "./AdminIcons";
import AdminThemeToggle from "./AdminThemeToggle";

const SearchContext = createContext("");
const navigation = [
  { label: "Dashboard", href: "/admin", icon: "home", supported: true },
  { label: "Jobs", href: "/admin/jobs", icon: "job", supported: true },
  { label: "Applications", icon: "users" },
  { label: "Enquiries", icon: "mail" },
  { label: "Articles", icon: "doc" },
  { label: "Team & access", icon: "set" },
];

export function useAdminSearch() {
  return useContext(SearchContext);
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setError("");
    setSigningOut(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Sign out failed.");
      }
      router.replace("/admin/login");
      router.refresh();
    } catch (signOutError) {
      setError(signOutError.message || "Sign out failed.");
      setSigningOut(false);
    }
  }

  return (
    <div className="app">
      <button
        type="button"
        className={`ov${sidebarOpen ? " on" : ""}`}
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sb${sidebarOpen ? " on" : ""}`}>
        <div className="brand">
          <Image
            src="/oracrest-logo.svg"
            alt="ORACREST"
            width={545}
            height={108}
            priority
          />
          <small>Admin</small>
        </div>
        <nav aria-label="Admin navigation">
          <div className="lbl">Manage</div>
          {navigation.map((item) =>
            item.supported ? (
              <Link
                href={item.href}
                key={item.label}
                className={
                  pathname === item.href ||
                  (item.href === "/admin/jobs" && pathname.startsWith("/admin/jobs/"))
                    ? "on"
                    : ""
                }
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <AdminIcon name={item.icon} />
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="nav-disabled"
                aria-disabled="true"
                title="This section is not enabled."
              >
                <AdminIcon name={item.icon} />
                {item.label}
              </span>
            ),
          )}
        </nav>
        <div className="me">
          <span className="av">AU</span>
          <div>
            <b>Admin User</b>
            <span>Super Admin</span>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            title={signingOut ? "Signing out..." : "Sign out"}
            disabled={signingOut}
            onClick={signOut}
          >
            <AdminIcon name="out" />
          </button>
        </div>
      </aside>
      <div className="main">
        <div className="top">
          <button
            type="button"
            className="icb mb"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <AdminIcon name="menu" />
          </button>
          <label className="search" htmlFor="admin-search">
            <AdminIcon name="search" />
            <input
              id="admin-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs..."
            />
          </label>
          <div className="sp">
            <Link className="btn g sm" href="/" target="_blank" rel="noopener noreferrer">
              View website
            </Link>
            <AdminThemeToggle />
          </div>
        </div>
        {error ? <p className="err admin-error" role="alert" aria-live="polite">{error}</p> : null}
        <SearchContext.Provider value={search}>
          {children}
        </SearchContext.Provider>
      </div>
    </div>
  );
}
