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
}: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const [geoData, setGeoData] = useState<GeoJSONData>({ type: "FeatureCollection", features: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos GeoJSON (solo una vez)
  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data: GeoJSONData) => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando GeoJSON:", error);
        setIsLoading(false);
      });
  }, []);

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

    return isSelected ? "rgba(242, 88, 54, 0.9)" : "rgba(100, 100, 100, 0.1)";
  }, [selectedCountries]);

  // Altura del polígono (memoizado)
  const getPolygonAltitude = useCallback(() => {
    return 0.001;
  }, []);

  // Color del borde del polígono (memoizado)
  const getPolygonStrokeColor = useCallback((polygon: any) => {
    const countryCode = polygon.properties.ISO_A3;
    const isSelected = selectedCountries.includes(countryCode);

    return isSelected ? "#f25836" : "rgba(255, 255, 255, 0.1)";
  }, [selectedCountries]);

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
        polygonsData={geoData.features}
        polygonCapColor={getPolygonCapColor}
        polygonSideColor={getPolygonSideColor}
        polygonStrokeColor={getPolygonStrokeColor}
        polygonAltitude={getPolygonAltitude}
        polygonLabel={() => ""}

        // Interacción
        onPolygonClick={handlePolygonClick}
        onPolygonHover={() => {}}
        polygonsTransitionDuration={300}

        // Atmósfera
        showAtmosphere={true}
        atmosphereColor="#d9d9d9"
        atmosphereAltitude={0.15}

        // Configuración de renderizado optimizada
        rendererConfig={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
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
