"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Using the proxy configured in next.config.mjs
      const res = await fetch("/api/proxy/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        let errorMsg = "Failed to register merchant. Please try again.";
        if (res.headers.get("content-type")?.includes("application/json")) {
          const errData = await res.json();
          errorMsg = errData.msg || errorMsg;
        }
        setError(errorMsg);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/merchant/login?registered=true");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-margin py-section-gap min-h-[70vh] flex flex-col justify-center">
      <div className="bg-surface-container-lowest hairline-all p-12 relative overflow-hidden">
        {/* Decorative brutalist accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-10 transform translate-x-8 -translate-y-8 rotate-45"></div>

        <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-2 text-center">MERCHANT SETUP</h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mb-12">
          Initialize a new Merchant Admin account.
        </p>

        {success ? (
          <div className="bg-primary/10 text-primary p-6 text-center font-body-lg">
            Merchant account created successfully. Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input 
              label="Full Name" 
              name="full_name"
              value={formData.full_name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. John Doe"
            />
            
            <Input 
              label="Email Address" 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="admin@domain.com"
            />
            
            <Input 
              label="Phone Number" 
              type="tel" 
              name="phone"
              value={formData.phone} 
              onChange={handleChange} 
              required 
              placeholder="+1234567890"
            />

            <Input 
              label="Password" 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
            />

            {error && (
              <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-6 bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary transition-colors" disabled={loading}>
              {loading ? "INITIALIZING..." : "CREATE MERCHANT"}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center font-body-md text-on-surface-variant">
          Already have a Merchant account?{" "}
          <Link href="/merchant/login" className="text-primary border-b border-primary hover:opacity-70">
            Sign in here
          </Link>
        </div>
      </div>
    </main>
  );
}