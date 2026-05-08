"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";

export default function MerchantPropertiesPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchMerchantProperties();
    }
  }, [session]);

  const fetchMerchantProperties = async () => {
    setLoading(true);
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;

    // Fetch both verified and unverified properties
    const [verifiedRes, unverifiedRes] = await Promise.all([
      apiClient(`properties?merchant=${merchantId}`, { session }),
      apiClient(`properties?merchant=${merchantId}&verified=false`, { session })
    ]);

    if (!verifiedRes.error || !unverifiedRes.error) {
      const combinedProps = [
        ...(verifiedRes.data?.data || []),
        ...(unverifiedRes.data?.data || [])
      ];
      setProperties(combinedProps);
    } else {
      if (verifiedRes.error !== "TOKEN_EXPIRED") setError(verifiedRes.error || unverifiedRes.error);
    }
    setLoading(false);
  };

  const handleVerifyProperty = async (propertyId, currentState) => {
    if (!confirm(`Are you sure you want to ${currentState ? 'unverify' : 'verify'} this property?`)) return;

    const { error, data } = await apiClient(`properties/${propertyId}/set-verified`, {
      method: "PUT",
      session,
      body: JSON.stringify({ is_verified: !currentState })
    });
    
    if (!error) {
      // Optimistically update the UI
      setProperties(properties.map(p => 
        p.id === propertyId ? { ...p, is_verified: !currentState } : p
      ));
    } else {
      alert(`Failed: ${error}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 hairline-b pb-4">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
          ALL PROPERTIES
        </h1>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-on-surface-variant font-label-caps animate-pulse">LOADING PROPERTIES...</div>
      ) : properties.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center hairline-all">
          <p className="font-body-lg text-on-surface-variant mb-6">No properties found in your system.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant uppercase hairline-b">
                <th className="p-4">Property</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id} className="hairline-b hover:bg-surface-container-lowest transition-colors font-body-md text-on-surface">
                  <td className="p-4">
                    <div className="font-bold">{property.name}</div>
                    <div className="text-xs text-on-surface-variant">{property.id.substring(0, 8)}...</div>
                  </td>
                  <td className="p-4">
                    <div className="font-label-caps text-xs">
                      {property.agent?.full_name || "Unknown Agent"}
                    </div>
                  </td>
                  <td className="p-4">
                    {property.city}, {property.state}
                  </td>
                  <td className="p-4">
                    ₦ {parseInt(property.price).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {property.is_verified ? (
                      <span className="text-green-600 font-label-caps text-xs">VERIFIED</span>
                    ) : (
                      <span className="text-orange-500 font-label-caps text-xs">PENDING</span>
                    )}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      className={`text-xs py-1 px-3 ${property.is_verified ? 'text-orange-500' : 'text-green-600'}`}
                      onClick={() => handleVerifyProperty(property.id, property.is_verified)}
                    >
                      {property.is_verified ? 'UNVERIFY' : 'VERIFY'}
                    </Button>
                    <Link href={`/properties/${property.id}`} target="_blank">
                      <Button variant="outline" className="text-xs py-1 px-3">VIEW</Button>
                    </Link>
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