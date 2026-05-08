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
  const token = await getPublicToken();
  
  if (!token) {
    throw new Error("Unable to authenticate with public API");
  }

  const params = { ...searchParams };
  // The backend API does not support merchant=... for properties route
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

    if (!res.ok) throw new Error("Failed to fetch properties");
    
    if (!res.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Invalid response format");
    }
    const responseData = await res.json();
    return responseData.data || [];
  } catch (error) {
    console.error(error);
    return []; // Return empty array on failure
  }
}

export async function fetchPropertyById(id) {
  const token = await getPublicToken();
  if (!token) throw new Error("Unable to authenticate with public API");

  try {
    const res = await fetch(`${BASE_URL}/properties/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) throw new Error("Failed to fetch property details");
    if (!res.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Invalid response format");
    }
    const responseData = await res.json();
    return responseData.data || responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
}