"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminIcon from "./AdminIcons";
import { useAdminSearch } from "./AdminShell";

const tabs = [
  ["all", "All"],
  ["open", "Published"],
  ["draft", "Draft"],
  ["closed", "Closed"],
];

function statusBadge(status) {
  if (status === "open") return ["Published", "ok"];
  if (status === "closed") return ["Closed", "mu"];
  return ["Draft", "wa"];
}

function displayDate(value) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function JobsPanel() {
  const search = useAdminSearch().trim().toLowerCase();
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/jobs", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Jobs could not be loaded.");
        return result;
      })
      .then((result) => {
        if (!active) return;
        setError("");
        setJobs(result.jobs);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Jobs could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reload]);

  const visibleJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesTab = tab === "all" || job.status === tab;
        const matchesSearch = `${job.title} ${job.location} ${job.department}`
          .toLowerCase()
          .includes(search);
        return matchesTab && matchesSearch;
      }),
    [jobs, search, tab],
  );

  async function setPublished(job, published) {
    setError("");
    setSavingId(job.id);
    try {
      const response = await fetch(`/api/admin/jobs/${encodeURIComponent(job.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...job, status: published ? "open" : "draft" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The job status could not be changed.");
      setLoading(true);
      setReload((current) => current + 1);
    } catch (saveError) {
      setError(saveError.message || "The job status could not be changed.");
    } finally {
      setSavingId("");
    }
  }

  async function remove(job) {
    if (!window.confirm(`Delete “${job.title}”? This cannot be undone.`)) return;
    setError("");
    setSavingId(job.id);
    try {
      const response = await fetch(`/api/admin/jobs/${encodeURIComponent(job.id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "The job could not be deleted.");
      }
      setLoading(true);
      setReload((current) => current + 1);
    } catch (deleteError) {
      setError(deleteError.message || "The job could not be deleted.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <main className="page">
      <div className="ph">
        <div>
          <h1>Jobs</h1>
          <p>Create, publish, and manage roles on the public Careers page.</p>
        </div>
        <Link className="btn" href="/admin/jobs/new">
          <AdminIcon name="plus" /> New job
        </Link>
      </div>
      {error ? <p className="err" role="alert">{error}</p> : null}
      <section className="card">
        <div className="tabs" role="tablist" aria-label="Filter jobs by status">
          {tabs.map(([value, label]) => (
            <button
              type="button"
              role="tab"
              id={`jobs-tab-${value}`}
              aria-controls="jobs-panel"
              aria-selected={tab === value}
              className={tab === value ? "on" : ""}
              key={value}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}
          <span className="hint" aria-live="polite">
            {visibleJobs.length} {visibleJobs.length === 1 ? "job" : "jobs"}
          </span>
        </div>
        <div
          className="tw"
          id="jobs-panel"
          role="tabpanel"
          aria-labelledby={`jobs-tab-${tab}`}
        >
          <table>
            <thead>
              <tr>
                <th>Job title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Posted</th>
                <th>Status</th>
                <th><span className="sr">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="empty">Loading jobs...</td></tr>
              ) : visibleJobs.length ? (
                visibleJobs.map((job) => {
                  const [label, badge] = statusBadge(job.status);
                  return (
                    <tr key={job.id}>
                      <td><div className="t1">{job.title}</div><div className="t2">{job.department}</div></td>
                      <td>{job.location}</td>
                      <td>{job.employmentType}</td>
                      <td>{displayDate(job.createdAt)}</td>
                      <td><span className={`bd ${badge}`}>{label}</span></td>
                      <td>
                        <div className="acts">
                          {job.status === "open" ? (
                            <Link
                              className="btn g sm"
                              href={`/careers/${encodeURIComponent(job.slug)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${job.title} on the website`}
                            >
                              View
                            </Link>
                          ) : null}
                          <Link
                            className="icb"
                            href={`/admin/jobs/${encodeURIComponent(job.id)}`}
                            aria-label={`Edit ${job.title}`}
                            title="Edit job"
                          >
                            <AdminIcon name="edit" />
                          </Link>
                          <button
                            className="icb"
                            type="button"
                            disabled={savingId === job.id}
                            aria-label={job.status === "open" ? `Unpublish ${job.title}` : `Publish ${job.title}`}
                            title={job.status === "open" ? "Unpublish job" : "Publish job"}
                            onClick={() => setPublished(job, job.status !== "open")}
                          >
                            <AdminIcon name={job.status === "open" ? "out" : "plus"} />
                          </button>
                          <button
                            className="icb"
                            type="button"
                            disabled={savingId === job.id}
                            aria-label={`Delete ${job.title}`}
                            title="Delete job"
                            onClick={() => remove(job)}
                          >
                            <AdminIcon name="trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="empty">
                    {jobs.length ? "No jobs match this filter." : "No jobs have been created yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
