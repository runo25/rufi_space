"use client";

import Image from "next/image";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const container = useRef(null);

  // Mock data for Curated Selection
  const curatedProperties = [
    {
      id: "1",
      name: "The Glass House",
      city: "Beverly Hills",
      state: "CA",
      price: "18,500,000",
      type: "EXCLUSIVE",
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"]
    },
    {
      id: "2",
      name: "Monolith Estate",
      city: "Malibu",
      state: "CA",
      price: "24,000,000",
      type: "ESTATE",
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"]
    }
  ];

  useGSAP(() => {
    // 1. Hero Text Chaos (Breaking the Grid subtly on load)
    gsap.from(".hero-text-line", {
      y: 100,
      opacity: 0,
      rotateZ: () => gsap.utils.random(-15, 15), // Intentional chaos
      x: () => gsap.utils.random(-30, 30), // Breaking alignment
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
    });

    // Animate them back to strict grid alignment quickly but leave a tiny hint of offset
    gsap.to(".hero-text-line", {
      rotateZ: 0,
      x: 0,
      duration: 0.8,
      delay: 1,
      ease: "power2.out",
    });

    // 2. Hero Image Scale (Strict adherence feeling heavy)
    gsap.from(".hero-image-wrapper", {
      scale: 1.1,
      filter: "grayscale(100%) contrast(200%)",
      duration: 2,
      ease: "power3.inOut"
    });

    // 3. Structured Search Grid fade up
    gsap.from(".search-grid-item", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      delay: 1.5
    });

    // 4. Parallax Chaos Numerals (Breaking the Grid heavily on scroll)
    gsap.utils.toArray(".chaos-numeral").forEach((numeral, i) => {
      gsap.to(numeral, {
        y: () => gsap.utils.random(-150, -50),
        x: () => gsap.utils.random(-50, 50), // Drifting wildly into other columns
        rotateZ: () => gsap.utils.random(-25, 25),
        force3D: true, // Hardware acceleration
        scrollTrigger: {
          trigger: numeral,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Smooth scrub for that eerie drifting effect
        }
      });
    });

    // 5. Normal strict fade up for text
    gsap.utils.toArray(".fade-up").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        }
      });
    });

    // 6. Statistics Section strict stagger
    gsap.from(".stat-item", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      force3D: true,
      scrollTrigger: {
        trigger: ".stat-item",
        start: "top 80%",
      }
    });
  }, { scope: container });

  return (
    <main ref={container} className="max-w-container-max mx-auto px-margin overflow-hidden">
      {/* Hero Section */}
      <section className="py-section-gap grid grid-cols-12 gap-gutter items-end min-h-[819px]">
        <div className="col-span-12 md:col-span-8 z-10 relative">
          <h1 className="font-display-xl text-display-xl text-primary uppercase break-words mix-blend-difference relative z-20 -mb-5 flex flex-col will-change-transform">
            <span className="hero-text-line block origin-left">FIND</span>
            <span className="hero-text-line block origin-left">YOUR</span>
            <span className="hero-text-line block origin-left">SOUL</span>
          </h1>
        </div>
        <div className="col-span-12 md:col-span-10 md:col-start-3 relative -mt-32 md:mt-0 z-0">
          <div className="hero-image-wrapper aspect-[16/9] bg-surface-variant w-full relative overflow-hidden hairline-all grayscale will-change-transform">
            <Image
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80"
              alt="Stunning architectural brutalist mansion"
              fill
              className="object-cover absolute inset-0 object-center"
              priority
            />
          </div>
        </div>

        {/* Structured Search Grid */}
        <div className="col-span-12 mt-12 grid grid-cols-1 md:grid-cols-4 hairline-all bg-surface-container-lowest relative z-20">
          <div className="search-grid-item p-6 md:hairline-r hairline-b md:border-b-0 flex flex-col justify-center will-change-transform">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">LOCATION</label>
            <input className="bg-transparent border-none font-body-lg text-body-lg text-primary focus:ring-0 p-0 placeholder-outline-variant focus:outline-none" placeholder="Global" type="text" />
          </div>
          <div className="search-grid-item p-6 md:hairline-r hairline-b md:border-b-0 flex flex-col justify-center will-change-transform">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">PROPERTY TYPE</label>
            <select className="bg-transparent border-none font-body-lg text-body-lg text-primary focus:ring-0 p-0 appearance-none cursor-pointer focus:outline-none">
              <option>All Residences</option>
              <option>Estates</option>
              <option>Penthouses</option>
            </select>
          </div>
          <div className="search-grid-item p-6 md:hairline-r hairline-b md:border-b-0 flex flex-col justify-center will-change-transform">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">PRICE RANGE</label>
            <select className="bg-transparent border-none font-body-lg text-body-lg text-primary focus:ring-0 p-0 appearance-none cursor-pointer focus:outline-none">
              <option>Any Price</option>
              <option>$5M - $10M</option>
              <option>$10M+</option>
            </select>
          </div>
          <Link href="/properties" className="search-grid-item bg-primary text-on-primary font-label-caps text-label-caps p-6 hover:bg-tertiary-fixed hover:text-primary transition-colors flex items-center justify-center gap-2 uppercase will-change-transform">
            SEARCH <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Curated Selection */}
      <section className="py-section-gap hairline-t">
        <div className="flex justify-between items-end mb-16 fade-up will-change-transform">
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase w-1/2">CURATED SELECTION</h2>
          <Link href="/properties" className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:text-on-surface-variant transition-colors">
            VIEW ALL ESTATES
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {curatedProperties.map((prop, idx) => (
            <div key={prop.id} className="fade-up will-change-transform" style={{ transitionDelay: `${idx * 100}ms` }}>
              <PropertyCard property={prop} />
            </div>
          ))}
        </div>
      </section>

      {/* The Process */}
      <section className="py-section-gap hairline-t">
        <h2 className="fade-up font-headline-lg text-headline-lg text-primary uppercase mb-24 max-w-2xl will-change-transform">ACQUISITION PHILOSOPHY</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 hairline-t pt-12 relative">
          <div className="relative fade-up will-change-transform">
            <div className="chaos-numeral font-numeral-display text-[120px] leading-[100px] text-surface-variant absolute -top-16 -left-4 z-0 pointer-events-none select-none opacity-20 will-change-transform">01</div>
            <div className="relative z-10 pt-8 pl-4 border-l border-primary bg-surface/90">
              <h3 className="font-headline-md text-headline-md text-primary mb-4 uppercase">DISCOVERY</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">We align your structural desires with market realities. A purely analytical approach to uncovering architectural masterpieces.</p>
            </div>
          </div>
          <div className="relative fade-up will-change-transform" style={{ transitionDelay: '100ms' }}>
            <div className="chaos-numeral font-numeral-display text-[120px] leading-[100px] text-surface-variant absolute -top-16 -left-4 z-0 pointer-events-none select-none opacity-20 will-change-transform">02</div>
            <div className="relative z-10 pt-8 pl-4 border-l border-primary bg-surface/90">
              <h3 className="font-headline-md text-headline-md text-primary mb-4 uppercase">CURATION</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">A hyper-filtered selection process. We present only properties that meet uncompromising standards of design and prestige.</p>
            </div>
          </div>
          <div className="relative fade-up will-change-transform" style={{ transitionDelay: '200ms' }}>
            <div className="chaos-numeral font-numeral-display text-[120px] leading-[100px] text-surface-variant absolute -top-16 -left-4 z-0 pointer-events-none select-none opacity-20 will-change-transform">03</div>
            <div className="relative z-10 pt-8 pl-4 border-l border-primary bg-surface/90">
              <h3 className="font-headline-md text-headline-md text-primary mb-4 uppercase">EXECUTION</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Tactical negotiation and seamless acquisition. We manage the complexity so you focus entirely on the asset.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brutalist Statistics Section */}
      <section className="py-section-gap hairline-t">
        <div className="grid grid-cols-1 md:grid-cols-4 hairline-all bg-surface-container-lowest">
          <div className="stat-item p-12 md:hairline-r hairline-b md:border-b-0 flex flex-col justify-between min-h-[300px]">
            <span className="font-label-caps text-label-caps text-on-surface-variant">GLOBAL REACH</span>
            <span className="font-numeral-display text-[80px] leading-none text-primary mt-auto">12</span>
            <span className="font-body-md text-primary mt-2 uppercase">Continents & Territories</span>
          </div>
          <div className="stat-item p-12 md:hairline-r hairline-b md:border-b-0 flex flex-col justify-between min-h-[300px] bg-primary text-on-primary">
            <span className="font-label-caps text-label-caps text-on-primary/70">ACQUIRED VALUE</span>
            <span className="font-numeral-display text-[80px] leading-none mt-auto">$4B+</span>
            <span className="font-body-md mt-2 uppercase">In structured assets</span>
          </div>
          <div className="stat-item p-12 md:hairline-r hairline-b md:border-b-0 flex flex-col justify-between min-h-[300px]">
            <span className="font-label-caps text-label-caps text-on-surface-variant">EXCLUSIVE ESTATES</span>
            <span className="font-numeral-display text-[80px] leading-none text-primary mt-auto">240</span>
            <span className="font-body-md text-primary mt-2 uppercase">Verified Listings</span>
          </div>
          <div className="stat-item p-12 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
             <div className="absolute inset-0 grayscale opacity-30 mix-blend-multiply">
              <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" fill alt="Texture" className="object-cover" />
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant relative z-10">CLIENTELE</span>
            <span className="font-numeral-display text-[80px] leading-none text-primary mt-auto relative z-10">0.1%</span>
            <span className="font-body-md text-primary mt-2 uppercase relative z-10">The Elite</span>
          </div>
        </div>
      </section>
    </main>
  );
}