"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { signOut, useSession } from "next-auth/react";

gsap.registerPlugin(useGSAP);

export default function Navigation() {
  const { data: session, status } = useSession();
  const navRef = useRef(null);

  useGSAP(() => {
    // Only animate when we know the final auth state to avoid animating twice
    if (status === "loading") return;
    
    // Stagger in the navigation items
    gsap.from(".nav-item", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.1,
      clearProps: "all" // Clears inline styles after animation so it doesn't get stuck
    });
  }, { scope: navRef, dependencies: [status] });

  return (
    <nav ref={navRef} className="bg-surface-container-lowest hairline-b sticky top-0 z-50 w-full flex justify-between items-center px-12 py-6 max-w-container-max mx-auto overflow-hidden">
      <div className="flex items-center gap-12">
        <Link href="/" className="nav-item font-display-xl text-headline-md leading-none tracking-tighter text-primary uppercase">
          Rufi Space
        </Link>
        <div className="hidden md:flex items-center gap-8 font-label-caps text-label-caps text-on-surface-variant">
          <Link href="/about" className="nav-item hover:text-primary transition-colors duration-300 uppercase">
            ABOUT
          </Link>
          <Link href="/properties" className="nav-item hover:text-primary transition-colors duration-300 uppercase">
            RESIDENCES
          </Link>
          <Link href="/wishlist" className="nav-item hover:text-primary transition-colors duration-300 uppercase">
            WISHLIST
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {status === "loading" ? (
          <div className="nav-item w-24 h-8 bg-surface-variant animate-pulse"></div>
        ) : session ? (
          <>
            <span className="nav-item font-label-caps text-label-caps text-on-surface">
              {session.user?.name || session.user?.email}
            </span>
            {session.user?.role?.toUpperCase() === "MERCHANT" && (
              <Link href="/merchant" className="nav-item font-label-caps text-label-caps text-primary hover:opacity-70 transition-opacity">
                DASHBOARD
              </Link>
            )}
            {session.user?.role?.toUpperCase() === "AGENT" && (
              <Link href="/agent" className="nav-item font-label-caps text-label-caps text-primary hover:opacity-70 transition-opacity">
                DASHBOARD
              </Link>
            )}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="nav-item bg-error-container text-on-error-container font-label-caps text-label-caps px-6 py-3 hover:opacity-80 transition-opacity uppercase"
            >
              SIGN OUT
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-item font-label-caps text-label-caps text-primary hover:opacity-70 transition-opacity">
              SIGN IN
            </Link>
            <Link href="/register" className="nav-item bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 hover:bg-tertiary-fixed hover:text-primary transition-colors uppercase">
              SIGN UP
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}