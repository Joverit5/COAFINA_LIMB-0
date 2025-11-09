"use client";

import type { GeoJSONFeature } from "@/types";

/**
 * Utilidades para manejar el highlighting de países seleccionados
 * Proporciona funciones para determinar colores y estilos según selección
 */

interface HighlightConfig {
  selectedCountries: string[];
  colors?: {
    selected: string;
    selectedStroke: string;
    unselected: string;
    unselectedStroke: string;
  };
  altitude?: {
    selected: number;
    unselected: number;
  };
}

/**
 * Obtiene el color de relleno del polígono según si está seleccionado
 */
export function getPolygonCapColor(
  polygon: GeoJSONFeature,
  config: HighlightConfig
): string {
  const countryCode = polygon.properties.ISO_A3;
  const isSelected = config.selectedCountries.includes(countryCode);

  if (isSelected) {
    return config.colors?.selected || "rgba(242, 88, 54, 0.85)"; // flamingo-400
  }

  return config.colors?.unselected || "rgba(100, 100, 100, 0.05)";
}

/**
 * Obtiene el color del lado del polígono
 */
export function getPolygonSideColor(
  polygon: GeoJSONFeature,
  config: HighlightConfig
): string {
  const countryCode = polygon.properties.ISO_A3;
  const isSelected = config.selectedCountries.includes(countryCode);

  if (isSelected) {
    return config.colors?.selectedStroke || "rgba(242, 88, 54, 0.9)";
  }

  return "rgba(100, 100, 100, 0.1)";
}

/**
 * Obtiene la altura del polígono (elevación)
 */
export function getPolygonAltitude(
  polygon: GeoJSONFeature,
  config: HighlightConfig
): number {
  const countryCode = polygon.properties.ISO_A3;
  const isSelected = config.selectedCountries.includes(countryCode);

  if (isSelected) {
    return config.altitude?.selected || 0.015;
  }

  return config.altitude?.unselected || 0.001;
}

/**
 * Obtiene el color del borde del polígono
 */
export function getPolygonStrokeColor(
  polygon: GeoJSONFeature,
  config: HighlightConfig
): string {
  const countryCode = polygon.properties.ISO_A3;
  const isSelected = config.selectedCountries.includes(countryCode);

  if (isSelected) {
    return config.colors?.selectedStroke || "#f25836"; // flamingo-400 hex
  }

  return "rgba(255, 255, 255, 0.05)";
}

/**
 * Hook personalizado para manejar el highlighting de países
 * Retorna todas las funciones de configuración necesarias
 */
export function useCountryHighlight(config: HighlightConfig) {
  return {
    getPolygonCapColor: (polygon: GeoJSONFeature) =>
      getPolygonCapColor(polygon, config),
    getPolygonSideColor: (polygon: GeoJSONFeature) =>
      getPolygonSideColor(polygon, config),
    getPolygonAltitude: (polygon: GeoJSONFeature) =>
      getPolygonAltitude(polygon, config),
    getPolygonStrokeColor: (polygon: GeoJSONFeature) =>
      getPolygonStrokeColor(polygon, config),
  };
}
