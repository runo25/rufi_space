"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PropertyCard from "@/components/PropertyCard";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function MerchantWishlistPage() {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist();
    }
  }, [session]);

  const fetchWishlist = async () => {
    setLoading(true);
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
    const { error, data } = await apiClient(`merchants/${merchantId}/wishlist`, { session });
    
    if (error) {
      if (error !== "TOKEN_EXPIRED") setError(error);
    } else {
      const extractedData = data?.data || data || [];
      setWishlistItems(Array.isArray(extractedData) ? extractedData : []);
    }
    setLoading(false);
  };

  const getPropertyObj = (item) => {
    return item.property ? item.property : item;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 hairline-b pb-4">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
          MERCHANT WISHLIST
        </h1>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-on-surface-variant font-label-caps animate-pulse">LOADING WISHLIST...</div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center hairline-all">
          <p className="font-body-lg text-on-surface-variant mb-6">Your merchant wishlist is empty.</p>
          <Link href="/properties">
            <Button className="bg-primary text-on-primary hover:bg-tertiary-fixed hover:text-primary transition-colors">
              BROWSE PROPERTIES
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {wishlistItems.map((item, idx) => {
            const propData = getPropertyObj(item);
            return <PropertyCard key={propData?.id || idx} property={propData} />;
          })}
        </div>
      )}
    </div>
  );
}