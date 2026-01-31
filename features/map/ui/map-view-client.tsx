"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { env } from "@/lib/env";

type MapViewClientProps = {
  center: [number, number];
  zoom?: number;
  markers?: Array<{ lng: number; lat: number; label?: string }>;
};

export function MapViewClient({
  center,
  zoom = 10,
  markers,
}: MapViewClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: env.NEXT_PUBLIC_MAP_STYLE_LIGHT,
      center,
      zoom,
      attributionControl: { compact: true },
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    if (markers && markers.length > 0) {
      markers.forEach((marker) => {
        new maplibregl.Marker({ color: "hsl(var(--primary))" })
          .setLngLat([marker.lng, marker.lat])
          .addTo(mapRef.current!);
      });
    } else {
      new maplibregl.Marker({ color: "hsl(var(--primary))" })
        .setLngLat(center)
        .addTo(mapRef.current);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = undefined;
    };
  }, [center, zoom, markers]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border bg-background shadow-sm">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-2 left-2 z-10">
        <a
          href="https://www.maptiler.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.maptiler.com/resources/logo.svg"
            alt="MapTiler logo"
            className="h-6"
          />
        </a>
      </div>
    </div>
  );
}
