import { auth } from "@/auth";

const BASE_URL = "http://property.reworkstaging.name.ng/v1";

// As per class project requirements: Admin ID and Credentials via ENV
export const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || ""; 
export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "",
  password: process.env.ADMIN_PASSWORD || ""
};

let publicToken = null;

export async function getPublicToken() {
  if (publicToken) return publicToken;

  try {
    const res = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "public@rufispace.com" }),
    });
    
    if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
      const responseBody = await res.json();
      // The API returns { data: { access_token: "..." } }
      publicToken = responseBody.data?.access_token || responseBody.access_token || responseBody.token;
      return publicToken;
    }
    return null;
  } catch (error) {
    console.error("Failed to get public token", error);
    return null;
  }
}

export async function fetchProperties(searchParams = {}) {
  // Use auth() for server-side session. This will be null on the client.
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    // auth() might fail if called in a client environment where it's not supported
  }
  
  const token = session?.accessToken || await getPublicToken();
  
  if (!token) {
    console.error("Unable to authenticate: No public or user token found.");
    return [];
  }

  const params = { 
    merchant: MERCHANT_ID,
    ...searchParams
  };

  // If user is an AGENT, we inject their ID IF they are in a dashboard context.
  // Since we can't easily know the context here, we'll only inject it if 
  // 'agent' is not provided AND 'all' is not provided.
  if (session?.user?.role === "AGENT" && !params.agent && !params.all) {
    // Note: In public views, the caller should pass { all: true } to see everything.
    params.agent = session.user.id;
  }
  
  // Clean up internal flags before sending to backend
  if (params.all) delete params.all;

  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/properties${query ? `?${query}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      if (res.status === 404) {
        return []; // Treat 404 as empty list
      }
      const errorText = await res.text();
      console.error(`Backend Error (${res.status}):`, errorText);
      return [];
    }
    
    const responseData = await res.json();
    // Handle both direct array and { data: [...] } formats
    return responseData.data || responseData || [];
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}

export async function fetchPropertyById(id) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {}

  const token = session?.accessToken || await getPublicToken();
  if (!token) {
    console.error("Unable to authenticate: No public or user token found.");
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/properties/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend Error (${res.status}):`, errorText);
      return null;
    }
    
    const responseData = await res.json();
    return responseData.data || responseData;
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}