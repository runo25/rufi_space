import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default async function MerchantDashboard() {
  const session = await auth();

  // If not logged in, redirect
  if (!session || !session.accessToken) {
    redirect("/login?callbackUrl=/merchant");
  }

  let wishlistItems = [];
  let agents = [];
  let wishlistError = null;
  let agentsError = null;

  // Fetch Merchant Wishlist (global wishlist tracker)
  try {
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
    const wishlistRes = await fetch(`http://property.reworkstaging.name.ng/v1/merchants/${merchantId}/wishlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: "no-store"
    });

    if (wishlistRes.status === 404) {
      // 404 means no wishlists yet, which is normal
      wishlistItems = [];
    } else if (!wishlistRes.ok) {
      const errorText = await wishlistRes.text();
      console.error("Merchant Wishlist Error:", wishlistRes.status, errorText);
      wishlistError = `Failed to load wishlist (Status: ${wishlistRes.status})`;
    } else {
      const data = await wishlistRes.json();
      const extractedData = data.data || data;
      wishlistItems = Array.isArray(extractedData) ? extractedData : [];
    }
  } catch (err) {
    console.error("Merchant Wishlist Fetch Error:", err);
    wishlistError = "Network error occurred while fetching wishlist.";
  }

  // Fetch Merchant Agents
  try {
    const agentsRes = await fetch(`http://property.reworkstaging.name.ng/v1/merchants/agents?limit=50&offset=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: "no-store"
    });

    if (agentsRes.status === 404) {
      // 404 means no agents yet
      agents = [];
    } else if (!agentsRes.ok) {
      const errorText = await agentsRes.text();
      console.error("Merchant Agents Error:", agentsRes.status, errorText);
      agentsError = `Failed to load agents (Status: ${agentsRes.status})`;
    } else {
      const data = await agentsRes.json();
      const extractedData = data.data || data;
      agents = Array.isArray(extractedData) ? extractedData : [];
    }
  } catch (err) {
    console.error("Merchant Agents Fetch Error:", err);
    agentsError = "Network error occurred while fetching agents.";
  }

  // Handle property object extraction for wishlist
  const getPropertyObj = (item) => {
    return item.property ? item.property : item;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        MERCHANT COMMAND CENTER
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section A: Global Wishlist Tracker */}
        <div className="bg-surface-container-lowest p-6 hairline-all">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 hairline-b pb-2">
            GLOBAL WISHLIST TRACKER
          </h2>

          {wishlistError && (
            <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-4">
              {wishlistError}
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 text-center hairline-all">
              <p className="font-body-lg text-on-surface-variant mb-4">NO PROPERTIES WISHLISTED YET</p>
              <p className="font-body-md text-on-surface-variant/70">
                When users add properties to their wishlist, they'll appear here for tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {wishlistItems.map((item, idx) => {
                const propData = getPropertyObj(item);
                return (
                  <div key={propData?.id || idx} className="bg-surface-container p-4 hairline-all">
                    <div className="font-bold text-on-surface">{propData?.name || "Unknown Property"}</div>
                    <div className="text-sm text-on-surface-variant mt-1">
                      {propData?.city}, {propData?.state}
                    </div>
                    <div className="text-sm text-primary mt-2">
                      ₦ {propData?.price ? parseInt(propData.price).toLocaleString() : "N/A"}
                    </div>
                    <div className="text-xs text-on-surface-variant/70 mt-1">
                      Agent: {propData?.agent?.full_name || "Unknown"}
                    </div>
                    <Link
                      href={`/properties/${propData?.id}`}
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      View Property →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section B: Agent Roster */}
        <div className="bg-surface-container-lowest p-6 hairline-all">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 hairline-b pb-2">
            AGENT ROSTER
          </h2>

          {agentsError && (
            <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-4">
              {agentsError}
            </div>
          )}

          {agents.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 text-center hairline-all">
              <p className="font-body-lg text-on-surface-variant mb-4">NO AGENTS REGISTERED</p>
              <p className="font-body-md text-on-surface-variant/70">
                No agents have been verified under this merchant yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-surface-container p-4 hairline-all">
                <div className="font-bold text-on-surface text-lg">
                  {agents.length} Agent{agents.length !== 1 ? 's' : ''} Total
                </div>
                <div className="text-sm text-on-surface-variant mt-1">
                  {agents.filter(a => a.is_verified).length} Verified • {agents.filter(a => !a.is_verified).length} Pending
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {agents.slice(0, 20).map((agent) => (
                  <div key={agent.id} className="bg-surface-container p-3 hairline-all">
                    <div className="font-bold text-on-surface text-sm">
                      {agent.first_name} {agent.last_name}
                    </div>
                    <div className="text-xs text-on-surface-variant mt-1">
                      {agent.email}
                    </div>
                    <div className="text-xs text-on-surface-variant/70 mt-1 uppercase">
                      Status: {agent.is_verified ? (
                        <span className="text-green-600">VERIFIED</span>
                      ) : (
                        <span className="text-orange-500">PENDING</span>
                      )}
                    </div>
                  </div>
                ))}
                {agents.length > 20 && (
                  <div className="text-center mt-4">
                    <Link href="/merchant/agents" className="text-primary hover:underline text-sm">
                      View all {agents.length} agents →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}