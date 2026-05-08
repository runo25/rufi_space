"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function PropertyCard({ property }) {
  const cardRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const onMouseEnter = contextSafe(() => {
    // Intentional Chaos: Image container shifts hard, breaking the strict grid
    gsap.to(imageContainerRef.current, {
      x: 8,
      y: -8,
      boxShadow: "-8px 8px 0px 0px rgba(0,0,0,1)", // Assuming primary color is black
      duration: 0.3,
      ease: "power2.out",
      force3D: true,
    });
    
    // Scale image slightly inside
    gsap.to(imageRef.current, {
      scale: 1.05,
      filter: "grayscale(0%)", // Color comes alive on hover
      duration: 0.5,
      force3D: true,
    });

    gsap.to(infoRef.current, {
      x: 4,
      duration: 0.3,
      ease: "power2.out",
      force3D: true,
    });
  });

  const onMouseLeave = contextSafe(() => {
    // Restore strict alignment
    gsap.to(imageContainerRef.current, {
      x: 0,
      y: 0,
      boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
      duration: 0.3,
      ease: "power2.out",
      force3D: true,
    });
    
    gsap.to(imageRef.current, {
      scale: 1,
      filter: "grayscale(100%)",
      duration: 0.5,
      force3D: true,
    });

    gsap.to(infoRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
      force3D: true,
    });
  });

  // Use property.images[0] or a placeholder if none
  const imageSrc = property?.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
  
  return (
    <Link 
      href={`/properties/${property.id}`} 
      className="relative cursor-pointer block mt-12 md:mt-24"
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <article>
        <div 
          ref={imageContainerRef}
          className="aspect-[4/5] bg-surface-variant hairline-all overflow-hidden relative mb-6 transition-none"
        >
          <Image
            ref={imageRef}
            src={imageSrc}
            alt={property.name || "Property Image"}
            fill
            className="w-full h-full object-cover grayscale transition-none"
          />
          {property.type && (
            <div className="absolute top-4 left-4 bg-surface-container-lowest hairline-all px-3 py-1 font-label-caps text-label-caps text-primary z-10">
              {property.type}
            </div>
          )}
          {property.is_verified && (
            <div className="absolute top-4 right-4 bg-tertiary-fixed text-primary px-3 py-1 font-label-caps text-label-caps z-10 hairline-all">
              VERIFIED
            </div>
          )}
        </div>
        <div ref={infoRef} className="flex justify-between items-start">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-2 uppercase">{property.name}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant uppercase">
              {property.city}, {property.state}
            </p>
          </div>
          <p className="font-numeral-display text-numeral-display text-primary">
            ₦{property.price}
          </p>
        </div>
      </article>
    </Link>
  );
}