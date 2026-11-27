import { redirect } from "next/navigation";
import AdminLogin from "../../../components/admin/AdminLogin";
import { getAdminSession } from "../../../lib/admin-auth.js";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  return <AdminLogin />;
}
