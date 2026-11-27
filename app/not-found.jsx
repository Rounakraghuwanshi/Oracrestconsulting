import Link from "next/link";

export default function NotFound() {
  return (
    <main id="app" className="pg">
      <section className="hero s">
        <div className="w">
          <h1>Page not found</h1>
          <p className="sub">The page you’re looking for is unavailable.</p>
          <Link className="btn" href="/">Return Home</Link>
        </div>
      </section>
    </main>
  );
}
