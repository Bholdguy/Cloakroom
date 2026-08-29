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

function getFallbackResponse(pathStr: string) {
  if (pathStr.includes("health")) {
    return { status: "OK" };
  }
  if (pathStr.includes("preflight_check")) {
    return {
      sender_registered: true,
      channel_exists: true,
      subchannel_exists: true,
    };
  }
  if (pathStr.includes("incoming_state")) {
    return {
      fallback: true,
      block_ref: "0x0",
      channels: [],
      notes: [],
      cursor: {
        channel_discovery_complete: true,
        channels: {},
      },
    };
  }
  if (pathStr.includes("outgoing_state")) {
    return {
      fallback: true,
      block_ref: "0x0",
      channels: [],
      subchannels: [],
      cursor: {
        channel_discovery_complete: true,
        total_n_channels: 0,
        channels: {},
      },
    };
  }
  if (pathStr.includes("history")) {
    return {
      transactions: [],
      cursor: {},
    };
  }
  return {
    fallback: true,
    block_ref: "0x0",
    notes: [],
    channels: [],
    subchannels: [],
    events: [],
    cursor: {
      channel_discovery_complete: true,
      total_n_channels: 0,
      channels: {},
    },
  };
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
      const errText = await response.text();
      return NextResponse.json(
        {
          error: "UPSTREAM_INDEXER_ERROR",
          status: response.status,
          path: pathStr,
          targetUrl,
          message: errText || response.statusText,
        },
        { status: 502 }
      );
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
    return NextResponse.json(
      {
        error: "INDEXER_UPSTREAM_UNREACHABLE",
        path: pathStr,
        targetUrl,
        cause: error.message,
        code: error.code || "ENOTFOUND",
      },
      { status: 502 }
    );
  }
}
