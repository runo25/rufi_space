import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import { fetchProperties } from "@/lib/api"; // Reuse fetch properties to get some mock favorites

export default async function WishlistPage() {
  const session = await auth();

  // If not logged in, redirect
  if (!session) {
    redirect("/login");
  }

  // Ideally, you would fetch from a specific /users/wishlist API endpoint.
  // Since we don't have a specific wishlist API documented that returns full property cards,
  // we will fetch all properties and just slice the first 2 to simulate a wishlist.
  // Or handle empty states.
  const properties = await fetchProperties();
  const wishlistProperties = properties.slice(0, 2); // Simulating favorites

  return (
    <main className="max-w-container-max mx-auto px-margin py-section-gap min-h-screen">
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        MY WISHLIST
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
        Properties you have saved for future acquisition.
      </p>

      {wishlistProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {wishlistProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-on-surface-variant font-body-lg text-body-lg bg-surface-container-lowest hairline-all">
          Your wishlist is currently empty.
        </div>
      )}
    </main>
  );
}