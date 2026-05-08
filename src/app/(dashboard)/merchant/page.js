import { auth } from "@/auth";

export default async function MerchantDashboard() {
  const session = await auth();

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        MERCHANT DASHBOARD
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Welcome to the admin panel, {session?.user?.name || session?.user?.email}. Manage all platform activity, agents, and properties here.
      </p>
    </div>
  );
}