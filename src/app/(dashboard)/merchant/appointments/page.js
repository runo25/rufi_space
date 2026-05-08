"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export default function MerchantAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    setLoading(true);
    const { error, data } = await apiClient("appointments?page=0&limit=100", { session });
    
    if (error) {
      if (error !== "TOKEN_EXPIRED") setError(error);
    } else {
      setAppointments(data.data || []);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 hairline-b pb-4">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
          ALL APPOINTMENTS
        </h1>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-on-surface-variant font-label-caps animate-pulse">LOADING APPOINTMENTS...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center hairline-all">
          <p className="font-body-lg text-on-surface-variant mb-6">There are no appointments scheduled in the system.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant uppercase hairline-b">
                <th className="p-4">Date & Time</th>
                <th className="p-4">Property</th>
                <th className="p-4">Agent</th>
                <th className="p-4">User</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id} className="hairline-b hover:bg-surface-container-lowest transition-colors font-body-md text-on-surface">
                  <td className="p-4">
                    {new Date(appointment.date).toLocaleDateString()} {appointment.time}
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{appointment.property?.name || "Unknown Property"}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{appointment.agent?.full_name || "Unknown Agent"}</div>
                  </td>
                  <td className="p-4">
                    {appointment.user?.full_name || appointment.user?.email || "Unknown User"}
                  </td>
                  <td className="p-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 text-xs font-label-caps rounded-sm">
                      {appointment.status || "PENDING"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}