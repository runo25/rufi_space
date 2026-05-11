import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Clock, MessageSquare, Tag } from "lucide-react";

export default async function AppointmentsPage() {
  const session = await auth();

  if (!session || !session.accessToken) {
    redirect("/login?callbackUrl=/appointments");
  }

  let appointments = [];
  let errorMsg = null;

  try {
    // Server-side fetch requiring precise headers.
    const res = await fetch(`http://property.reworkstaging.name.ng/v1/appointments?user=${session.user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: "no-store"
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend Error:", res.status, errorText);
      errorMsg = `Failed to load appointments (Status: ${res.status})`;
    } else {
      const data = await res.json();
      console.log("Raw Appointments API Response:", JSON.stringify(data, null, 2));
      
      const extractedData = data.data || data;
      appointments = Array.isArray(extractedData) ? extractedData : [];
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    errorMsg = "Network or Server Error occurred while fetching appointments.";
  }

  return (
    <main className="max-w-container-max mx-auto px-margin py-section-gap min-h-screen">
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        MY APPOINTMENTS
      </h1>

      {errorMsg ? (
        <div className="p-8 bg-error text-on-error font-body-lg text-body-lg hairline-all">
          <h2 className="font-headline-md mb-2">ERROR</h2>
          <p>{errorMsg}</p>
        </div>
      ) : appointments.length > 0 ? (
        <div className="flex flex-col gap-8">
          {appointments.map((appointment) => {
            // Safely extract property if it's nested
            const prop = appointment.property || {};
            
            // Derive Status safely based on backend flags
            // Standard flags: is_completed, is_confirmed (agent confirmed), or pending
            let status = "PENDING";
            let statusColor = "bg-surface-variant text-on-surface-variant";
            
            if (appointment.is_completed) {
              status = "COMPLETED";
              statusColor = "bg-primary text-on-primary";
            } else if (appointment.is_confirmed) {
              status = "CONFIRMED";
              statusColor = "bg-tertiary-fixed text-primary";
            }

            return (
              <div key={appointment.id} className="hairline-all bg-surface-container-lowest flex flex-col md:flex-row">
                {/* Visual Block for Status & Date */}
                <div className="bg-surface-variant p-6 flex flex-col justify-center items-center md:w-48 hairline-b md:hairline-b-0 md:hairline-r">
                  <div className={`px-3 py-1 font-label-caps text-[10px] tracking-widest uppercase hairline-all mb-4 ${statusColor}`}>
                    {status}
                  </div>
                  <div className="font-headline-md text-primary text-center">
                    {appointment.date}
                  </div>
                </div>

                {/* Details Block */}
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="font-headline-md text-primary uppercase mb-1">
                      {prop.name || "Unknown Property"}
                    </h3>
                    <p className="font-body-sm text-on-surface-variant flex items-center gap-2 uppercase">
                      <MapPin size={14} /> {prop.city ? `${prop.city}, ${prop.state}` : "Location Unavailable"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-primary mt-1" />
                      <div>
                        <span className="block font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
                          TIME SLOT
                        </span>
                        <span className="font-body-md text-primary">
                          {appointment.time?.from} - {appointment.time?.to}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare size={18} className="text-primary mt-1" />
                      <div>
                        <span className="block font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
                          MESSAGE
                        </span>
                        <span className="font-body-md text-primary line-clamp-2">
                          {appointment.msg || "No message provided."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Block - Link to Property */}
                <div className="p-6 md:w-48 flex items-center justify-center hairline-t md:hairline-t-0 md:hairline-l">
                   <Link 
                     href={prop.id ? `/properties/${prop.id}` : "#"} 
                     className="text-primary font-label-caps text-[12px] hover:opacity-70 tracking-widest uppercase text-center w-full block"
                   >
                     VIEW PROPERTY &rarr;
                   </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-on-surface-variant font-headline-md text-headline-md bg-surface-container-lowest hairline-all flex flex-col items-center gap-6">
          <p>NO APPOINTMENTS BOOKED</p>
          <Link href="/properties" className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps hover:bg-tertiary-fixed hover:text-primary transition-colors block w-fit">
            BROWSE PROPERTIES
          </Link>
        </div>
      )}
    </main>
  );
}
