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
  // 1. Check for a Server Session
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    // auth() might fail if called in a client environment where it's not supported
  }
  
  // 2. Intelligent Token Selection
  let token = session?.accessToken;
  if (!token) {
    console.log("Guest detected: Fetching public token...");
    token = await getPublicToken();
  }
  
  if (!token) {
    console.error("Unable to authenticate: No public or user token found.");
    return [];
  }

  // 3. Build the Query
  const params = { 
    merchant: MERCHANT_ID,
    ...searchParams
  };

  // If user is an AGENT, we inject their ID IF they are in a dashboard context.
  if (session?.user?.role === "AGENT" && !params.agent && !params.all) {
    params.agent = session.user.id;
  }
  
  // Clean up internal flags before sending to backend
  if (params.all) delete params.all;

  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/properties${query ? `?${query}` : ""}`;

  // 4. Error Handling & 404s
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
        console.log("Backend returned 404. Likely 0 verified properties.");
        return [];
      }
      const errorText = await res.text();
      console.error(`Properties API Error: ${res.status} ${res.statusText} - ${errorText}`);
      return [];
    }
    
    // 5. Parse and Return
    const responseData = await res.json();
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

export async function fetchPropertyReviews(propertyId) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {}

  const token = session?.accessToken || await getPublicToken();
  if (!token) {
    console.error("Unable to authenticate: No public or user token found.");
    return [];
  }

  try {
    const res = await fetch(`${BASE_URL}/reviews?property_id=${propertyId}&limit=50&page=0`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.log(`No reviews found for property ${propertyId} (404)`);
        return [];
      }
      const errorText = await res.text();
      console.error(`Reviews API Error (${res.status}):`, errorText);
      return [];
    }
    
    const responseData = await res.json();
    console.log("Raw Reviews API Response:", JSON.stringify(responseData, null, 2));
    
    const extractedData = responseData.data || responseData;
    return Array.isArray(extractedData) ? extractedData : [];
  } catch (error) {
    console.error("API Fetch Error (Reviews):", error);
    return [];
  }
}