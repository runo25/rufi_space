import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  return proxy(req, params, "GET");
}

export async function POST(req, { params }) {
  return proxy(req, params, "POST");
}

export async function PUT(req, { params }) {
  return proxy(req, params, "PUT");
}

export async function DELETE(req, { params }) {
  return proxy(req, params, "DELETE");
}

async function proxy(req, params, method) {
  try {
    // In Next.js 15+, params is a promise
    const resolvedParams = typeof params?.then === 'function' ? await params : params;
    const pathParts = resolvedParams?.path || [];
    const path = Array.isArray(pathParts) ? pathParts.join("/") : pathParts;
    
    const url = new URL(req.url);
    const searchParams = url.searchParams.toString();
    const targetUrl = `http://property.reworkstaging.name.ng/v1/${path}${searchParams ? `?${searchParams}` : ""}`;
    
    console.log(`Proxying ${method} ${req.url} -> ${targetUrl}`);

    const headers = new Headers();
    req.headers.forEach((value, key) => {
      if (!["host", "connection", "origin", "referer"].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });
    
    let body;
    if (method !== "GET" && method !== "HEAD") {
      body = await req.text();
    }
    
    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store"
    });
    
    const data = await res.text();
    console.log(`Target responded with ${res.status}`);

    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy failure:", error);
    return NextResponse.json({ 
      msg: `Proxy Error: ${error.message}`, 
      stack: error.stack 
    }, { status: 500 });
  }
}
