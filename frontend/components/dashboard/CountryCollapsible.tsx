"use client";

import { useState, useEffect, useRef } from "react";
import type { EWasteStats } from "@/types";
import { CountryMetrics } from "./CountryMetrics";
import { CountryDataTabs } from "./CountryDataTabs";
import { CountryDataTable } from "./CountryDataTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface CountryCollapsibleProps {
  data: EWasteStats;
  countryCode: string;
  defaultOpen?: boolean;
  index?: number;
}

/**
 * Componente collapsible para cada país
 * Muestra métricas, tabs de datos y tabla de información con animaciones
 */
export function CountryCollapsible({ data, countryCode, defaultOpen = false, index = 0 }: CountryCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showSketch, setShowSketch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animación de entrada
  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.15, // Stagger effect
        ease: "power3.out",
      }
    );
  }, [index]);

  // Obtener emoji de bandera
  const getFlagEmoji = (countryCode: string): string => {
    const iso3ToIso2: Record<string, string> = {
      COL: "CO",
      BRA: "BR",
      VEN: "VE",
      ARG: "AR",
      MEX: "MX",
      CHL: "CL",
      PER: "PE",
      ECU: "EC",
      BOL: "BO",
      PRY: "PY",
      URY: "UY",
    };

    const iso2 = iso3ToIso2[countryCode];
    if (!iso2) return "🌎";

    const codePoints = iso2
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "mb-6 rounded-none opacity-0",
        "border-2 border-white/10",
        "overflow-hidden",
        "transition-all duration-300",
        "bg-woodsmoke-950/40"
      )}
      ref={containerRef}
    >
      {/* Header del Collapsible */}
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full px-6 py-5",
            "flex items-center gap-4",
            "transition-colors duration-200",
            "hover:bg-woodsmoke-800/50"
          )}
        >
          {/* Bandera */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex-shrink-0",
              "flex items-center justify-center",
              "bg-woodsmoke-800",
              "border-2 border-woodsmoke-700",
              "transition-transform duration-300 hover:scale-110"
            )}
          >
            <span className="text-2xl">{getFlagEmoji(data.code)}</span>
          </div>

          {/* Nombre del país */}
          <div className="flex-1 text-left min-w-0">
            <h3 className="font-unbounded font-medium text-xl text-white mb-1">
              {data.country}
            </h3>
            <p className="text-xs font-mono text-white/40">{countryCode}</p>
          </div>

          {/* Métricas en el header */}
          <div className="hidden lg:block flex-1">
            <CountryMetrics data={data} animate={false} />
          </div>

          {/* Botones de control */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Toggle del croquis */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowSketch(!showSketch);
              }}
              className={cn(
                "p-2 rounded-none transition-all duration-300 cursor-pointer",
                "transform hover:scale-110 active:scale-95",
                "border border-white/10",
                showSketch
                  ? "bg-flamingo-400 text-white border-flamingo-400"
                  : "bg-woodsmoke-950 text-white/60 hover:text-white hover:border-white/20"
              )}
              role="button"
              aria-label="Toggle mapa del país"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSketch(!showSketch);
                }
              }}
            >
              <Map className="w-5 h-5" />
            </div>

            {/* Icono de chevron */}
            <ChevronDown
              className={cn(
                "w-6 h-6 text-white/60 transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>
      </CollapsibleTrigger>

      {/* Contenido expandido */}
      <CollapsibleContent className="px-6 pb-6">
        {/* Métricas en mobile */}
        <div className="lg:hidden mb-6 pt-4 border-t border-woodsmoke-700">
          <CountryMetrics data={data} animate={isOpen} />
        </div>

        {/* Croquis/Silueta del país */}
        {showSketch && (
          <div className="mb-6 p-6 bg-woodsmoke-950/60 rounded-none border border-white/10 animate-in fade-in duration-300">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Map className="w-16 h-16 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/60 font-sans">
                  Croquis del país: {data.country}
                </p>
                <p className="text-xs text-white/40 font-mono mt-1">
                  SVG desde GeoJSON • Próximamente
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de datos */}
        <CountryDataTabs />

        {/* Tabla de datos */}
        <CountryDataTable data={data} />
      </CollapsibleContent>
    </Collapsible>
  );
}
