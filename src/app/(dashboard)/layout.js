import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user?.role || "user").toLowerCase();

  // Standard users shouldn't access the dashboard layout
  if (role === "user") {
    redirect("/");
  }

  const navLinks = {
    agent: [
      { name: "Overview", path: "/agent" },
      { name: "My Properties", path: "/agent/properties" },
      { name: "Create Property", path: "/agent/properties/new" },
      { name: "Appointments", path: "/agent/appointments" },
    ],
    merchant: [
      { name: "Overview", path: "/merchant" },
      { name: "Manage Agents", path: "/merchant/agents" },
      { name: "All Properties", path: "/merchant/properties" },
      { name: "Manage Users", path: "/merchant/users" },
      { name: "All Appointments", path: "/merchant/appointments" },
    ],
  };

  const links = navLinks[role] || [];

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest hairline-r flex flex-col">
        <div className="p-6 hairline-b">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-primary uppercase">
            Rufi Space
          </Link>
          <div className="mt-2 font-label-caps text-label-caps text-on-surface-variant">
            {role.toUpperCase()} DASHBOARD
          </div>
        </div>
        <nav className="flex-1 p-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
        </nav>
        <div className="p-6 hairline-t">
          <Link href="/api/auth/signout" className="flex items-center gap-2 font-label-caps text-label-caps text-error hover:opacity-80 transition-opacity">
            <LogOut size={16} />
            SIGN OUT
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}