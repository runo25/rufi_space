"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        let errorMsg = "Failed to register. Please try again.";
        if (res.headers.get("content-type")?.includes("application/json")) {
          const errData = await res.json();
          errorMsg = errData.msg || errorMsg;
        }
        setError(errorMsg);
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-margin py-section-gap min-h-[70vh] flex flex-col justify-center">
      <div className="bg-surface-container-lowest hairline-all p-12">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-2 text-center">REGISTRY</h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mb-12">
          Apply for access to the platform.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="First Name" 
              name="first_name"
              value={formData.first_name} 
              onChange={handleChange} 
              required 
              placeholder="John"
            />
            <Input 
              label="Last Name" 
              name="last_name"
              value={formData.last_name} 
              onChange={handleChange} 
              required 
              placeholder="Doe"
            />
          </div>
          
          <Input 
            label="Email Address" 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="you@domain.com"
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

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "SUBMITTING..." : "APPLY"}
          </Button>
        </form>

        <div className="mt-8 text-center font-body-md text-on-surface-variant">
          Already registered?{" "}
          <Link href="/login" className="text-primary border-b border-primary hover:opacity-70">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}