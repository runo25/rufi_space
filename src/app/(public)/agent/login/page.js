"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

function AgentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push(callbackUrl || "/agent");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input 
          label="Agent Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="agent@luxerealty.com"
        />
        <Input 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          placeholder="••••••••"
        />

        {error && (
          <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full mt-6 bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary transition-colors" disabled={loading}>
          {loading ? "AUTHENTICATING..." : "AGENT LOGIN"}
        </Button>
      </form>

      <div className="mt-8 text-center font-body-md text-on-surface-variant">
        No agent account yet?{" "}
        <Link href="/agent/register" className="text-primary border-b border-primary hover:opacity-70">
          Register as Agent
        </Link>
      </div>
    </>
  );
}

export default function AgentLoginPage() {
  return (
    <main className="max-w-md mx-auto px-margin py-section-gap min-h-[70vh] flex flex-col justify-center">
      <div className="bg-surface-container-lowest hairline-all p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-1 bg-tertiary-fixed"></div>
        
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-2 text-center">AGENT PORTAL</h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mb-12">
          Agent access only. Manage your listings and appointments.
        </p>

        <Suspense fallback={<div className="text-center font-label-caps">Loading form...</div>}>
          <AgentLoginForm />
        </Suspense>
      </div>
    </main>
  );
}