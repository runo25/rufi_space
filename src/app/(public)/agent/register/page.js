"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function AgentRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
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
      // Agents must be created under a merchant — login as our merchant first
      const loginRes = await fetch("/api/proxy/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "merchant999@luxerealty.com", 
          password: "password123" 
        })
      });

      if (!loginRes.ok || !loginRes.headers.get("content-type")?.includes("application/json")) {
        setError("System authentication failed or returned invalid format.");
        setLoading(false);
        return;
      }

      const loginData = await loginRes.json();
      const merchantToken = loginData.data?.token;

      if (!merchantToken) {
        setError("System authentication failed. Contact admin.");
        setLoading(false);
        return;
      }

      // Create agent under our merchant
      const res = await fetch("/api/proxy/merchants/agents", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${merchantToken}`
        },
        body: JSON.stringify(formData)
      });

      let data = {};
      if (res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok || data.type !== "SUCCESS") {
        setError(data.msg || "Failed to register agent. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/agent/login?registered=true");
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
        <div className="absolute top-0 left-0 w-24 h-1 bg-tertiary-fixed"></div>

        <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-2 text-center">AGENT REGISTRATION</h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mb-12">
          Register as an agent to list properties on the platform.
        </p>

        {success ? (
          <div className="bg-primary/10 text-primary p-6 text-center font-body-lg">
            Agent account created successfully. Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input 
              label="Full Name" 
              name="full_name"
              value={formData.full_name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Lex Luthor"
            />

            <Input 
              label="Company" 
              name="company"
              value={formData.company} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Lexcorp Realty"
            />
            
            <Input 
              label="Email Address" 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="agent@domain.com"
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
              {loading ? "REGISTERING..." : "CREATE AGENT ACCOUNT"}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center font-body-md text-on-surface-variant">
          Already have an agent account?{" "}
          <Link href="/agent/login" className="text-primary border-b border-primary hover:opacity-70">
            Sign in here
          </Link>
        </div>
      </div>
    </main>
  );
}