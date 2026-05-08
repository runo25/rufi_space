"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

function LoginForm() {
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
        router.push(callbackUrl || "/");
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
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="you@domain.com"
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

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? "AUTHENTICATING..." : "SIGN IN"}
        </Button>
      </form>

      <div className="mt-8 text-center font-body-md text-on-surface-variant">
        Not in the registry?{" "}
        <Link href="/register" className="text-primary border-b border-primary hover:opacity-70">
          Apply here
        </Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-margin py-section-gap min-h-[70vh] flex flex-col justify-center">
      <div className="bg-surface-container-lowest hairline-all p-12">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-2 text-center">ACCESS</h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mb-12">
          Enter your credentials to access your registry.
        </p>

        <Suspense fallback={<div className="text-center font-label-caps">Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}