"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import { getCountryName } from "@/lib/mock-data";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

/**
 * Header del Dashboard
 * Muestra países seleccionados con banderas y botón de navegación
 */
export function DashboardHeader() {
  const { selectedCountries, goToSelection } = useApp();

  const labelRef = useRef<HTMLParagraphElement>(null);
  const flagsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Animación de entrada
  useEffect(() => {
    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Animar label
    if (labelRef.current) {
      timeline.fromTo(
        labelRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 }
      );
    }

    // Animar banderas
    if (flagsRef.current) {
      const flags = flagsRef.current.querySelectorAll(".flag-circle");
      timeline.fromTo(
        flags,
        { opacity: 0, scale: 0, rotation: -180 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      );
    }

    // Animar título
    if (titleRef.current) {
      timeline.fromTo(
        titleRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5 },
        "-=0.3"
      );
    }

    // Animar botón
    if (buttonRef.current) {
      timeline.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4 },
        "-=0.2"
      );
    }
  }, [selectedCountries]);

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
    <div className="mb-6">
      {/* Label pequeño */}
      <p
        ref={labelRef}
        className="text-xs font-sans text-woodsmoke-500 tracking-wide mb-2 opacity-0"
      >
        SELECT COUNTRIES
      </p>

      <div className="flex items-center justify-between gap-4">
        {/* Lado izquierdo: Banderas + Nombres */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Círculos de banderas superpuestos */}
          {selectedCountries.length > 0 && (
            <div ref={flagsRef} className="flex items-center -space-x-3">
              {selectedCountries.map((countryCode, index) => (
                <div
                  key={countryCode}
                  className={cn(
                    "flag-circle",
                    "w-12 h-12 rounded-full",
                    "border-3 border-woodsmoke-950",
                    "bg-woodsmoke-800",
                    "flex items-center justify-center",
                    "shadow-md",
                    "relative",
                    "opacity-0"
                  )}
                  style={{ zIndex: selectedCountries.length - index }}
                >
                  <span className="text-2xl">{getFlagEmoji(countryCode)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Nombres de países en Unbounded */}
          <h1
            ref={titleRef}
            className="font-unbounded font-medium text-2xl md:text-3xl text-flamingo-400 truncate opacity-0"
          >
            {selectedCountries.map((c) => getCountryName(c)).join(", ")}
          </h1>
        </div>

        {/* Lado derecho: Botón con icono verde */}
        <button
          ref={buttonRef}
          onClick={goToSelection}
          className={cn(
            "flex items-center justify-center flex-shrink-0 opacity-0",
            "w-14 h-14 rounded-full",
            "bg-woodsmoke-950 text-mantis-400",
            "border-2 border-woodsmoke-900",
            "transition-all duration-200",
            "hover:bg-woodsmoke-900 hover:border-woodsmoke-800"
          )}
          aria-label="Volver a selección de países"
        >
          <Globe className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
