import type { CountryData, EWasteStats } from "@/types";

// Base URL del backend desplegado
const API_BASE = "https://hurricane-procurement-rats-meanwhile.trycloudflare.com/";

/**
 * Mapeo de códigos ISO a nombres de países (auxiliar para construir las consultas)
 * Mantengo este mapeo mínimo; si lo prefieres, podemos obtener los países desde la API.
 *
 * Nota: este mapping es sólo para convertir códigos ISO (usados en UI) a nombres que
 * la API espera en su parámetro `country`.
 */
const ISO_TO_COUNTRY_NAME: Record<string, string> = {
  COL: "Colombia",
  BOL: "Bolivia",
  CHL: "Chile",
  ECU: "Ecuador",
  GTM: "Guatemala",
  HND: "Honduras",
  NIC: "Nicaragua",
  PAN: "Panama",
  PER: "Peru",
  URY: "Uruguay",
  BRA: "Brasil",
  VEN: "Venezuela",
  ARG: "Argentina",
  MEX: "Mexico",
};

/**
 * Lista de códigos ISO disponibles (usada por páginas de desarrollo)
 */
export const AVAILABLE_COUNTRIES = Object.keys(ISO_TO_COUNTRY_NAME);

/**
 * Obtiene el nombre del país a partir de su código ISO
 */
export function getCountryName(code: string): string {
  return ISO_TO_COUNTRY_NAME[code] || code;
}

/**
 * Obtiene los datos legacy de un país por su código ISO
 * @deprecated Usar getEWasteStats en su lugar
 */
export function getCountryData(code: string): CountryData | undefined {
  // Deprecated: previously returned local mock data. Now we recommend fetching
  // from the backend using `getEWasteStats` / `getEWasteStatsMultiple`.
  return undefined;
}

/**
 * Obtiene datos legacy de múltiples países
 * @deprecated Usar getEWasteStatsMultiple en su lugar
 */
export function getCountriesData(codes: string[]): CountryData[] {
  // Deprecated: previously returned local mock data. For real data use
  // `getEWasteStats` / `getEWasteStatsMultiple` which query the backend.
  return [];
}

/**
 * Obtiene las estadísticas de e-waste de un país
 */
export async function getEWasteStats(code: string, year?: number): Promise<EWasteStats | undefined> {
  const country = getCountryName(code);
  const params = new URLSearchParams();
  params.set("country", country);
  if (year) params.set("year", String(year));
  try {
    const res = await fetch(`${API_BASE}/ewaste/stats?${params.toString()}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    return data as EWasteStats;
  } catch (e) {
    console.error("getEWasteStats error", e);
    return undefined;
  }
}

/**
 * Obtiene estadísticas de e-waste de múltiples países
 */
export async function getEWasteStatsMultiple(codes: string[]): Promise<EWasteStats[]> {
  const results = await Promise.all(codes.map((c) => getEWasteStats(c)));
  return results.filter((r): r is EWasteStats => r !== undefined);
}

/**
 * Obtiene la serie temporal ampliada para un país (llama a /ewaste/time_series_full)
 */
export async function getTimeSeries(countryCode: string): Promise<any[]> {
  const country = getCountryName(countryCode);
  try {
    const res = await fetch(`${API_BASE}/ewaste/time_series_full?country=${encodeURIComponent(country)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("getTimeSeries error", e);
    return [];
  }
}

/**
 * Formatea números grandes con separadores de miles
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

/**
 * Formatea kilotones (kt) en formato legible
 */
export function formatKilotons(kt: number | undefined | null): string {
  if (kt == null || isNaN(kt)) {
    return "0.0K";
  }
  if (kt >= 1000) {
    return `${(kt / 1000).toFixed(1)}M`;
  }
  return `${kt.toFixed(1)}K`;
}

/**
 * Formatea toneladas en formato legible (ej: 12.5M)
 */
export function formatTones(tones: number | undefined | null): string {
  if (tones == null || isNaN(tones)) {
    return "0";
  }
  if (tones >= 1000000) {
    return `${(tones / 1000000).toFixed(1)}M`;
  }
  if (tones >= 1000) {
    return `${(tones / 1000).toFixed(1)}K`;
  }
  return tones.toString();
}

/**
 * Formatea porcentajes
 */
export function formatPercentage(value: number | undefined | null): string {
  if (value == null || isNaN(value)) {
    return "0.0%";
  }
  return `${value.toFixed(1)}%`;
}

/**
 * Formatea valores en USD
 */
export function formatUSD(value: number | undefined | null): string {
  if (value == null || isNaN(value)) {
    return "$0 USD";
  }
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B USD`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M USD`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K USD`;
  }
  return `$${value.toFixed(0)} USD`;
}
