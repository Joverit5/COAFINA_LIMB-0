"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { LineChart } from "@/components/charts/LineChart";
import { getTimeSeries, getCountryName } from "@/lib/mock-data";
import type { CountryDataTab } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface CountryChartsProps {
  countryCode: string; // ISO3 code
  tab: CountryDataTab;
}

// Map tab to metric key in the time_series_full response and display label
export const TAB_METRIC_MAP: Record<CountryDataTab, { key: string; label: string; color: string }> = {
  tons: { key: "e_waste_generated_kt", label: "E-waste (kt)", color: "#fb7185" }, // flamingo-400
  percapita: { key: "ewaste_generated_kg_inh", label: "E-waste per cápita (kg)", color: "#fb7185" },
  collected: { key: "e_waste_formally_collected_kt", label: "Recolectado formalmente (kt)", color: "#10b981" }, // mantis-400
  recoverable: { key: "value_recoverable_usd", label: "Valor recuperable (USD)", color: "#10b981" },
  market: { key: "eee_placed_on_market_kg_inh", label: "EEE en mercado (kg/hab)", color: "#fb7185" },
  rate: { key: "e_waste_collection_rate", label: "Tasa de recolección (%)", color: "#94a3b8" }, // woodsmoke-ish
};

// Componente memoizado para el contenido del gráfico
const ChartContent = memo(function ChartContent({
  points,
  metric,
  countryCode,
  countryName,
}: {
  points: any[];
  metric: any;
  countryCode: string;
  countryName: string;
}) {
  return (
    <LineChart 
      data={points}
      color={metric.color}
      yLabel={metric.label}
      country={countryName}
      width={500}
      height={300}
    />
  );
});

export function CountryCharts({ countryCode, tab }: CountryChartsProps) {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Función memoizada para procesar los datos
  const processData = useCallback((data: any[]) => {
    return data
      .filter((r) => r.year !== null && r.year !== undefined)
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getTimeSeries(countryCode);

        if (!mounted) return;
        const sorted = processData(data);
        setSeries(sorted);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [countryCode, processData]);

  const metric = TAB_METRIC_MAP[tab];
  const points = series.map((r) => ({ x: r.year, y: r[metric.key] }));
  const countryName = getCountryName(countryCode);

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const data = payload[0];
    const value = typeof data.value === 'number' 
      ? data.value.toLocaleString('es-ES', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0
        })
      : data.value;

    return (
      <div className="rounded-none border-2 border-white/10 overflow-hidden bg-woodsmoke-950/40 backdrop-blur-sm shadow-2xl min-w-48">
        <Table>
          <TableHeader>
            <TableRow className="bg-transparent hover:bg-transparent border-b-2 border-white/10">
              <TableHead className="font-unbounded text-xs text-white uppercase tracking-wider">
                Año
              </TableHead>
              <TableHead className="font-unbounded text-xs text-white uppercase tracking-wider text-right">
                {metric.label}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <TableCell className="font-sans text-sm text-white/80 py-4">
                {label}
              </TableCell>
              <TableCell className="font-mono text-sm text-flamingo-400 font-medium text-right py-4">
                {value}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        {/* Nota sobre la API */}
        <div className="px-4 py-3 border-t border-white/5 bg-woodsmoke-950/60">
          <p className="text-xs text-white/40 font-mono">
            Fuente: API /ewaste/time_series_full
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 rounded-md border border-woodsmoke-900 bg-woodsmoke-950">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-unbounded text-lg text-white">{metric.label}</h3>
          <p className="text-sm text-woodsmoke-400">{countryName}</p>
        </div>
        <div className="text-sm text-woodsmoke-400">
          {loading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-flamingo-400 border-t-transparent" />
              <span>Cargando...</span>
            </div>
          )}
        </div>
      </div>

      <ChartContent
        points={points}
        metric={metric}
        countryCode={countryCode}
        countryName={countryName}
      />
    </div>
  );
}

export default CountryCharts;
