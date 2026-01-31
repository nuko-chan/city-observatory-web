"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { env } from "@/lib/env";

function buildMapStyleUrl() {
  const baseUrl = env.NEXT_PUBLIC_MAP_STYLE_LIGHT;
  const key = env.NEXT_PUBLIC_MAPTILER_KEY;

  if (!baseUrl) return undefined;
  const url = new URL(baseUrl);
  if (!url.searchParams.get("key")) {
    url.searchParams.set("key", key);
  }
  return url.toString();
}

type MapViewClientProps = {
  center: [number, number];
  zoom?: number;
  markers?: Array<{ lng: number; lat: number; label?: string }>;
  overlay?: "none" | "precipitation";
};

type OverlayConfig = {
  id: string;
  sourceId: string;
  tiles: string[];
  opacity: number;
};

function getOverlayConfig(type: "none" | "precipitation") {
  if (type === "precipitation") {
    const tilesUrl = new URL(
      "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png",
    );
    tilesUrl.searchParams.set("appid", env.NEXT_PUBLIC_OPENWEATHER_KEY);

    return {
      id: "precipitation-layer",
      sourceId: "precipitation-source",
      tiles: [
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${env.NEXT_PUBLIC_OPENWEATHER_KEY}`,
      ],
      opacity: 0.6,
    } satisfies OverlayConfig;
  }
  return undefined;
}

export function MapViewClient({
  center,
  zoom = 10,
  markers,
  overlay = "none",
}: MapViewClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | undefined>(undefined);
  const [hasError, setHasError] = useState<boolean>(false);
  const styleUrl = buildMapStyleUrl();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!styleUrl) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center,
      zoom,
      attributionControl: { compact: true },
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current.on("error", () => {
      setHasError(true);
    });

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
  }, [center, zoom, markers, styleUrl]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const config = getOverlayConfig(overlay);

    const applyOverlay = () => {
      if (!config) {
        if (map.getLayer("precipitation-layer")) {
          map.removeLayer("precipitation-layer");
        }
        if (map.getSource("precipitation-source")) {
          map.removeSource("precipitation-source");
        }
        return;
      }

      if (!map.getSource(config.sourceId)) {
        map.addSource(config.sourceId, {
          type: "raster",
          tiles: config.tiles,
          tileSize: 256,
        });
      }
      if (!map.getLayer(config.id)) {
        map.addLayer({
          id: config.id,
          type: "raster",
          source: config.sourceId,
          paint: {
            "raster-opacity": config.opacity,
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      try {
        applyOverlay();
      } catch {
        // no-op: overlay failure should not crash the map
      }
    } else {
      const handleLoad = () => {
        try {
          applyOverlay();
        } catch {
          // no-op: overlay failure should not crash the map
        }
      };
      map.once("load", handleLoad);
      return () => {
        map.off("load", handleLoad);
      };
    }
  }, [overlay]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border bg-background shadow-sm">
      {!styleUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 text-sm text-muted-foreground">
          地図のスタイルURLが設定されていません
        </div>
      )}
      {hasError && styleUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 text-sm text-muted-foreground">
          地図を読み込めませんでした
        </div>
      )}
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
