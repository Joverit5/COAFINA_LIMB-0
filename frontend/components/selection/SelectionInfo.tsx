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
        className={cn(
          "flex items-center gap-2 mb-6",
          "px-4 py-2 font-sans text-sm font-medium",
          "text-white bg-woodsmoke-900/80 backdrop-blur-sm",
          "border border-woodsmoke-700",
          "rounded-md",
          "transition-all duration-200",
          "hover:bg-woodsmoke-800/80 hover:border-woodsmoke-600"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      {/* Texto informativo */}
      <div className="bg-woodsmoke-900/80 backdrop-blur-sm border border-woodsmoke-700 rounded-lg p-6">
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
