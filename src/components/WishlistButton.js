"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export default function WishlistButton({ propertyId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAddToWishlist = async () => {
    if (!session || !session.accessToken) {
      router.push(`/login?callbackUrl=/properties/${propertyId}`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: apiError } = await apiClient("users/wishlist", {
      method: "POST",
      body: JSON.stringify({
        property_id: propertyId,
        user_id: session.user.id
      }),
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
    <div className="flex flex-col gap-2">
      <button
        onClick={handleAddToWishlist}
        disabled={loading || success}
        className="bg-transparent text-primary text-center font-label-caps text-label-caps p-4 hairline-all hover:bg-surface-variant transition-colors uppercase w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "ADDING..." : success ? "ADDED TO WISHLIST" : "ADD TO WISHLIST"}
      </button>
      {error && (
        <div className="bg-error text-on-error p-3 text-center font-label-caps text-[12px] uppercase hairline-all">
          Error: {error}
        </div>
      )}
    </div>
  );
}
