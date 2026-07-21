export interface Env {
  AIRNOWAPI_KEY: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://weather.amberjoy.dev",
  "http://localhost:5173",
]);

function corsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    Vary: "Origin",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    const url = new URL(request.url);
    const latitude = url.searchParams.get("latitude");
    const longitude = url.searchParams.get("longitude");

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: "latitude and longitude are required" }),
        {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        },
      );
    }

    const airNowParams = new URLSearchParams({
      format: "application/json",
      latitude,
      longitude,
      api_key: env.AIRNOWAPI_KEY,
    });

    const airNowResponse = await fetch(
      `https://www.airnowapi.org/aq/observation/current/ziplatLong/?${airNowParams}`,
    );

    if (!airNowResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Air quality data could not be loaded." }),
        {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        },
      );
    }

    const data = await airNowResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  },
};
