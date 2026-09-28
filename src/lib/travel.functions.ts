import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Workshop base: Fjordvegen 152, 9107 Eidkjosen (Kaldfjord), Tromsø
export const BASE = {
  label: "Fjordvegen 152, Kaldfjord (Eidkjosen), Tromsø",
  lat: 69.6819219,
  lon: 18.7171277,
};

function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const getRoadDistance = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) }).parse(data),
  )
  .handler(async ({ data }) => {
    const straightKm = haversineKm(BASE, { lat: data.lat, lon: data.lon });
    const fallbackKm = Math.round(straightKm * 1.3);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${BASE.lon},${BASE.lat};${data.lon},${data.lat}?overview=false`,
        { signal: controller.signal },
      );
      clearTimeout(timer);

      if (res.ok) {
        const json = (await res.json()) as {
          routes?: { distance?: number }[];
        };
        const meters = json?.routes?.[0]?.distance;
        if (typeof meters === "number" && meters > 0) {
          return { km: Math.max(1, Math.round(meters / 1000)), approximate: false };
        }
      }
    } catch {
      // fall through to straight-line estimate
    }

    return { km: fallbackKm, approximate: true };
  });
