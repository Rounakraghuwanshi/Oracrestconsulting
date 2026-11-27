import Pages from "../components/Pages";
import { siteConfig } from "../lib/site-config";

export default function Home() {
  return (
    <main id="app" className="pg">
      <Pages page="home" site={siteConfig} />
    </main>
  );
}
