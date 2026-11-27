import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageEffects from "../../components/PageEffects";
import { siteConfig } from "../../lib/site-config";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <PageEffects />
      {children}
      <Footer site={siteConfig} />
    </>
  );
}
