import { signOut } from "next-auth/react";

const BASE_URL = "/api/proxy"; // Use our proxy route

export async function apiClient(path, options = {}) {
  const { session, ...fetchOptions } = options;
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  // Automatically inject merchant ID if it's a GET request and missing from the path
  let finalPath = path;
  const method = fetchOptions.method || "GET"; // Default fetch method is GET
  if (method === "GET" && merchantId && !path.includes("merchant=")) {
    const separator = path.includes("?") ? "&" : "?";
    finalPath = `${path}${separator}merchant=${merchantId}`;
  }

  const url = `${BASE_URL}/${finalPath.startsWith("/") ? finalPath.slice(1) : finalPath}`;

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
      if (res.status === 404) {
        return { error: null, data: { data: [] } }; // Treat 404 as empty list
      }
      console.error(`Client API Error (${res.status}):`, data);
      return { error: data?.msg || data?.message || "Request failed", data };
    }

    return { error: null, data };
  } catch (error) {
    console.error("API client error:", error);
    return { error: "Network error", data: null };
  }
}
