import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

type SearchParams = Promise<{ next?: string | string[] }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const raw = params.next;
  const nextPath = typeof raw === "string" && raw.startsWith("/admin") ? raw : "/admin";

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center gap-8">
      <div className="text-center">
        <p className="text-sm font-medium text-sky-400">Planory</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Admin</h1>
        <p className="mt-2 text-sm text-slate-400">Connexion au dashboard analytics</p>
      </div>
      <AdminLoginForm nextPath={nextPath} />
    </div>
  );
}
