"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { User } from "lucide-react";

export default function PropertyReviews({ propertyId, initialReviews = [] }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [newReviewText, setNewReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEligibleToReview = session?.user?.role?.toUpperCase() === "USER";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    setLoading(true);
    setError(null);

    const payload = {
      property_id: propertyId,
      user_id: session.user.id,
      text: newReviewText
    };

    const { error: apiError, data } = await apiClient("reviews", {
      method: "POST",
      body: JSON.stringify(payload),
      session
    });

    setLoading(false);

    if (apiError) {
      setError(apiError);
    } else {
      // Optimistically append the new review using the response data or our local payload
      const newReview = data?.data || data || { 
        id: Date.now(), 
        text: newReviewText, 
        user_id: session.user.id,
        user: { first_name: session.user.name || "You" }
      };
      
      setReviews(prev => [...prev, newReview]);
      setNewReviewText("");
    }
  };

  return (
    <div className="mt-16 pt-16 hairline-t border-primary">
      <h2 className="font-headline-md text-headline-md text-primary uppercase mb-8">PUBLIC REVIEWS</h2>

      <div className="flex flex-col gap-6 mb-12">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => {
            // Safely extract text and user details based on typical backend variations
            const reviewText = review.text || review.comment || "No content.";
            const userName = review.user?.first_name || review.user?.full_name || "Anonymous User";
            
            return (
              <div key={review.id || idx} className="bg-surface-container-lowest hairline-all p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-variant flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    {userName}
                  </span>
                </div>
                <p className="font-body-lg text-primary">{reviewText}</p>
              </div>
            );
          })
        ) : (
          <div className="bg-surface-variant p-8 hairline-all text-center">
            <p className="font-body-lg text-on-surface-variant uppercase tracking-widest">
              NO REVIEWS YET.
            </p>
          </div>
        )}
      </div>

      {/* Review Submission Area */}
      <div className="bg-surface-container-lowest hairline-all p-8">
        <h3 className="font-headline-sm text-primary uppercase mb-4">LEAVE A REVIEW</h3>
        
        {!session ? (
          <p className="font-body-md text-on-surface-variant mb-4">
            <Link href={`/login?callbackUrl=/properties/${propertyId}`} className="text-primary hover:opacity-70 underline uppercase font-label-caps">
              PLEASE SIGN IN
            </Link>{" "}
            TO LEAVE A REVIEW.
          </p>
        ) : !isEligibleToReview ? (
          <p className="font-body-md text-on-surface-variant italic">
            Only standard users can leave property reviews.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="What did you think of this property?"
              rows={4}
              required
              className="bg-transparent hairline-all border-outline hover:border-primary focus:border-primary text-primary font-body-lg p-4 outline-none transition-colors w-full resize-none rounded-none"
            />
            {error && (
              <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm">
                {error}
              </div>
            )}
            <Button type="submit" disabled={loading || !newReviewText.trim()} className="self-end w-full md:w-auto px-12">
              {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
