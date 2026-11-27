import Image from "next/image";
import Link from "next/link";

export default function Footer({ site }) {
  return (
    <footer>
      <div className="w c" id="foot">
        <div className="fg">
          <div className="fb">
            <span className="fl">
              <Image
                src="/oracrest-logo.svg"
                alt="ORACREST Consulting"
                width={545}
                height={108}
              />
            </span>
            <p>Oracle Fusion HCM Consulting &amp; Digital Transformation</p>
            <Link className="btn" href="/contact">
              Talk to an Expert
            </Link>
          </div>
          <div>
            <b>Company</b>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
          <div>
            <b>Services</b>
            <Link href="/services">Oracle Fusion HCM Consulting</Link>
            <Link href="/services">Compensation &amp; Benefits</Link>
            <Link href="/services">HCM Implementation</Link>
            <Link href="/services">HCM Training</Link>
          </div>
          <div>
            <b>Contact</b>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>{site.location}</span>
            {site.linkedin ? (
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
        <div className="fbot">
          © {new Date().getFullYear()} ORACREST Consulting. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
