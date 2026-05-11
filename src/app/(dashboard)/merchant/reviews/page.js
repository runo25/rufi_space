"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function MerchantReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchReviews();
    }
  }, [session]);

  const fetchReviews = async () => {
    setLoading(true);
    // Assuming backend supports fetching all reviews without property_id
    const { error, data } = await apiClient("reviews?page=0&limit=100", { session });
    
    if (error) {
      if (error !== "TOKEN_EXPIRED") setError(error);
    } else {
      const extractedData = data?.data || data || [];
      setReviews(Array.isArray(extractedData) ? extractedData : []);
    }
    setLoading(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    const { error } = await apiClient(`reviews/${reviewId}`, {
      method: "DELETE",
      session
    });
    
    if (!error) {
      setReviews(reviews.filter(r => r.id !== reviewId));
    } else {
      alert(`Failed to delete review: ${error}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 hairline-b pb-4">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
          ALL REVIEWS
        </h1>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-on-surface-variant font-label-caps animate-pulse">LOADING REVIEWS...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center hairline-all">
          <p className="font-body-lg text-on-surface-variant mb-6">No reviews found in the system.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant uppercase hairline-b">
                <th className="p-4">Property</th>
                <th className="p-4">User</th>
                <th className="p-4">Review</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} className="hairline-b hover:bg-surface-container-lowest transition-colors font-body-md text-on-surface">
                  <td className="p-4">
                    <div className="font-bold">{review.property?.name || "Unknown Property"}</div>
                    <Link href={`/properties/${review.property_id || review.property?.id}`} className="text-xs text-primary hover:underline">
                      View Property
                    </Link>
                  </td>
                  <td className="p-4">
                    {review.user?.full_name || review.user?.email || "Unknown User"}
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="truncate" title={review.text}>{review.text}</p>
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="outline" 
                      className="text-xs py-1 px-3 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      DELETE
                    </Button>
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