import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Tipos de datos
interface DataPoint {
  [key: string]: any;
}

// Configuración de una variable a graficar
interface VariableConfig {
  key: string;           // Nombre de la propiedad en los datos
  label: string;         // Nombre para mostrar en la leyenda
  color: string;         // Color de la línea/barra
}

// Props del componente
interface ConfigurableChartProps {
  endpoint: string;                          // URL del endpoint
  chartType: 'line' | 'bar' | 'area' | 'scatter' | 'pie';  // Tipo de gráfico
  xAxisKey: string;                          // Variable para el eje X
  variables: VariableConfig[];               // Variables a graficar
  title: string;                             // Título del gráfico
  placeholder?: string;                      // Placeholder del input
  subtitle?: string;                         // Subtítulo opcional
  height?: number;                           // Altura del gráfico (default: 400)
  autoLoad?: boolean;                        // Cargar automáticamente al montar
  filters?: { [key: string]: any };         // Filtros para los datos
  transformData?: (data: any[]) => any[];   // Función para transformar datos
}

// Componente de Tooltip personalizado con estilo oscuro elegante
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-none border-2 border-white/10 overflow-hidden bg-woodsmoke-950/40 backdrop-blur-sm shadow-2xl min-w-[12rem]">
      {/* Header - similar a TableHead */}
      {label && (
        <div className="bg-transparent border-b-2 border-white/10 px-4 py-2">
          <div className="font-unbounded text-xs text-white uppercase tracking-wider">
            {label}
          </div>
        </div>
      )}
      
      {/* Body - similar a TableBody */}
      <div>
        {payload.map((entry: any, index: number) => (
          <div
            key={`tooltip-item-${index}`}
            className="border-b border-white/5 hover:bg-white/5 transition-colors px-4 py-3 last:border-b-0"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Columna izquierda - Indicador + Métrica */}
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="h-2.5 w-2.5 rounded-[2px] shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-sans text-sm text-white/80">
                  {entry.name}
                </span>
              </div>
              
              {/* Columna derecha - Valor */}
              <span className="font-mono text-sm text-flamingo-400 font-medium text-right tabular-nums whitespace-nowrap">
                {typeof entry.value === 'number'
                  ? entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfigurableChart: React.FC<ConfigurableChartProps> = ({
  endpoint,
  chartType = 'line',
  xAxisKey,
  variables,
  title,
  placeholder = 'La URL del endpoint está configurada internamente',
  subtitle,
  height = 400,
  autoLoad = false,
  filters,
  transformData
}) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showEndpoint, setShowEndpoint] = useState<boolean>(false);

  // Cargar datos automáticamente si está configurado
  useEffect(() => {
    if (autoLoad) {
      fetchData();
    }
  }, [autoLoad, endpoint]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      let data = await response.json();

      // Si los datos no son array, intentar convertirlos
      if (!Array.isArray(data)) {
        if (data.data && Array.isArray(data.data)) {
          data = data.data;
        } else if (data.results && Array.isArray(data.results)) {
          data = data.results;
        } else {
          throw new Error('El formato de datos no es válido');
        }
      }

      // Aplicar filtros si existen
      if (filters) {
        data = data.filter((item: DataPoint) => {
          return Object.entries(filters).every(([key, value]) => {
            return item[key] === value;
          });
        });
      }

      // Aplicar transformación personalizada si existe
      if (transformData) {
        data = transformData(data);
      }

      if (data.length === 0) {
        throw new Error('No se encontraron datos con los filtros aplicados');
      }

      setChartData(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al obtener los datos');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar el gráfico según el tipo
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {variables.map((variable) => (
              <Line
                key={variable.key}
                type="monotone"
                dataKey={variable.key}
                name={variable.label}
                stroke={variable.color}
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {variables.map((variable) => (
              <Bar
                key={variable.key}
                dataKey={variable.key}
                name={variable.label}
                fill={variable.color}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {variables.map((variable) => (
              <Area
                key={variable.key}
                type="monotone"
                dataKey={variable.key}
                name={variable.label}
                stroke={variable.color}
                fill={variable.color}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {variables.map((variable) => (
              <Scatter
                key={variable.key}
                name={variable.label}
                dataKey={variable.key}
                fill={variable.color}
              />
            ))}
          </ScatterChart>
        );

      case 'pie':
        // Para pie chart, usamos solo la primera variable
        const pieData = chartData.map((item) => ({
          name: item[xAxisKey],
          value: item[variables[0].key]
        }));
        
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={variables[0]?.color || `hsl(${(index * 360) / pieData.length}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-600">{subtitle}</p>
            )}
          </div>

          {/* Control Panel */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Endpoint configurado
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={showEndpoint ? endpoint : placeholder}
                    disabled
                    className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  />
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
                  >
                    {loading ? '⏳ Cargando...' : '🔄 Actualizar'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEndpoint(!showEndpoint)}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              {showEndpoint ? '🔒 Ocultar endpoint' : '👁️ Mostrar endpoint'}
            </button>

            {/* Info de configuración */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">Tipo de gráfico</p>
                <p className="text-lg font-bold text-blue-600 capitalize">{chartType}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-green-900">Eje X</p>
                <p className="text-lg font-bold text-green-600">{xAxisKey}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-purple-900">Variables</p>
                <p className="text-lg font-bold text-purple-600">{variables.length}</p>
              </div>
            </div>

            {/* Listado de variables */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Variables a graficar:
              </p>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <span
                    key={variable.key}
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: variable.color }}
                  >
                    {variable.label} ({variable.key})
                  </span>
                ))}
              </div>
            </div>

            {filters && Object.keys(filters).length > 0 && (
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  🔍 Filtros aplicados:
                </p>
                <div className="space-y-1">
                  {Object.entries(filters).map(([key, value]) => (
                    <p key={key} className="text-sm text-amber-800">
                      <strong>{key}:</strong> {String(value)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-800">
                <strong>❌ Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Visualización de Datos
              </h2>
              <ResponsiveContainer width="100%" height={height}>
                {renderChart() as React.ReactElement}
              </ResponsiveContainer>

              {/* Data Summary */}
              <div className="mt-6 p-4 bg-white rounded-lg shadow">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  📊 Resumen de datos
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-600">Registros</p>
                    <p className="text-xl font-bold text-slate-800">{chartData.length}</p>
                  </div>
                  {variables.map((variable) => {
                    const values = chartData
                      .map((item) => item[variable.key])
                      .filter((v) => typeof v === 'number');
                    
                    if (values.length === 0) return null;

                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    
                    return (
                      <div key={variable.key}>
                        <p className="text-xs text-slate-600">
                          Promedio {variable.label}
                        </p>
                        <p className="text-xl font-bold text-slate-800">
                          {avg.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {chartData.length === 0 && !loading && !error && (
            <div className="text-center py-16 text-slate-400">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-lg font-medium">No hay datos para mostrar</p>
              <p className="text-sm mt-2">Presiona el botón Actualizar para cargar los datos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurableChart;