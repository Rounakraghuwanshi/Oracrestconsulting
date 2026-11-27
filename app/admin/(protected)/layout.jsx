import { redirect } from "next/navigation";
import AdminShell from "../../../components/admin/AdminShell";
import { getAdminSession } from "../../../lib/admin-auth.js";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
