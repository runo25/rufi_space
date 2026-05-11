import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await auth();

  // If not logged in, redirect
  if (!session || !session.accessToken) {
    redirect("/login?callbackUrl=/wishlist");
  }

  let wishlistItems = [];
  let errorMsg = null;

  try {
    const res = await fetch(`http://property.reworkstaging.name.ng/v1/users/${session.user.id}/wishlist`, {
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
      errorMsg = `Failed to load wishlist (Status: ${res.status})`;
    } else {
      const data = await res.json();
      console.log("Raw Wishlist API Response:", JSON.stringify(data, null, 2));
      
      const extractedData = data.data || data;
      wishlistItems = Array.isArray(extractedData) ? extractedData : [];
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    errorMsg = "Network or Server Error occurred while fetching wishlist.";
  }

  // Handle various potential wrappers returned by the backend
  const getPropertyObj = (item) => {
    return item.property ? item.property : item;
  };

  return (
    <main className="max-w-container-max mx-auto px-margin py-section-gap min-h-screen">
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        YOUR WISHLIST
      </h1>

      {errorMsg ? (
        <div className="p-8 bg-error text-on-error font-body-lg text-body-lg hairline-all">
          <h2 className="font-headline-md mb-2">ERROR</h2>
          <p>{errorMsg}</p>
        </div>
      ) : wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {wishlistItems.map((item, idx) => {
            const propData = getPropertyObj(item);
            return <PropertyCard key={propData?.id || idx} property={propData} />;
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-on-surface-variant font-headline-md text-headline-md bg-surface-container-lowest hairline-all flex flex-col items-center gap-6">
          <p>NO ASSETS IN WISHLIST</p>
          <Link href="/properties" className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps hover:bg-tertiary-fixed hover:text-primary transition-colors block w-fit">
            BROWSE PROPERTIES
          </Link>
        </div>
      )}
    </main>
  );
}
