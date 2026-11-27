import Link from "next/link";

const icons = [
  <g key="layers">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </g>,
  <path key="chart" d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  <g key="people">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.4 3.4 0 0 1 0 6.4M18 14.4c2.2.7 3.5 2.6 3.5 5.6" />
  </g>,
  <path key="cloud" d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18H7Z" />,
  <g key="shield">
    <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </g>,
  <g key="book">
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
    <path d="M4 19a2 2 0 0 1 2-2h13" />
  </g>,
  <path key="settings" d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  <g key="target">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r=".8" />
  </g>,
];

export function ButtonLink({ children, href, outline = false }) {
  return (
    <Link className={`btn${outline ? " o" : ""}`} href={href}>
      {children}
    </Link>
  );
}

export function ActionLink({ children, href }) {
  return (
    <Link className="btn" href={href}>
      {children}
    </Link>
  );
}

export function PageHero({ title, description, children }) {
  return (
    <section className="hero s">
      <div className="w">
        <h1>{title}</h1>
        <p className="sub">{description}</p>
        {children}
      </div>
    </section>
  );
}

export function Section({ title, description, children, dark = false, id }) {
  return (
    <section className={`sec${dark ? " alt" : ""}`} id={id}>
      <div className="w">
        <h2 className="t">{title}</h2>
        {description ? <p className="lead">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function Cards({ items }) {
  return (
    <div className="grid">
      {items.map(([title, description], index) => (
        <div className="card" key={title}>
          <span className="ic">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {icons[index % icons.length]}
            </svg>
          </span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
}

export function NumberedCards({ items }) {
  return (
    <div className="grid">
      {items.map(([title, description], index) => (
        <div className="card" key={title}>
          <span className="n">{index + 1}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
}

export function CallToAction({ title, description, href, children, dark = false }) {
  return (
    <section className={`sec${dark ? " alt" : ""}`}>
      <div className="w">
        <div className="ctar">
          <div>
            <h2 className="t">{title}</h2>
            <p className="lead">{description}</p>
          </div>
          <div>
            <ActionLink href={href}>{children}</ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Band({ title, description, href, children }) {
  return (
    <section className="band">
      <div className="w">
        <h2 className="t">{title}</h2>
        <p className="lead">{description}</p>
        <ActionLink href={href}>{children}</ActionLink>
      </div>
    </section>
  );
}

export function SplitSection({ title, description, dark = false, children }) {
  return (
    <section className={`sec${dark ? " alt" : ""}`}>
      <div className="w split">
        <div>
          <h2 className="t">{title}</h2>
          <p className="lead">{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export function WhatPanel() {
  const items = [
    ["Consulting", "Functional guidance for Oracle Fusion HCM"],
    ["Implementation", "From requirements to go-live"],
    ["Optimization", "Improving existing HCM setups"],
    ["Training", "Practical, scenario-based learning"],
  ];

  return (
    <div className="what">
      <p className="wk">What we do</p>
      <div className="wg">
        {items.map(([title, description], index) => (
          <div className="wi" key={title}>
            <span className="n">{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <div className="wf">
        <b>Modules</b> Core HR, Compensation, Benefits, Talent, Learning,
        Performance, Goals &amp; Recruiting
      </div>
    </div>
  );
}

export function WhoPanel() {
  const items = [
    ["Technology", "Oracle Fusion HCM and cloud capabilities"],
    ["HR Processes", "Practical, well-designed HR operations"],
    ["Business Requirements", "Solutions shaped around real needs"],
  ];

  return (
    <div className="what">
      <p className="wk">We work at the intersection of</p>
      <ul className="wl">
        {items.map(([title, description]) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

