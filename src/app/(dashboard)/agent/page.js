import { auth } from "@/auth";

export default async function AgentDashboard() {
  const session = await auth();

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        AGENT DASHBOARD
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Welcome back, {session?.user?.name || session?.user?.email}. Manage your properties and appointments here.
      </p>
    </div>
  );
}