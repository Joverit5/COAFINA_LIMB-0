"use client";

import React, { useEffect, useState } from "react";
import { LineChart } from "@/components/charts/LineChart";
import { getTimeSeries, getCountryName } from "@/lib/mock-data";
import type { CountryDataTab } from "@/types";

interface CountryChartsProps {
  countryCode: string; // ISO3 code
  tab: CountryDataTab;
}

// Map tab to metric key in the time_series_full response and display label
const TAB_METRIC_MAP: Record<CountryDataTab, { key: string; label: string; color: string }> = {
  tons: { key: "e_waste_generated_kt", label: "E-waste (kt)", color: "#fb7185" }, // flamingo-400
  percapita: { key: "ewaste_generated_kg_inh", label: "E-waste per cápita (kg)", color: "#fb7185" },
  collected: { key: "e_waste_formally_collected_kt", label: "Recolectado formalmente (kt)", color: "#10b981" }, // mantis-400
  recoverable: { key: "value_recoverable_usd", label: "Valor recuperable (USD)", color: "#10b981" },
  market: { key: "eee_placed_on_market_kg_inh", label: "EEE en mercado (kg/hab)", color: "#fb7185" },
  rate: { key: "e_waste_collection_rate", label: "Tasa de recolección (%)", color: "#94a3b8" }, // woodsmoke-ish
};

export function CountryCharts({ countryCode, tab }: CountryChartsProps) {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getTimeSeries(countryCode);
      if (!mounted) return;
      // sort by year asc
      const sorted = data
        .filter((r) => r.year !== null && r.year !== undefined)
        .sort((a, b) => Number(a.year) - Number(b.year));
      setSeries(sorted);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [countryCode]);

  const metric = TAB_METRIC_MAP[tab];
  const points = series.map((r) => ({ x: r.year, y: r[metric.key] }));

  return (
    <div className="p-4 rounded-md border border-woodsmoke-900 bg-woodsmoke-950">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-unbounded text-lg text-white">{metric.label}</h3>
          <p className="text-sm text-woodsmoke-400">{getCountryName(countryCode)}</p>
        </div>
        <div className="text-sm text-woodsmoke-400">{loading ? "Cargando..." : ""}</div>
      </div>

      <LineChart data={points} color={metric.color} yLabel={metric.label} country={getCountryName(countryCode)} width={700} height={200} />
    </div>
  );
}

export default CountryCharts;
