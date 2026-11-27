/* eslint-disable @next/next/no-page-custom-font -- App Router loads the shared font from the root layout. */
import "./globals.css";

export const metadata = {
  title: {
    default: "ORACREST Consulting | Oracle Fusion HCM Consulting & Digital Transformation",
    template: "%s | ORACREST Consulting",
  },
  description:
    "ORACREST Consulting delivers Oracle Fusion HCM consulting, implementation, optimization, all Oracle HCM modules, and training.",
  applicationName: "ORACREST Consulting",
};

const themeInitialization = `
try {
  var theme = localStorage.getItem("oc-theme");
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
} catch (error) {
  document.documentElement.setAttribute("data-theme", "dark");
}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0D1220" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitialization }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
