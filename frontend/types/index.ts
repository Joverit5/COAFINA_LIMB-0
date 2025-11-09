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
export type DashboardTab = "individual" | "comparison" | "analysis";

// Tabs de datos de país
export type CountryDataTab =
  | "tons"
  | "percapita"
  | "collected"
  | "recoverable"
  | "market"
  | "rate";

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
  isHome?: boolean;
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

/**
 * Estructura de un punto de datos en el gráfico
 * Puede contener cualquier propiedad, la clave es flexible
 */
export interface DataPoint {
  [key: string]: any;
}

/**
 * Tipos de gráficos soportados por el componente
 */
export type ChartType = 'line' | 'bar' | 'area' | 'scatter' | 'pie';

/**
 * Configuración de una variable individual a graficar
 */
export interface VariableConfig {
  /** Nombre de la propiedad en los datos del endpoint */
  key: string;
  /** Etiqueta legible para mostrar en la leyenda */
  label: string;
  /** Color en formato hexadecimal (ej: '#3b82f6') */
  color: string;
}

/**
 * Props principales del componente ConfigurableChart
 */
export interface ConfigurableChartProps {
  /** URL del endpoint que proporciona los datos */
  endpoint: string;
  
  /** Tipo de gráfico a renderizar */
  chartType: ChartType;
  
  /** Clave de la propiedad a usar para el eje X */
  xAxisKey: string;
  
  /** Array de variables a graficar con su configuración */
  variables: VariableConfig[];
  
  /** Título principal del gráfico */
  title: string;
  
  /** Texto placeholder para el campo de entrada (opcional) */
  placeholder?: string;
  
  /** Subtítulo o descripción adicional (opcional) */
  subtitle?: string;
  
  /** Altura del gráfico en píxeles (default: 400) */
  height?: number;
  
  /** Si true, carga los datos automáticamente al montar el componente (default: false) */
  autoLoad?: boolean;
  
  /** Objeto con filtros a aplicar sobre los datos */
  filters?: FilterConfig;
  
  /** Función personalizada para transformar los datos antes de graficarlos */
  transformData?: (data: DataPoint[]) => DataPoint[];
}

/**
 * Configuración de filtros
 * Las claves son nombres de propiedades y los valores son los valores a filtrar
 */
export interface FilterConfig {
  [key: string]: string | number | boolean;
}

/**
 * Respuesta estándar de una API
 * Soporta diferentes estructuras comunes de respuesta
 */
export interface ApiResponse {
  data?: DataPoint[];
  results?: DataPoint[];
  items?: DataPoint[];
  [key: string]: any;
}

/**
 * Estado interno del componente
 */
export interface ChartState {
  chartData: DataPoint[];
  loading: boolean;
  error: string;
  showEndpoint: boolean;
}

// ============================================
// TIPOS ESPECÍFICOS PARA E-WASTE DATA
// ============================================

/**
 * Estructura de datos de residuos electrónicos
 * Basado en el ejemplo proporcionado
 */
export interface EWasteData {
  country: string;
  year: number;
  category: string;
  kt: number;
  value: number | null;
  e_waste_generated_kt_x: number;
  share_x: number;
  population: number;
  e_waste_generated_kt_y: number;
  eee_put_on_market_kt: number;
  e_waste_collection_rate: number;
  e_waste_formally_collected_kt: number;
  gdp_per_capita: number;
  average_household_size: number;
  ewaste_generated_kg_inh: number;
  eee_placed_on_market_kg_inh: number;
  ewaste_formally_collected_kg_inh: number;
  share_y: number | null;
}

/**
 * Categorías de equipos electrónicos
 */
export type EWasteCategory = 
  | 'temperature_exchange_equipment_kt'
  | 'screens_and_monitors_kt'
  | 'lamps_kt'
  | 'large_equipment_kt'
  | 'small_equipment_kt'
  | 'small_it_and_telecom_equipment_kt';

/**
 * Filtros específicos para datos de E-Waste
 */
export interface EWasteFilters {
  country?: string;
  year?: number;
  category?: EWasteCategory;
  // Permite cualquier otra propiedad de filtro
  [key: string]: string | number | boolean | undefined;
}

/**
 * Configuración predefinida para gráficos de E-Waste
 */
export interface EWasteChartConfig {
  title: string;
  subtitle?: string;
  variables: VariableConfig[];
  filters?: EWasteFilters;
  chartType?: ChartType;
  xAxisKey?: string;
}

// ============================================
// CONSTANTES Y PRESETS
// ============================================

/**
 * Paleta de colores predefinida
 */
export const CHART_COLORS = {
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#10b981',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  emerald: '#10b981',
  orange: '#f97316',
  indigo: '#6366f1',
  lime: '#84cc16',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  sky: '#0ea5e9',
  teal: '#14b8a6'
} as const;

/**
 * Configuraciones predefinidas de variables comunes
 */
export const COMMON_VARIABLES: Record<string, VariableConfig> = {
  eWasteGenerated: {
    key: 'e_waste_generated_kt_x',
    label: 'E-waste Generado (kt)',
    color: CHART_COLORS.blue
  },
  eWasteCollected: {
    key: 'e_waste_formally_collected_kt',
    label: 'E-waste Recolectado (kt)',
    color: CHART_COLORS.green
  },
  eeeOnMarket: {
    key: 'eee_put_on_market_kt',
    label: 'EEE en Mercado (kt)',
    color: CHART_COLORS.amber
  },
  collectionRate: {
    key: 'e_waste_collection_rate',
    label: 'Tasa de Recolección (%)',
    color: CHART_COLORS.purple
  },
  eWastePerCapita: {
    key: 'ewaste_generated_kg_inh',
    label: 'E-waste per cápita (kg/hab)',
    color: CHART_COLORS.red
  },
  gdpPerCapita: {
    key: 'gdp_per_capita',
    label: 'PIB per cápita ($)',
    color: CHART_COLORS.cyan
  }
};

// ============================================
// HELPERS Y UTILIDADES
// ============================================

/**
 * Tipo para funciones de transformación de datos
 */
export type DataTransformer = (data: DataPoint[]) => DataPoint[];

/**
 * Tipo para funciones de validación de datos
 */
export type DataValidator = (data: any) => data is DataPoint[];

/**
 * Configuración completa para crear un gráfico
 */
export interface CompleteChartConfig extends ConfigurableChartProps {
  /** ID único para el gráfico */
  id?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Callbacks opcionales */
  onDataLoad?: (data: DataPoint[]) => void;
  onError?: (error: string) => void;
}

// Export default solo para valores constantes (no tipos)
// Los tipos se exportan individualmente con "export type" o "export interface"
export default {
  CHART_COLORS,
  COMMON_VARIABLES
};