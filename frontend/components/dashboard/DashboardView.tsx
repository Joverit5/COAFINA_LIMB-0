"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getEWasteStatsMultiple, getCountryName } from "@/lib/mock-data";
import { DashboardHeader } from "./DashboardHeader";
import { CountryCollapsible } from "./CountryCollapsible";
import { FloatingNav } from "@/components/layout";

/**
 * Vista completa del Dashboard
 * Muestra datos de todos los países seleccionados
 */
export function DashboardView() {
  const { selectedCountries, dashboardTab } = useApp();
  const [countriesData, setCountriesData] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!selectedCountries || selectedCountries.length === 0) {
        setCountriesData([]);
        return;
      }
      const data = await getEWasteStatsMultiple(selectedCountries);
      if (mounted) setCountriesData(data);
    })();
    return () => {
      mounted = false;
    };
  }, [selectedCountries]);

  return (
    <div className="absolute inset-0 overflow-y-auto z-30">
      <div className="min-h-screen pt-24 pb-32 p-10">
        <div className="max-w-full">
          {/* Header con países seleccionados */}
          <DashboardHeader />

          {/* Barra flotante de navegación */}
          <FloatingNav />

          {/* Contenido según tab activo */}
          {dashboardTab === "individual" && (
            <div className="space-y-4">
              {/* Lista de países en collapsibles */}
              {selectedCountries.map((countryCode, index) => {
                const countryData = countriesData.find(
                  (c) => c.country === getCountryName(countryCode)
                );
                if (!countryData) return null;

                return (
                  <CountryCollapsible
                    key={countryCode}
                    data={countryData}
                    countryCode={countryCode}
                    defaultOpen={index === 0} // Primer país expandido por defecto
                    index={index} // Para efecto stagger en animaciones
                  />
                );
              })}

              {/* Mensaje si no hay países */}
              {countriesData.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-sans text-woodsmoke-400">
                    No hay datos del país seleccionado.
                  </p>
                </div>
              )}
            </div>
          )}

          {dashboardTab === "comparison" && (
            <div className="bg-woodsmoke-900/80 backdrop-blur-sm border-2 border-woodsmoke-700 rounded-lg p-12">
              <div className="text-center">
                <h2 className="font-unbounded text-2xl text-white mb-4">
                  Vista de Comparaciones
                </h2>
                <p className="font-sans text-woodsmoke-400 mb-2">
                  Esta vista se implementará en una fase posterior
                </p>
                <p className="font-sans text-sm text-woodsmoke-500">
                  Aquí se mostrarán gráficos comparativos entre los países seleccionados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
