import { notFound } from "next/navigation";
import Pages from "../../../components/Pages";
import { siteConfig } from "../../../lib/site-config";

const pages = ["about", "services", "contact"];

export function generateStaticParams() {
  return pages.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const titles = {
    about: "About ORACREST",
    services: "Oracle Fusion HCM Services",
    contact: "Contact ORACREST",
  };
  return { title: titles[slug] || "ORACREST Consulting" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!pages.includes(slug)) notFound();

  return (
    <main id="app" className="pg">
      <Pages page={slug} site={siteConfig} />
    </main>
  );
}
