import { NextRequest, NextResponse } from "next/server";

const TARGET_HOST = "https://mainnet.indexer.privacy.starknet.io";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, params);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, params);
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, params);
}

async function handleProxy(
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }>
) {
  const resolvedParams = await paramsPromise;
  const pathStr = resolvedParams.path.join("/");
  const url = new URL(request.url);
  const targetUrl = `${TARGET_HOST}/${pathStr}${url.search}`;

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

    if (!response.ok) {
      console.warn(`[Indexer Proxy] target returned ${response.status} for ${pathStr}. Returning fallback state.`);
      return NextResponse.json({
        fallback: true,
        notes: [],
        channels: [],
        events: []
      }, { status: 200 });
    }

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
    console.warn(`[Indexer Proxy] fetch failed for ${pathStr}. Returning fallback state. Error: ${error.message}`);
    return NextResponse.json({
      fallback: true,
      notes: [],
      channels: [],
      events: []
    }, { status: 200 });
  }
}
