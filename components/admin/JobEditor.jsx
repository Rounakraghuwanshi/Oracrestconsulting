"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const initialJob = {
  title: "",
  location: "",
  employmentType: "Full Time",
  department: "Consulting",
  experience: "",
  skills: [],
  description: "",
  status: "draft",
  closingDate: "",
};

async function readResponse(response) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The job could not be saved.");
  return result;
}

export default function JobEditor({ jobId }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [job, setJob] = useState(initialJob);
  const [skillDraft, setSkillDraft] = useState("");
  const [loading, setLoading] = useState(Boolean(jobId));
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;
    let active = true;

    async function loadJob() {
      try {
        const result = await readResponse(
          await fetch(`/api/admin/jobs/${encodeURIComponent(jobId)}`, {
            cache: "no-store",
          }),
        );
        if (active) setJob(result.job);
      } catch (loadError) {
        if (active) setError(loadError.message || "Job details could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJob();
    return () => {
      active = false;
    };
  }, [jobId]);

  function update(field, value) {
    setJob((current) => ({ ...current, [field]: value }));
  }

  function addSkill(event) {
    event.preventDefault();
    const skill = skillDraft.trim();
    if (!skill) {
      setError("Enter a skill before adding it.");
      return;
    }
    if (job.skills.includes(skill)) {
      setError("That skill has already been added.");
      return;
    }
    if (job.skills.length >= 30) {
      setError("A job can have no more than 30 skills.");
      return;
    }
    setError("");
    update("skills", [...job.skills, skill]);
    setSkillDraft("");
  }

  async function save(status) {
    if (!formRef.current?.reportValidity()) return;
    setError("");
    setSaving(status);

    try {
      const response = await fetch(
        jobId ? `/api/admin/jobs/${encodeURIComponent(jobId)}` : "/api/admin/jobs",
        {
          method: jobId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...job, status }),
        },
      );
      await readResponse(response);
      router.push("/admin/jobs");
      router.refresh();
    } catch (saveError) {
      setError(saveError.message || "The job could not be saved.");
      setSaving("");
    }
  }

  if (loading) {
    return <main className="page"><p className="empty">Loading job details...</p></main>;
  }

  return (
    <main className="page">
      <div className="ph">
        <div>
          <h1>{jobId ? "Edit job" : "Create a job"}</h1>
          <p>Manage the role details shown on the public Careers page.</p>
        </div>
        <Link className="btn g" href="/admin/jobs">Back to jobs</Link>
      </div>

      {error ? <p className="err" role="alert">{error}</p> : null}
      <div className="split">
        <section className="card cp">
          <form
            ref={formRef}
            className="fg"
            onSubmit={(event) => {
              event.preventDefault();
              save(job.status);
            }}
          >
            <label className="full" htmlFor="job-title">
              Job title
              <input
                id="job-title"
                required
                maxLength={160}
                value={job.title}
                onChange={(event) => update("title", event.target.value)}
              />
            </label>
            <label htmlFor="job-location">
              Location
              <input
                id="job-location"
                required
                maxLength={160}
                value={job.location}
                onChange={(event) => update("location", event.target.value)}
              />
            </label>
            <label htmlFor="job-type">
              Employment type
              <select
                id="job-type"
                value={job.employmentType}
                onChange={(event) => update("employmentType", event.target.value)}
              >
                {["Full Time", "Part Time", "Contract", "Internship"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label htmlFor="job-department">
              Department
              <input
                id="job-department"
                maxLength={100}
                value={job.department}
                onChange={(event) => update("department", event.target.value)}
              />
            </label>
            <label htmlFor="job-experience">
              Experience
              <input
                id="job-experience"
                maxLength={120}
                placeholder="e.g. 3+ years"
                value={job.experience}
                onChange={(event) => update("experience", event.target.value)}
              />
            </label>
            <label className="full" htmlFor="job-skills">
              Skills
              <span className="hint">Add a skill and press Enter or select Add.</span>
              <span className="skill-entry">
                <input
                  id="job-skills"
                  maxLength={80}
                  value={skillDraft}
                  onChange={(event) => setSkillDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addSkill(event);
                  }}
                  aria-describedby="job-skill-help"
                />
                <button type="button" onClick={addSkill}>Add</button>
              </span>
              <span id="job-skill-help" className="sr">
                {job.skills.length} of 30 skills added.
              </span>
              {job.skills.length ? (
                <span className="tg">
                  {job.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                      <button
                        type="button"
                        aria-label={`Remove ${skill}`}
                        onClick={() => update("skills", job.skills.filter((item) => item !== skill))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </span>
              ) : null}
            </label>
            <label className="full" htmlFor="job-description">
              Description
              <textarea
                id="job-description"
                rows={7}
                maxLength={20000}
                value={job.description}
                onChange={(event) => update("description", event.target.value)}
              />
            </label>
            <label htmlFor="job-closing-date">
              Closing date
              <input
                id="job-closing-date"
                type="date"
                value={job.closingDate || ""}
                onChange={(event) => update("closingDate", event.target.value)}
              />
            </label>
            <label htmlFor="job-status">
              Status
              <select
                id="job-status"
                value={job.status}
                onChange={(event) => update("status", event.target.value)}
              >
                <option value="draft">Draft (unpublished)</option>
                <option value="open">Open (published)</option>
                {jobId ? <option value="closed">Closed (unpublished)</option> : null}
              </select>
            </label>
            <div className="full acts">
              <button
                className="btn g"
                type="button"
                disabled={Boolean(saving)}
                onClick={() => save("draft")}
              >
                {saving === "draft" ? "Saving..." : "Save as draft"}
              </button>
              <button
                className="btn"
                type="button"
                disabled={Boolean(saving)}
                onClick={() => save(jobId ? job.status : "open")}
              >
                {saving
                  ? "Saving..."
                  : jobId
                    ? "Save changes"
                    : "Publish job"}
              </button>
            </div>
          </form>
        </section>

        <aside className="card cp pv">
          <h3>Public preview</h3>
          <p className="m">
            {[job.location, job.employmentType, job.experience].filter(Boolean).join(" · ") || "Job location · Employment type"}
          </p>
          <p><b>Department:</b> {job.department || "Consulting"}</p>
          <p><b>Skills:</b> {job.skills.length ? job.skills.join(", ") : "Skills will appear here."}</p>
          {job.description ? <p>{job.description}</p> : null}
          <span className={`bd ${job.status === "open" ? "ok" : job.status === "closed" ? "mu" : "wa"}`}>
            {job.status === "open" ? "Published" : job.status === "closed" ? "Closed" : "Draft"}
          </span>
        </aside>
      </div>
    </main>
  );
}
