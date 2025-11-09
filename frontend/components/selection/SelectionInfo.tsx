"use client";

import { useApp } from "@/contexts/AppContext";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Información y botón de regreso en la vista de selección
 */
export function SelectionInfo() {
  const { goToHome, selectedCountries } = useApp();

  return (
    <div className="absolute top-24 left-8 z-40 max-w-md">
      {/* Botón Back */}
      <button
        onClick={goToHome}
        className="group relative inline-flex items-center font-unbounded font-medium text-sm"
      >
        {/* Ícono que sobresale (ahora a la izquierda) */}
        <span
          className={cn(
            "relative z-10 px-4 py-3 -mr-2",
            "bg-flamingo-400",
            "border-2 border-woodsmoke-950 border-r-0",
            "shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]",
            "transition-all duration-200",
            "group-hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] ",
            "group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] ",
            "group-active:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]",
            "group-active:translate-x-[2px] group-active:translate-y-[2px] "
          )}
        >
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </span>
        
        {/* Contenedor principal del botón */}
        <span
          className={cn(
            "relative z-10 px-6 py-3",
            "bg-white text-woodsmoke-950",
            "border-0 border-woodsmoke-950",
            "shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]",
            "transition-all duration-200",
            "group-hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]",
            "group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]",
            "group-active:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]",
            "group-active:translate-x-[2px] group-active:translate-y-[2px]"
          )}
        >
          VOLVER
        </span>
      </button>      {/* Texto informativo */}
      <div className="p-6">
        <h2 className="font-unbounded font-medium text-2xl text-flamingo-400 mb-3">
          Selecciona Países
        </h2>
        <p className="font-sans text-sm text-woodsmoke-200 leading-relaxed mb-4">
          Haz clic en los países del globo para seleccionarlos y ver sus datos de residuos.
        </p>

        {/* Contador de países seleccionados */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-flamingo-400" />
          <span className="font-sans text-xs text-woodsmoke-400">
            {selectedCountries.length} país{selectedCountries.length !== 1 ? "es" : ""} seleccionado{selectedCountries.length !== 1 ? "s" : ""}
          </span>
        </div>

        {selectedCountries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-woodsmoke-700">
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((code) => (
                <span
                  key={code}
                  className="px-3 py-1 bg-flamingo-400/20 border border-flamingo-400
                           rounded text-flamingo-400 text-xs font-mono"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
