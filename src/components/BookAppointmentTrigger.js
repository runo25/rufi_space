"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import BookAppointmentModal from "./BookAppointmentModal";

export default function BookAppointmentTrigger({ propertyId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If the URL has ?action=book and the user is logged in, pop open the modal automatically.
    if (searchParams.get("action") === "book" && session) {
      setIsModalOpen(true);
    }
  }, [searchParams, session]);

  const handleClick = () => {
    if (!session) {
      // Re-route to login with the action parameter attached so we can catch it after login
      router.push(`/login?callbackUrl=/properties/${propertyId}&action=book`);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="bg-primary text-on-primary text-center font-label-caps text-label-caps p-4 hover:bg-tertiary-fixed hover:text-primary transition-colors uppercase w-full block"
      >
        BOOK APPOINTMENT
      </button>

      {isModalOpen && (
        <BookAppointmentModal 
          propertyId={propertyId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
