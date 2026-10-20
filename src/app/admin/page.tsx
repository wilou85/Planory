import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { readAdminSession } from "@/lib/admin-auth";

export default async function AdminPage() {
  const session = await readAdminSession(await cookies());
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDashboard initialEmail={session.email} />;
}
