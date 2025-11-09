"use client";

import { useState, useEffect, useRef } from "react";
import type { EWasteStats } from "@/types";
import { CountryMetrics } from "./CountryMetrics";
import { getCountryName, getTimeSeries } from "@/lib/mock-data";
import { CountryDataTabs } from "./CountryDataTabs";
import CountryCharts, { TAB_METRIC_MAP } from "./CountryCharts";
import lookup from 'country-code-lookup';
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
  const [selectedTab, setSelectedTab] = useState<"tons" | "percapita" | "collected" | "recoverable" | "market" | "rate">("tons");
  const [showSketch, setShowSketch] = useState(false);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cargar datos de serie temporal
  useEffect(() => {
    let mounted = true;
    
    const loadTimeSeries = async () => {
      try {
        const data = await getTimeSeries(countryCode);
        if (mounted) {
          setTimeSeriesData(data
            .filter((r: { year: number | null }) => r.year !== null && r.year !== undefined)
            .sort((a: { year: number }, b: { year: number }) => Number(a.year) - Number(b.year)));
        }
      } catch (error) {
        console.error('Error loading time series:', error);
      }
    };

    if (isOpen) {
      loadTimeSeries();
    }

    return () => { mounted = false; };
  }, [countryCode, isOpen]);

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

  const getFlagUrl = (countryCode: string): string => {
    const country = lookup.byIso(countryCode);
    return country ? `https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png` : '';
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
              "w-12 h-12 rounded-full shrink-0",
              "flex items-center justify-center",
              "bg-woodsmoke-800",
              "border-2 border-woodsmoke-700",
              "transition-transform duration-300 hover:scale-110"
            )}
          >
            <span className="text-2xl">{<img 
                                src={getFlagUrl(countryCode)}
                                alt={`Bandera de ${getCountryName(countryCode)}`}
                                className="w-8 h-8 object-cover rounded-full"
                              />}</span>
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
          <div className="flex items-center gap-2 shrink-0">
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

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda: Tabs y gráfica */}
          <div>
            {/* Tabs de datos */}
            <CountryDataTabs onTabChange={(t) => setSelectedTab(t)} defaultTab={selectedTab} />

            {/* Gráfica según tab seleccionado */}
            <div className="mb-6">
              <CountryCharts countryCode={countryCode} tab={selectedTab} />
            </div>
          </div>

          {/* Columna derecha: Tabla de datos */}
          <div className="bg-woodsmoke-950/60 rounded-md border border-white/10 p-6">
            <h3 className="font-unbounded text-lg text-white mb-4">Datos Históricos</h3>
            <div className="overflow-x-auto">
              {/* Aquí irá la tabla de datos */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/10">
                    <th className="py-2 px-4 text-left font-unbounded text-xs text-white/60">Año</th>
                    <th className="py-2 px-4 text-right font-unbounded text-xs text-white/60">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSeriesData.map((item, index) => {
                    const value = item[TAB_METRIC_MAP[selectedTab].key];
                    return (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 font-sans text-sm text-white/80">{item.year}</td>
                        <td className="py-3 px-4 font-mono text-sm text-flamingo-400 text-right">
                          {typeof value === 'number' 
                            ? value.toLocaleString('es-ES', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 0
                              })
                            : value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
