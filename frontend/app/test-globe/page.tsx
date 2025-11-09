"use client";

import { useState } from "react";
import { Globe3D } from "@/components/globe";
import { AVAILABLE_COUNTRIES } from "@/lib/mock-data";

/**
 * Página de prueba para el componente Globe3D
 * Permite probar las diferentes configuraciones del globo
 */
export default function TestGlobePage() {
  const [isInteractive, setIsInteractive] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(countryCode)) {
        // Deseleccionar si ya está seleccionado
        return prev.filter((code) => code !== countryCode);
      } else {
        // Seleccionar si no está seleccionado
        return [...prev, countryCode];
      }
    });
  };

  const clearSelection = () => {
    setSelectedCountries([]);
  };

  return (
    <div className="relative w-full h-screen bg-woodsmoke-950">
      {/* Globo 3D de fondo */}
      <div className="absolute inset-0">
        <Globe3D
          isInteractive={isInteractive}
          selectedCountries={selectedCountries}
          onCountryClick={handleCountryClick}
          isHome={false} // página de prueba, no es home
        />
      </div>

      {/* Panel de controles */}
      <div className="absolute top-8 left-8 bg-woodsmoke-900/90 border-2 border-flamingo-400 rounded-lg p-6 shadow-2xl max-w-sm">
        <h1 className="text-2xl font-unbounded text-flamingo-400 mb-4">
          LIMB-O Globo
        </h1>

        <div className="space-y-4">
          {/* Toggle interactividad */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-sans text-white">Interactivo:</span>
            <button
              onClick={() => setIsInteractive(!isInteractive)}
              className={`px-4 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
                isInteractive
                  ? "bg-flamingo-400 text-white"
                  : "bg-woodsmoke-700 text-woodsmoke-300"
              }`}
            >
              {isInteractive ? "SÍ" : "NO"}
            </button>
          </div>

          {/* Países seleccionados */}
          <div>
            <span className="text-sm font-sans text-white block mb-2">
              Países seleccionados:
            </span>
            {selectedCountries.length > 0 ? (
              <div className="space-y-1">
                {selectedCountries.map((code) => (
                  <div
                    key={code}
                    className="px-3 py-1 bg-flamingo-400/20 border border-flamingo-400 rounded text-flamingo-400 text-xs font-mono"
                  >
                    {code}
                  </div>
                ))}
                <button
                  onClick={clearSelection}
                  className="mt-2 px-3 py-1 bg-woodsmoke-700 text-white text-xs rounded hover:bg-woodsmoke-600 transition-colors w-full"
                >
                  Limpiar selección
                </button>
              </div>
            ) : (
              <p className="text-xs text-woodsmoke-400 font-sans">
                Ninguno (activa modo interactivo)
              </p>
            )}
          </div>

          {/* Información */}
          <div className="pt-4 border-t border-woodsmoke-700">
            <p className="text-xs text-woodsmoke-400 font-sans leading-relaxed">
              {isInteractive
                ? "Haz clic en los países para seleccionarlos. Puedes rotar y hacer zoom en el globo."
                : "El globo está en modo estático. Activa el modo interactivo para seleccionar países."}
            </p>
          </div>

          {/* Países disponibles en mock */}
          <div className="pt-4 border-t border-woodsmoke-700">
            <span className="text-xs text-woodsmoke-500 font-sans block mb-1">
              Países con datos mock:
            </span>
            <p className="text-xs text-mantis-400 font-mono">
              {AVAILABLE_COUNTRIES.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de estado */}
      <div className="absolute bottom-8 right-8 px-4 py-2 bg-woodsmoke-900/90 border border-mantis-400 rounded-lg">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isInteractive ? "bg-mantis-400" : "bg-woodsmoke-500"
            }`}
          />
          <span className="text-xs font-sans text-white">
            {isInteractive ? "Modo Interactivo" : "Modo Estático"}
          </span>
        </div>
      </div>
    </div>
  );
}
