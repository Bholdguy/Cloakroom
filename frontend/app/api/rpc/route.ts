import { NextRequest, NextResponse } from "next/server";

const TARGET_HOST = "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx";

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${TARGET_HOST}${url.search}`;

  const hasBody = request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host" && key.toLowerCase() !== "connection") {
      headers.set(key, value);
    }
  });

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const data = await response.arrayBuffer();
    
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "RPC Proxy request failed", details: error.message },
      { status: 500 }
    );
  }
}
