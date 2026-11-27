"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminIcon from "./AdminIcons";
import { useAdminSearch } from "./AdminShell";

const statusDetails = [
  ["open", "Published", "ok"],
  ["draft", "Draft", "wa"],
  ["closed", "Closed", "mu"],
];

export default function DashboardPanel() {
  const search = useAdminSearch().trim().toLowerCase();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/jobs", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Jobs could not be loaded.");
        if (active) setJobs(result.jobs);
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
  }, []);

  const counts = Object.fromEntries(
    statusDetails.map(([status]) => [status, jobs.filter((job) => job.status === status).length]),
  );
  const maxCount = Math.max(1, ...Object.values(counts));
  const recentJobs = useMemo(
    () =>
      jobs
        .filter((job) =>
          `${job.title} ${job.location} ${job.department}`.toLowerCase().includes(search),
        )
        .slice(0, 5),
    [jobs, search],
  );

  return (
    <main className="page">
      <div className="ph">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your published opportunities and job drafts.</p>
        </div>
        <Link className="btn" href="/admin/jobs/new">
          <AdminIcon name="plus" /> New job
        </Link>
      </div>
      {error ? <p className="err" role="alert">{error}</p> : null}
      <section className="stats" aria-label="Job totals">
        {statusDetails.map(([status, label], index) => (
          <div className="card stat" key={status}>
            <span className="ic">
              <AdminIcon name={index === 0 ? "job" : index === 1 ? "doc" : "users"} />
            </span>
            <div>
              <b>{loading ? "—" : counts[status]}</b>
              <span>{label} jobs</span>
            </div>
          </div>
        ))}
        <div className="card stat">
          <span className="ic"><AdminIcon name="home" /></span>
          <div>
            <b>{loading ? "—" : jobs.length}</b>
            <span>Total jobs</span>
          </div>
        </div>
      </section>
      <div className="g2">
        <section className="card">
          <div className="ch"><h3>Job status</h3></div>
          <div className="cp">
            {loading ? <p className="empty">Loading jobs...</p> : jobs.length ? (
              <div className="bar" aria-label="Number of jobs by status">
                {statusDetails.map(([status, label]) => {
                  const height = Math.max(8, (counts[status] / maxCount) * 100);
                  return (
                    <div key={status}>
                      <b>{counts[status]}</b>
                      <i style={{ height: `${height}%` }} />
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="empty">Create a job to see status totals.</p>}
          </div>
        </section>
        <section className="card">
          <div className="ch"><h3>Quick actions</h3></div>
          <div className="ql">
            <Link href="/admin/jobs/new">
              <span className="ic"><AdminIcon name="plus" /></span>
              Create a job
            </Link>
            <Link href="/admin/jobs">
              <span className="ic"><AdminIcon name="job" /></span>
              Manage jobs
            </Link>
            <Link href="/careers" target="_blank" rel="noopener noreferrer">
              <span className="ic"><AdminIcon name="out" /></span>
              View Careers page
            </Link>
          </div>
        </section>
      </div>
      <section className="card">
        <div className="ch">
          <h3>Recent jobs</h3>
          <Link href="/admin/jobs" className="btn g sm">View all</Link>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr><th>Job title</th><th>Location</th><th>Type</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="empty">Loading jobs...</td></tr>
              ) : recentJobs.length ? (
                recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td><div className="t1">{job.title}</div><div className="t2">{job.department}</div></td>
                    <td>{job.location}</td>
                    <td>{job.employmentType}</td>
                    <td>
                      <span className={`bd ${job.status === "open" ? "ok" : job.status === "closed" ? "mu" : "wa"}`}>
                        {job.status === "open" ? "Published" : job.status === "closed" ? "Closed" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="empty">
                  {jobs.length ? "No jobs match your search." : "No jobs have been created yet."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
