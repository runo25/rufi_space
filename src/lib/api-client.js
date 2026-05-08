import { signOut } from "next-auth/react";

const BASE_URL = "/api/proxy"; // Use our proxy route

export async function apiClient(path, options = {}) {
  const { session, ...fetchOptions } = options;
  
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const url = `${BASE_URL}/${path.startsWith("/") ? path.slice(1) : path}`;

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const contentType = res.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { text };
      }
    }

    // Handle token expiration (both status 419 and body code 419)
    if (res.status === 419 || (data && (data.code === 419 || data.type === "TOKEN_EXPIRED"))) {
      if (typeof window !== "undefined") {
        signOut({ callbackUrl: "/login", redirect: true });
      }
      return { error: "TOKEN_EXPIRED", data: null };
    }

    if (!res.ok) {
      return { error: data?.msg || "Request failed", data };
    }

    return { error: null, data };
  } catch (error) {
    console.error("API client error:", error);
    return { error: "Network error", data: null };
  }
}
