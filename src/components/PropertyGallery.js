"use client";

import { useState } from "react";
import Image from "next/image";

export default function PropertyGallery({ images, propertyName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row gap-gutter mb-16 h-auto md:h-[600px]">
      {/* Main Large Image */}
      <div className="flex-1 relative h-[400px] md:h-full bg-surface-variant hairline-all transition-opacity duration-300 ease-in-out">
        <Image
          src={images[activeIndex]}
          alt={`${propertyName} view`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails Sidebar */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-gutter h-28 md:h-full overflow-x-auto md:overflow-y-auto w-full md:w-40 shrink-0 hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-full md:h-1/4 min-w-[110px] md:min-w-0 w-full bg-surface-variant hairline-all cursor-pointer transition-all ${
                activeIndex === idx 
                  ? "opacity-100 ring-2 ring-primary ring-offset-2" 
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${propertyName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
