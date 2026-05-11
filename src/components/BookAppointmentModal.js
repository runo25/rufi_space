"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function BookAppointmentModal({ propertyId, onClose }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    from: "10 AM",
    to: "12 PM",
    msg: ""
  });

  const timeSlots = [
    "08 AM", "09 AM", "10 AM", "11 AM", "12 PM", 
    "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM"
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session || !session.accessToken) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      property_id: propertyId,
      user_id: session.user.id,
      date: formData.date,
      msg: formData.msg,
      time: {
        from: formData.from,
        to: formData.to
      }
    };

    const { error: apiError } = await apiClient("appointments", {
      method: "POST",
      body: JSON.stringify(payload),
      session
    });

    setLoading(false);

    if (apiError) {
      setError(apiError);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-margin">
      <div className="bg-surface-container-lowest hairline-all w-full max-w-lg flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 hairline-b bg-surface-variant">
          <h2 className="font-headline-md text-headline-md text-primary uppercase">BOOK VIEWING</h2>
          <button 
            onClick={onClose}
            className="text-primary hover:text-error transition-colors font-headline-md leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {success ? (
            <div className="text-center py-8 flex flex-col gap-6">
              <div className="font-headline-lg text-primary text-4xl mb-4">SUCCESS</div>
              <p className="font-body-lg text-on-surface-variant">
                Your appointment request has been submitted to the agent.
              </p>
              <Button onClick={onClose} className="w-full mt-4">
                CLOSE WINDOW
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-[12px] text-on-surface-variant uppercase tracking-widest">
                    TIME (FROM)
                  </label>
                  <select 
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    className="bg-transparent hairline-b border-outline hover:border-primary focus:border-primary text-primary font-body-lg px-0 py-2 outline-none transition-colors w-full rounded-none"
                    required
                  >
                    {timeSlots.map(time => (
                      <option key={`from-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-[12px] text-on-surface-variant uppercase tracking-widest">
                    TIME (TO)
                  </label>
                  <select 
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    className="bg-transparent hairline-b border-outline hover:border-primary focus:border-primary text-primary font-body-lg px-0 py-2 outline-none transition-colors w-full rounded-none"
                    required
                  >
                    {timeSlots.map(time => (
                      <option key={`to-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-[12px] text-on-surface-variant uppercase tracking-widest">
                  MESSAGE
                </label>
                <textarea
                  name="msg"
                  value={formData.msg}
                  onChange={handleChange}
                  rows="4"
                  className="bg-transparent hairline-all border-outline hover:border-primary focus:border-primary text-primary font-body-lg p-4 outline-none transition-colors w-full resize-none rounded-none"
                  placeholder="I would love to inspect the site tomorrow if you don't mind."
                  required
                />
              </div>

              {error && (
                <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full mt-4">
                {loading ? "SUBMITTING..." : "CONFIRM BOOKING"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
