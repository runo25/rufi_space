import { fetchPropertyById, fetchPropertyReviews } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Home, Bed, Bath, LayoutDashboard, CheckSquare } from "lucide-react";
import PropertyGallery from "@/components/PropertyGallery";
import WishlistButton from "@/components/WishlistButton";
import BookAppointmentTrigger from "@/components/BookAppointmentTrigger";
import PropertyReviews from "@/components/PropertyReviews";

export default async function PropertyDetailsPage({ params }) {
  const { id } = await params;
  const property = await fetchPropertyById(id);
  const initialReviews = await fetchPropertyReviews(id);

  if (!property) {
    notFound();
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"];

  return (
    <main className="max-w-container-max mx-auto px-margin py-section-gap">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-primary pb-8">
        <div>
          <div className="flex gap-4 items-center mb-4">
            {property.is_verified && (
              <span className="bg-tertiary-fixed text-primary px-3 py-1 font-label-caps text-label-caps hairline-all">
                VERIFIED
              </span>
            )}
            <span className="bg-surface-variant text-primary px-3 py-1 font-label-caps text-label-caps hairline-all">
              {property.type}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase">{property.name}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-2 mt-2 uppercase">
            <MapPin size={18} /> {property.address}, {property.city}, {property.state}
          </p>
        </div>
        <div className="mt-8 md:mt-0 text-left md:text-right">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{property.payment_plan}</p>
          <p className="font-numeral-display text-[64px] leading-[64px] tracking-tighter text-primary">
            ₦{property.price}
          </p>
        </div>
      </div>

      {/* Main Image Gallery */}
      <PropertyGallery images={images} propertyName={property.name} />

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="md:col-span-2">
          <h2 className="font-headline-md text-headline-md text-primary uppercase mb-8 hairline-b pb-4">
            ABOUT THIS ASSET
          </h2>
          <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed space-y-6">
            <p>{property.description}</p>
          </div>

          <h2 className="font-headline-md text-headline-md text-primary uppercase mt-16 mb-8 hairline-b pb-4">
            SPECIFICATIONS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center p-6 hairline-all bg-surface-container-lowest">
              <Bed className="text-primary mb-4" size={32} />
              <span className="font-numeral-display text-[32px] text-primary">{property.bedroom || 0}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-2">BEDROOMS</span>
            </div>
            <div className="flex flex-col items-center p-6 hairline-all bg-surface-container-lowest">
              <Bath className="text-primary mb-4" size={32} />
              <span className="font-numeral-display text-[32px] text-primary">{property.bathroom || 0}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-2">BATHROOMS</span>
            </div>
            <div className="flex flex-col items-center p-6 hairline-all bg-surface-container-lowest">
              <LayoutDashboard className="text-primary mb-4" size={32} />
              <span className="font-body-lg text-primary">{property.total_area || "N/A"}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-2">TOTAL AREA</span>
            </div>
            <div className="flex flex-col items-center p-6 hairline-all bg-surface-container-lowest">
              <Home className="text-primary mb-4" size={32} />
              <span className="font-body-lg text-primary uppercase">{property.furnishing || "N/A"}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-2">FURNISHING</span>
            </div>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <>
              <h2 className="font-headline-md text-headline-md text-primary uppercase mt-16 mb-8 hairline-b pb-4">
                AMENITIES
              </h2>
              <ul className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-body-lg text-body-lg text-primary">
                    <CheckSquare size={20} className="text-tertiary-container" /> {amenity}
                  </li>
                ))}
              </ul>
            </>
          )}

          {property.disclaimer && (
            <div className="mt-16 p-6 bg-surface-variant hairline-l border-primary text-on-surface-variant font-body-md text-body-md italic">
              {property.disclaimer}
            </div>
          )}

          {/* Reviews Section */}
          <PropertyReviews propertyId={property.id} initialReviews={initialReviews} />
        </div>

        {/* Sidebar / Action Area */}
        <div className="md:col-span-1">
          <div className="sticky top-32 bg-surface-container-lowest hairline-all p-8 flex flex-col gap-6">
            <h3 className="font-headline-md text-headline-md text-primary uppercase">ACQUIRE</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Interested in this {property.category?.toLowerCase() || "property"}? Book an appointment for a private viewing or proceed to acquisition.
            </p>
            <BookAppointmentTrigger propertyId={property.id} />
            <Link 
              href={`/login?callbackUrl=/properties/${property.id}&action=buy`}
              className="bg-transparent text-primary text-center font-label-caps text-label-caps p-4 hairline-all hover:bg-surface-variant transition-colors uppercase w-full block"
            >
              BUY DIRECT
            </Link>
            <WishlistButton propertyId={property.id} />
          </div>
        </div>
      </div>
    </main>
  );
}