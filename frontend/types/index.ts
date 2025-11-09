// ============================================
// TIPOS MOCK (Datos temporales para desarrollo)
// ============================================
export interface CountryData {
  code: string; // Código ISO del país (ej: "COL", "BRA")
  name: string; // Nombre completo del país
  totalTones: number; // Toneladas totales de residuos
  kgPercapita: number; // Kilogramos per cápita
  collectedFormally: number; // Recolectado formalmente (%)
  recoverable: number; // Recuperable (%)
  recycled: number; // Reciclado (%)
  composted: number; // Compostado (%)
  incinerated: number; // Incinerado (%)
  landfill: number; // Vertedero (%)
  openDump: number; // Vertedero abierto (%)
}

// ============================================
// TIPOS API (Datos reales de e-waste)
// ============================================

/**
 * /ewaste/stats
 * Estadísticas principales de e-waste por país
 */
export interface EWasteStats {
  country: string;
  year: number;
  e_waste_generated_kt: number; // E-waste generado (kilotones)
  e_waste_generated_per_capita: number; // E-waste generado per cápita
  e_waste_collection_rate: number; // Tasa de recolección (%)
  e_waste_formally_collected_kt: number; // E-waste recolectado formalmente (kilotones)
  value_recoverable_usd: number; // Valor recuperable (USD)
}

/**
 * /ewaste/choropleth
 * Datos para mapa coroplético (choropleth map)
 */
export interface EWasteChoropleth {
  country: string;
  country_clean: string;
  iso3: string;
  year: number;
  e_waste_generated_per_capita: number;
  e_waste_generated_kt: number;
  e_waste_collection_rate: number;
}

/**
 * /ewaste/time_series
 * Serie temporal de generación de residuos electrónicos
 */
export interface EWasteTimeSeries {
  year: number;
  ewaste_generated_kg_inh: number; // KG de e-waste generado por habitante
  eee_placed_on_market_kg_inh: number; // KG de EEE colocado en el mercado por habitante
}

/**
 * /ewaste/categories
 * Categorías de residuos electrónicos por año
 */
export interface EWasteCategories {
  country: string;
  year: number;
  temperature_exchange_equipment_kt: number; // Equipos de intercambio de temperatura (kilotones)
  screens_kt: number; // Pantallas (kilotones)
  lamps_kt: number; // Lámparas (kilotones)
  large_equipment_kt: number; // Equipos grandes (kilotones)
  small_equipment_kt: number; // Equipos pequeños (kilotones)
  small_it_kt: number; // Equipos IT pequeños (kilotones)
}

/**
 * /ewaste/sankey
 * Flujo de residuos electrónicos (diagrama Sankey)
 */
export interface EWasteSankey {
  generated_kt: number; // Generado (kilotones)
  formally_collected_kt: number; // Recolectado formalmente (kilotones)
  exported_kt: number; // Exportado (kilotones)
  imported_kt: number; // Importado (kilotones)
  informal_kt: number; // Recolección informal (kilotones)
}

/**
 * /ewaste/scatter
 * Datos para gráfico de dispersión (scatter plot)
 */
export interface EWasteScatter {
  country: string;
  iso3: string; // Código ISO-3
  gdp_per_capita: number; // PIB per cápita
  e_waste_generated_per_capita: number; // E-waste generado per cápita
  population: number; // Población
  e_waste_collection_rate: number; // Tasa de recolección de e-waste (%)
}

/**
 * /ewaste/scenario
 * Escenarios de proyección de residuos electrónicos
 */
export interface EWasteScenario {
  country: string;
  year: number;
  base_formally_collected_kt: number; // Recolección formal base (kilotones)
  new_formally_collected_kt: number; // Nueva recolección formal (kilotones)
  delta_absolute_kt: number; // Delta absoluto (kilotones)
  base_value_recoverable_usd: number; // Valor recuperable base (USD)
  new_value_recoverable_usd: number; // Nuevo valor recuperable (USD)
}

// Modos de vista de la aplicación
export type ViewMode = "home" | "selection" | "dashboard";

// Tabs del dashboard
export type DashboardTab = "individual" | "comparison";

// Tabs de datos de país
export type CountryDataTab =
  | "tons"
  | "percapita"
  | "collected"
  | "recoverable"
  | "recycled"
  | "composted"
  | "incinerated"
  | "landfill"
  | "openDump";

// Estado global de la aplicación
export interface AppState {
  selectedCountries: string[]; // Array de códigos ISO
  viewMode: ViewMode;
  dashboardTab: DashboardTab;
  countryData: Record<string, CountryData>;
  isGlobeInteractive: boolean;
}

// Propiedades del GeoJSON Feature
export interface GeoJSONProperties {
  ADMIN: string; // Nombre del país
  ISO_A2: string; // Código ISO de 2 letras
  ISO_A3: string; // Código ISO de 3 letras
  NAME: string; // Nombre alternativo
  CONTINENT: string; // Continente
}

// Feature del GeoJSON
export interface GeoJSONFeature {
  type: "Feature";
  properties: GeoJSONProperties;
  geometry: {
    type: string;
    coordinates: any;
  };
}

// Datos del GeoJSON completo
export interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Props del componente Globe3D
export interface Globe3DProps {
  isInteractive: boolean;
  selectedCountries: string[];
  onCountryClick?: (countryCode: string) => void;
  className?: string;
}

// Props del GlobeController
export interface GlobeControllerProps {
  globeRef: React.RefObject<any>;
  isInteractive: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialView?: {
    lat: number;
    lng: number;
    altitude: number;
  };
}

// Props del CountryHighlight
export interface CountryHighlightProps {
  selectedCountries: string[];
  highlightColor?: string;
  strokeColor?: string;
  altitude?: number;
}
