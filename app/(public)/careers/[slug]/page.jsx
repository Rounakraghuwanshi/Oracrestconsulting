import { notFound } from "next/navigation";
import ContactForm from "../../../../components/ContactForm";
import {
  Band,
  Cards,
  PageHero,
  Section,
} from "../../../../components/SiteSections";
import { findPublishedJobBySlug } from "../../../../lib/jobs.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getJob(slug) {
  if (typeof slug !== "string" || slug.length > 180) return null;
  return findPublishedJobBySlug(slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const job = await getJob(slug);
    return job
      ? {
          title: `${job.title} Careers`,
          description: `${job.title} job opportunity at ORACREST Consulting in ${job.location}.`,
        }
      : { title: "Job not found" };
  } catch (error) {
    console.error("Could not load job metadata.", error);
    return { title: "Careers" };
  }
}

export default async function CareerDetailPage({ params }) {
  const { slug } = await params;
  let job;
  try {
    job = await getJob(slug);
  } catch (error) {
    console.error("Could not load the public job detail page.", error);
    throw new Error("Job details are temporarily unavailable.", { cause: error });
  }
  if (!job) notFound();

  const description = job.description
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main id="app" className="pg">
      <PageHero
        title={job.title}
        description={[job.location, job.employmentType, job.experience]
          .filter(Boolean)
          .join(" · ")}
      />
      {description.length ? (
        <Section title="About the role">
          {description.map((paragraph, index) => <p className="lead" key={index}>{paragraph}</p>)}
        </Section>
      ) : null}
      <Section title="Role details" dark>
        <Cards
          items={[
            ["Location", job.location],
            ["Employment type", job.employmentType],
            ["Department", job.department],
            ...(job.experience ? [["Experience", job.experience]] : []),
          ]}
        />
      </Section>
      {job.skills.length ? (
        <Section title="Skills and expertise">
          <ul className="chips big">
            {job.skills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
        </Section>
      ) : null}
      <Band
        title="Interested in this opportunity?"
        description="Submit your application and our team will be in touch."
        href="#apply"
      >
        Apply Now
      </Band>
      <Section title="Apply for this role" id="apply">
        <ContactForm kind="application" jobSlug={job.slug} />
      </Section>
    </main>
  );
}
