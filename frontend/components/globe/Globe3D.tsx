"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import type { Globe3DProps, GeoJSONData } from "@/types";
import { GlobeController } from "./GlobeController";
import { cn } from "@/lib/utils";

// Cargar Globe dinámicamente para evitar problemas con SSR
const GlobeGL = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-woodsmoke-950">
      <div className="text-flamingo-400 font-unbounded text-sm">Cargando globo...</div>
    </div>
  )
});

/**
 * Componente principal del globo 3D
 * Maneja la carga del GeoJSON y renderizado del globo
 * Optimizado con memoización
 */
export const Globe3D = memo(function Globe3D({
  isInteractive,
  selectedCountries,
  onCountryClick,
  className,
  isHome = false,
}: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const [geoData, setGeoData] = useState<GeoJSONData>({ type: "FeatureCollection", features: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [renderFeatures, setRenderFeatures] = useState<any[]>([]);
  const [randomHighlights, setRandomHighlights] = useState<string[]>([]);

  // Cargar datos GeoJSON (solo una vez)
  useEffect(() => {
    // Load geojson during idle time to avoid blocking main render
    const load = () => {
      fetch("/countries.geojson")
        .then((res) => res.json())
        .then((data: GeoJSONData) => {
          setGeoData(data);
        })
        .catch((error) => {
          console.error("Error cargando GeoJSON:", error);
        })
        .finally(() => setIsLoading(false));
    };

    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(load, { timeout: 200 });
    } else {
      // fallback
      setTimeout(load, 50);
    }
  }, []);

  // Simplify / decimate coordinates if geojson is huge. This is a lightweight
  // simplification that samples coordinates every N points to reduce vertex count
  // while preserving overall shapes. Keeps quality for most use-cases but reduces
  // rendering pressure dramatically for very detailed files.
  useEffect(() => {
    if (!geoData || !geoData.features || geoData.features.length === 0) {
      setRenderFeatures([]);
      return;
    }

    const countCoords = (feat: any) => {
      let total = 0;
      const geom = feat.geometry;
      if (!geom) return 0;
      const recurse = (coords: any) => {
        if (typeof coords[0] === "number") {
          total += 1;
          return;
        }
        for (const c of coords) recurse(c);
      };
      recurse(geom.coordinates);
      return total;
    };

    const totalCoords = geoData.features.reduce((s, f) => s + countCoords(f), 0);
    const MAX_POINTS = 25000; // target to keep under for rendering
    let step = 1;
    if (totalCoords > MAX_POINTS) {
      step = Math.ceil(totalCoords / MAX_POINTS);
    }

    const decimateCoords = (coords: any): any => {
      if (typeof coords[0] === "number") {
        // coords is [lng, lat]
        return coords;
      }
      // coords is an array of coordinates or arrays
      // if it's an array of number-arrays (a ring), sample every `step`
      if (Array.isArray(coords) && coords.length > 0 && typeof coords[0][0] === "number") {
        const out: any[] = [];
        for (let i = 0; i < coords.length; i += step) {
          out.push(coords[i]);
        }
        // ensure closed ring
        if (out.length > 0) {
          const first = out[0];
          const last = out[out.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) out.push(first);
        }
        return out;
      }
      return coords.map((c: any) => decimateCoords(c));
    };

    const simplified = geoData.features.map((f: any) => {
      if (step <= 1) return f;
      try {
        const nf = { ...f, geometry: { ...f.geometry } };
        nf.geometry.coordinates = decimateCoords(f.geometry.coordinates);
        return nf;
      } catch (e) {
        return f;
      }
    });

    setRenderFeatures(simplified);
  }, [geoData]);

  // Manejar clic en país (memoizado)
  const handlePolygonClick = useCallback((polygon: any) => {
    if (!isInteractive || !onCountryClick) return;

    const countryCode = polygon.properties.ISO_A3;
    if (countryCode) {
      onCountryClick(countryCode);
    }
  }, [isInteractive, onCountryClick]);

  // Determinar color del polígono (memoizado)
  const getPolygonCapColor = useCallback(() => {
    // Todos los países transparentes para que solo se vea el borde
    return "rgba(100, 100, 100, 0.01)";
  }, []);

  // Color del contorno del polígono (memoizado)
  const getPolygonSideColor = useCallback((polygon: any) => {
    const countryCode = polygon.properties.ISO_A3;
    const isSelected = selectedCountries.includes(countryCode);
    const isRandomlyHighlighted = randomHighlights.includes(countryCode);

    if (isSelected) return "rgba(242, 88, 54, 0.9)";
    if (isHome && !isInteractive && isRandomlyHighlighted) return "rgba(242, 88, 54, 0.6)";
    return "rgba(100, 100, 100, 0.1)";
  }, [selectedCountries, randomHighlights, isInteractive, isHome]);

  // Altura del polígono (memoizado)
  const getPolygonAltitude = useCallback(() => {
    return 0.001;
  }, []);

  // Efecto para la animación aleatoria solo en la página de inicio
  useEffect(() => {
    if (!isInteractive && isHome) {
      const interval = setInterval(() => {
        const availableCountries = renderFeatures.map((f: any) => f.properties.ISO_A3);
        const randomCountries = [];
        const numHighlights = Math.floor(Math.random() * 5) + 1; // 1-5 países
        
        for (let i = 0; i < numHighlights; i++) {
          const randomIndex = Math.floor(Math.random() * availableCountries.length);
          randomCountries.push(availableCountries[randomIndex]);
        }
        
        setRandomHighlights(randomCountries);
      }, 2000); // Cambiar cada 2 segundos

      return () => clearInterval(interval);
    } else {
      setRandomHighlights([]);
    }
  }, [isInteractive, isHome, renderFeatures]);

  // Color del contorno del polígono (memoizado)
  const getPolygonStrokeColor = useCallback((polygon: any) => {
    const countryCode = polygon.properties.ISO_A3;
    const isSelected = selectedCountries.includes(countryCode);
    const isRandomlyHighlighted = randomHighlights.includes(countryCode);

    if (isSelected) return "#f25836";
    if (isHome && !isInteractive && isRandomlyHighlighted) return "#f25836";
    return "rgba(255, 255, 255, 0.1)";
  }, [selectedCountries, randomHighlights, isInteractive, isHome]);

  if (isLoading) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-woodsmoke-950", className)}>
        <div className="text-flamingo-400 font-unbounded text-sm">Cargando globo...</div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full relative", className)}>
      <GlobeGL
        ref={globeRef}
        // Configuración visual del globo
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl=""
        backgroundColor="#141414"

  // Configuración de polígonos (países)
  polygonsData={renderFeatures.length ? renderFeatures : geoData.features}
  polygonCapColor={getPolygonCapColor}
  polygonSideColor={getPolygonSideColor}
  polygonStrokeColor={getPolygonStrokeColor}
  polygonAltitude={getPolygonAltitude}
  polygonLabel={() => ""}

  // Interacción
  onPolygonClick={handlePolygonClick}
  onPolygonHover={() => {}}
  // evitar transiciones pesadas cuando hay muchos polígonos
  polygonsTransitionDuration={0}

  // Atmósfera
  showAtmosphere={true}
  atmosphereColor="#d9d9d9"
  atmosphereAltitude={0.15}

        // Configuración de renderizado optimizada (más orientada a rendimiento)
        rendererConfig={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        waitForGlobeReady={true}
        animateIn={false}
      />

      {/* Controller para manejar rotación y cámara */}
      <GlobeController
        globeRef={globeRef}
        isInteractive={isInteractive}
        autoRotate={true}
        autoRotateSpeed={0.3}
        initialView={{ lat: -10, lng: -60, altitude: 1.8 }}
      />
    </div>
  );
});
