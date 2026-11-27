import Pages from "../../../components/Pages";
import { siteConfig } from "../../../lib/site-config";
import { listJobs } from "../../../lib/jobs.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = { title: "Careers" };

export default async function CareersPage() {
  let jobs = [];
  let jobsError = "";
  try {
    jobs = await listJobs({ publishedOnly: true });
  } catch (error) {
    console.error("Could not load the public Careers page.", error);
    jobsError = "Job listings are temporarily unavailable. Please try again later.";
  }

  return (
    <main id="app" className="pg">
      <Pages page="careers" site={siteConfig} jobs={jobs} jobsError={jobsError} />
    </main>
  );
}
