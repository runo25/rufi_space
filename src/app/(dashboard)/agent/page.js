import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default async function AgentDashboard() {
  const session = await auth();

  // If not logged in, redirect
  if (!session || !session.accessToken) {
    redirect("/login?callbackUrl=/agent");
  }

  let wishlistItems = [];
  let appointments = [];
  let wishlistError = null;
  let appointmentsError = null;

  // Fetch Agent Wishlist (properties that users have wishlisted)
  try {
    const wishlistRes = await fetch(`http://property.reworkstaging.name.ng/v1/agents/${session.user.id}/wishlist`, {
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
      console.error("Agent Wishlist Error:", wishlistRes.status, errorText);
      wishlistError = `Failed to load wishlist (Status: ${wishlistRes.status})`;
    } else {
      const data = await wishlistRes.json();
      const extractedData = data.data || data;
      wishlistItems = Array.isArray(extractedData) ? extractedData : [];
    }
  } catch (err) {
    console.error("Agent Wishlist Fetch Error:", err);
    wishlistError = "Network error occurred while fetching wishlist.";
  }

  // Fetch Agent Appointments
  try {
    const appointmentsRes = await fetch(`http://property.reworkstaging.name.ng/v1/appointments?agent=${session.user.id}&page=0&limit=50`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: "no-store"
    });

    if (appointmentsRes.status === 404) {
      // 404 means no appointments yet
      appointments = [];
    } else if (!appointmentsRes.ok) {
      const errorText = await appointmentsRes.text();
      console.error("Agent Appointments Error:", appointmentsRes.status, errorText);
      appointmentsError = `Failed to load appointments (Status: ${appointmentsRes.status})`;
    } else {
      const data = await appointmentsRes.json();
      const extractedData = data.data || data;
      appointments = Array.isArray(extractedData) ? extractedData : [];
    }
  } catch (err) {
    console.error("Agent Appointments Fetch Error:", err);
    appointmentsError = "Network error occurred while fetching appointments.";
  }

  // Handle property object extraction for wishlist
  const getPropertyObj = (item) => {
    return item.property ? item.property : item;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        AGENT TERMINAL
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section A: Wishlist Tracker */}
        <div className="bg-surface-container-lowest p-6 hairline-all">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 hairline-b pb-2">
            WISHLIST TRACKER
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
                When users add your properties to their wishlist, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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

        {/* Section B: Appointments */}
        <div className="bg-surface-container-lowest p-6 hairline-all">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 hairline-b pb-2">
            UPCOMING APPOINTMENTS
          </h2>

          {appointmentsError && (
            <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-4">
              {appointmentsError}
            </div>
          )}

          {appointments.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 text-center hairline-all">
              <p className="font-body-lg text-on-surface-variant mb-4">NO APPOINTMENTS SCHEDULED</p>
              <p className="font-body-md text-on-surface-variant/70">
                When users book appointments for your properties, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 10).map((appointment) => (
                <div key={appointment.id} className="bg-surface-container p-4 hairline-all">
                  <div className="font-bold text-on-surface">
                    {appointment.property?.name || "Unknown Property"}
                  </div>
                  <div className="text-sm text-on-surface-variant mt-1">
                    {new Date(appointment.date).toLocaleDateString()} {appointment.time?.from} - {appointment.time?.to}
                  </div>
                  <div className="text-sm text-primary mt-2">
                    {appointment.user?.full_name || appointment.user?.email || "Unknown User"}
                  </div>
                  <div className="text-xs text-on-surface-variant/70 mt-1 uppercase">
                    Status: {appointment.status || "PENDING"}
                  </div>
                </div>
              ))}
              {appointments.length > 10 && (
                <div className="text-center mt-4">
                  <Link href="/agent/appointments" className="text-primary hover:underline text-sm">
                    View all {appointments.length} appointments →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}