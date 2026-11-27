import ContactForm from "./ContactForm";
import HomeIllustration from "./HomeIllustration";
import {
  Band,
  ButtonLink,
  CallToAction,
  Cards,
  NumberedCards,
  PageHero,
  Section,
  SplitSection,
  WhatPanel,
  WhoPanel,
} from "./SiteSections";
import { deliverySteps, modules, services } from "../lib/content";

function ModuleStrip() {
  return (
    <section className="stats">
      <div className="w">
        <div className="mstrip">
          <p>Modules we work on</p>
          <ul>
            {modules.map((module) => <li key={module}>{module}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ServicesCards() {
  return (
    <>
      <Cards items={services.map(({ title, description }) => [title, description])} />
      <p style={{ marginTop: 28 }}>
        <ButtonLink href="/services" outline>See all services</ButtonLink>
      </p>
    </>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="w">
          <div>
            <h1>
              Transform Your HR with <span className="hl">Oracle Fusion HCM</span>
            </h1>
            <p className="sub">
              ORACREST Consulting helps organizations simplify HR processes, optimize Oracle Fusion HCM, and drive digital transformation through practical consulting and technology expertise.
            </p>
            <div className="btns">
              <ButtonLink href="/services">Explore Our Services</ButtonLink>
              <ButtonLink href="/contact" outline>Talk to Us</ButtonLink>
            </div>
            <ul className="pills">
              <li>Oracle Fusion HCM</li>
              <li>All HCM Modules</li>
              <li>Implementation &amp; Support</li>
            </ul>
          </div>
          <HomeIllustration />
        </div>
      </section>
      <ModuleStrip />
      <SplitSection
        title="Oracle Fusion HCM Expertise That Drives Business Transformation"
        description="ORACREST Consulting is an Oracle-focused consulting company specializing in Oracle Fusion HCM solutions. We help organizations improve their HR processes through consulting, implementation, optimization, and training. Across all core modules, from Core HR to Compensation, Talent and Recruiting, we bring functional expertise and practical understanding to help organizations get greater value from Oracle Cloud HCM."
      >
        <WhatPanel />
      </SplitSection>
      <Section title="Why ORACREST?" dark>
        <Cards
          items={[
            ["Oracle Expertise", "Deep functional knowledge of Oracle Fusion HCM."],
            ["Business-Focused Solutions", "Solutions designed around real business processes and requirements."],
            ["Continuous Learning", "Stay aligned with Oracle’s evolving Cloud HCM capabilities."],
            ["Practical Consulting", "Focus on implementation, optimization, and real-world outcomes."],
          ]}
        />
      </Section>
      <Section title="Our Services">
        <ServicesCards />
      </Section>
      <Section
        title="Oracle Fusion HCM Insights"
        description="Stay informed about the latest Oracle Fusion HCM features, product updates, and practical insights from our team."
        dark
      >
        <div className="grid">
          {["Oracle Fusion Updates", "HCM Best Practices", "Compensation & Benefits Insights"].map((title) => (
            <div className="card" key={title}>
              <h3>{title}</h3>
              <span className="tag">Articles coming soon</span>
            </div>
          ))}
        </div>
      </Section>
      <Band
        title="Ready to Transform Your HCM Experience?"
        description="Let’s discuss how Oracle Fusion HCM can help your organization build smarter and more efficient HR processes."
        href="/contact"
      >
        Talk to ORACREST
      </Band>
    </>
  );
}

function AboutPage({ site }) {
  return (
    <>
      <PageHero title="About ORACREST" description="Oracle Expertise. Business Understanding. Practical Solutions." />
      <SplitSection
        title="Who We Are"
        description="ORACREST Consulting is an Oracle-focused consulting company dedicated to helping organizations unlock the value of Oracle Fusion HCM. We work at the intersection of technology, HR processes, and business requirements to help organizations implement, optimize, and continuously improve their HCM environment."
      >
        <WhoPanel />
      </SplitSection>
      <Section title="Mission and vision" dark>
        <Cards
          items={[
            ["Our Mission", "To help organizations simplify HR operations and achieve greater business value through Oracle Fusion HCM technology and practical consulting expertise."],
            ["Our Vision", "To become a trusted Oracle Fusion HCM consulting partner for organizations embracing modern, cloud-based HR transformation."],
          ]}
        />
      </Section>
      <Section title="What Makes Us Different?">
        <Cards
          items={[
            ["Full-Suite Expertise", "Hands-on across all Oracle Fusion HCM modules."],
            ["Business First", "Technology must solve real business problems."],
            ["Continuous Innovation", "Stay connected with Oracle’s evolving HCM capabilities."],
            ["Knowledge Sharing", "Encourage continuous learning and practical Oracle insights."],
          ]}
        />
      </Section>
      <Section title="Our Approach" dark>
        <NumberedCards
          items={[
            ["Understand", "Understand business requirements and existing processes."],
            ["Design", "Design the right Oracle HCM solution."],
            ["Implement", "Configure, test, and deploy the solution."],
            ["Optimize", "Continuously improve the solution as business needs evolve."],
          ]}
        />
      </Section>
      <Section title="Company information">
        <div className="grid">
          {[
            ["Founded", site.founded],
            ["Core Expertise", "Oracle Fusion HCM"],
            ["Modules Covered", "All Oracle HCM Modules"],
            ["Primary Location", site.location],
          ].map(([label, value]) => (
            <div className="card" key={label}>
              <p>{label}</p>
              <h3 style={{ margin: "6px 0 0" }}>{value}</h3>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <PageHero
        title="Oracle Fusion HCM Solutions"
        description="From implementation to optimization, we help organizations build effective and scalable Oracle Fusion HCM solutions."
      />
      <section className="sec">
        <div className="w">
          {services.map(({ title, description, items }) => (
            <div className="svc" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ul className="chips">
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Section
        title="How we deliver"
        description="A clear, collaborative path from the first workshop to go-live and beyond."
        dark
      >
        <ol className="steps">
          {deliverySteps.map(([title, description]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Band
        title="Have an Oracle HCM Challenge?"
        description="Let’s explore the right solution for your organization."
        href="/contact"
      >
        Talk to an Expert
      </Band>
    </>
  );
}

function CareersPage({ jobs = [], jobsError = "" }) {
  return (
    <>
      <PageHero
        title="Build Your Career with ORACREST"
        description="Join a team working at the intersection of Oracle Fusion HCM, cloud technology, and digital HR transformation."
      >
        <ButtonLink href="#jobs">View Open Positions</ButtonLink>
      </PageHero>
      <Section title="Why Join ORACREST?">
        <Cards
          items={[
            ["Learn & Grow", "Develop Oracle Fusion HCM knowledge through practical projects and continuous learning."],
            ["Work on Real Projects", "Gain exposure to real business requirements, implementations, and HCM solutions."],
            ["Build Expertise", "Strengthen expertise across Oracle HCM, Compensation & Benefits, Talent, Learning, and other HCM areas."],
            ["Collaborative Environment", "Work with experienced professionals in a collaborative and knowledge-sharing environment."],
          ]}
        />
      </Section>
      <Section
        title="A Culture of Learning & Innovation"
        description="We encourage curiosity, knowledge sharing, collaboration, and continuous improvement."
        dark
      >
        <Cards
          items={[
            ["Continuous Learning", "Keep building Oracle HCM knowledge."],
            ["Team Collaboration", "Share what we learn."],
            ["Oracle Innovation", "Follow Oracle’s evolving capabilities."],
            ["Professional Growth", "Grow your expertise project by project."],
          ]}
        />
      </Section>
      <Section title="Open Positions" id="jobs">
        {jobsError ? (
          <p className="note" role="status">{jobsError}</p>
        ) : jobs.length ? (
          <div className="grid">
            {jobs.map((job) => (
              <div className="card job" key={job.id}>
                <h3>{job.title}</h3>
                <p className="m">
                  {[job.location, job.employmentType].filter(Boolean).join(" · ")}
                </p>
                <p><b>Skills:</b> {job.skills.join(", ")}</p>
                <ButtonLink href={`/careers/${job.slug}`}>Apply Now</ButtonLink>
              </div>
            ))}
          </div>
        ) : (
          <p className="note">There are no open positions right now. Please check back soon.</p>
        )}
      </Section>
      <CallToAction
        title="Don’t See the Right Role?"
        description="We’re always interested in connecting with talented professionals who are passionate about Oracle Fusion HCM and HR technology."
        href="#apply"
        dark
      >
        Send Your Resume
      </CallToAction>
      <Section title="Career application" id="apply">
        <ContactForm kind="application" />
      </Section>
      <Band
        title="Ready to Grow With ORACREST?"
        description="Take the next step in your Oracle Fusion HCM career."
        href="#jobs"
      >
        Explore Opportunities
      </Band>
    </>
  );
}

function ContactPage({ site }) {
  return (
    <>
      <PageHero
        title="Let’s Build a Smarter HCM Future"
        description="Have an Oracle Fusion HCM requirement? Let’s discuss how ORACREST can help."
      />
      <section className="sec" id="enquiry">
        <div className="w two">
          <div><ContactForm kind="enquiry" /></div>
          <aside>
            <h2 style={{ fontSize: 24 }}>Contact information</h2>
            <dl>
              <dt>Email</dt>
              <dd><a href={`mailto:${site.email}`}>{site.email}</a></dd>
              <dt>Location</dt>
              <dd>{site.location}</dd>
            </dl>
          </aside>
        </div>
      </section>
      <Band
        title="Have an Oracle HCM Challenge?"
        description="Let’s explore the right solution for your organization."
        href="#enquiry"
      >
        Contact ORACREST
      </Band>
    </>
  );
}

export default function Pages({ page, site, jobs, jobsError }) {
  if (page === "home") return <HomePage />;
  if (page === "about") return <AboutPage site={site} />;
  if (page === "services") return <ServicesPage />;
  if (page === "careers") return <CareersPage jobs={jobs} jobsError={jobsError} />;
  return <ContactPage site={site} />;
}
