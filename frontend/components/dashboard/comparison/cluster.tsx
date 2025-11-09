import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import gsap from 'gsap';

// Datos de clustering basados en el análisis
const clusterData = [
  { country: 'Bolivia', cluster: 0, gdp: 9110, ewaste: 4.7, eee: 7.5, formal: 0.15, growth: 85, clusterName: 'Andinos Emergentes' },
  { country: 'Ecuador', cluster: 0, gdp: 11878, ewaste: 5.1, eee: 7.5, formal: 0.18, growth: 85, clusterName: 'Andinos Emergentes' },
  { country: 'Perú', cluster: 0, gdp: 13416, ewaste: 6.0, eee: 7.5, formal: 0.18, growth: 85, clusterName: 'Andinos Emergentes' },
  { country: 'Chile', cluster: 1, gdp: 25154, ewaste: 7.9, eee: 13.4, formal: 0.35, growth: 59, clusterName: 'Avanzados' },
  { country: 'Costa Rica', cluster: 1, gdp: 20443, ewaste: 13.2, eee: 15.4, formal: 0.40, growth: 59, clusterName: 'Avanzados' },
  { country: 'Panamá', cluster: 1, gdp: 32850, ewaste: 8.6, eee: 15.2, formal: 0.38, growth: 59, clusterName: 'Avanzados' },
  { country: 'Uruguay', cluster: 1, gdp: 24006, ewaste: 12.0, eee: 14.8, formal: 0.36, growth: 59, clusterName: 'Avanzados' },
  { country: 'Venezuela', cluster: 1, gdp: 17527, ewaste: 9.5, eee: 9.9, formal: 0.35, growth: 59, clusterName: 'Avanzados' },
  { country: 'Argentina', cluster: 2, gdp: 23040, ewaste: 7.7, eee: 7.0, formal: 0.30, growth: 24, clusterName: 'Estancado' },
  { country: 'El Salvador', cluster: 3, gdp: 9164, ewaste: 5.0, eee: 7.5, formal: 0.08, growth: 48, clusterName: 'Centroamericanos Básicos' },
  { country: 'Guatemala', cluster: 3, gdp: 17667, ewaste: 2.9, eee: 4.7, formal: 0.07, growth: 48, clusterName: 'Centroamericanos Básicos' },
  { country: 'Honduras', cluster: 3, gdp: 5981, ewaste: 2.6, eee: 2.9, formal: 0.06, growth: 48, clusterName: 'Centroamericanos Básicos' },
  { country: 'Nicaragua', cluster: 3, gdp: 1905, ewaste: 2.5, eee: 3.2, formal: 0.07, growth: 48, clusterName: 'Centroamericanos Básicos' },
];

const clusterColors = {
  0: '#FF6B9D', // Flamingo (Andinos Emergentes)
  1: '#74C365', // Green (Avanzados)
  2: '#F59E0B', // Amber (Estancado)
  3: '#8B5CF6', // Purple (Centroamericanos)
};

const clusterInfo = [
  {
    id: 0,
    name: 'Andinos Emergentes',
    countries: ['Bolivia', 'Ecuador', 'Perú'],
    characteristics: [
      'GDP per cápita medio-bajo (~$11,468 USD)',
      'Crecimiento de e-waste del +85% (2009-2019)',
      'Alto enfoque en small equipment (40%)',
      'Baja tasa de recolección formal (3%)',
      'En fase de transición económica'
    ],
    color: clusterColors[0]
  },
  {
    id: 1,
    name: 'Avanzados',
    countries: ['Chile', 'Costa Rica', 'Panamá', 'Uruguay', 'Venezuela'],
    characteristics: [
      'GDP per cápita alto (~$23,996 USD)',
      'Mayor volumen de consumo (13.74 kg/hab EEE)',
      'Mejor gestión relativa (0.37 kg/hab formal)',
      'Crecimiento +59% pero más estable',
      'Balance en categorías durables y desechables'
    ],
    color: clusterColors[1]
  },
  {
    id: 2,
    name: 'Estancado',
    countries: ['Argentina'],
    characteristics: [
      'Outlier económico afectado por crisis',
      'GDP alto pero consumo bajo (7 kg/hab EEE)',
      'Declive en EEE colocado (-8%)',
      'Crecimiento mínimo (+24%)',
      'Patrones de consumo estables pero no innovadores'
    ],
    color: clusterColors[2]
  },
  {
    id: 3,
    name: 'Centroamericanos Básicos',
    countries: ['El Salvador', 'Guatemala', 'Honduras', 'Nicaragua'],
    characteristics: [
      'GDP per cápita bajo (~$8,679 USD)',
      'Menor volumen (4.58 kg/hab EEE)',
      'Gestión muy deficiente (0.07 kg/hab formal)',
      'Crecimiento moderado (+48%)',
      'Énfasis en necesidades básicas'
    ],
    color: clusterColors[3]
  }
];

// Componente: Card de Cluster
const ClusterCard = ({ cluster, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: 'power2.out' }
      );
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-woodsmoke-900/60 backdrop-blur-sm border-2 rounded-none p-6 opacity-0"
      style={{ borderColor: cluster.color }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: cluster.color }}
        />
        <h3 className="font-unbounded text-xl text-white">{cluster.name}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="font-sans text-sm text-white/60 mb-2">Países:</p>
          <div className="flex flex-wrap gap-2">
            {cluster.countries.map((country) => (
              <span
                key={country}
                className="px-3 py-1 bg-white/5 border border-white/10 font-mono text-xs text-white"
              >
                {country}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="font-sans text-sm text-white/60 mb-2">Características:</p>
          <ul className="space-y-1">
            {cluster.characteristics.map((char, i) => (
              <li key={i} className="font-sans text-sm text-white/80 flex items-start">
                <span className="text-flamingo-400 mr-2">•</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Componente: Gráfico de Comparación
const ComparisonChart = ({ selectedMetric }) => {
  const chartData = clusterData.map(d => ({
    country: d.country,
    value: d[selectedMetric],
    cluster: d.cluster
  })).sort((a, b) => b.value - a.value);

  const metricLabels = {
    gdp: 'GDP per cápita (USD)',
    ewaste: 'E-Waste generado (kg/hab)',
    eee: 'EEE colocado (kg/hab)',
    formal: 'Recolección formal (kg/hab)',
    growth: 'Crecimiento e-waste (%)'
  };

  return (
    <div className="bg-woodsmoke-900/40 backdrop-blur-sm border-2 border-white/10 p-6">
      <h3 className="font-unbounded text-lg text-white mb-4">
        {metricLabels[selectedMetric]}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis
            dataKey="country"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#ffffff80', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#ffffff80', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #ffffff20',
              borderRadius: 0
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar dataKey="value" radius={[0, 0, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente: Scatter Plot (E-waste vs GDP)
const ScatterAnalysis = () => {
  return (
    <div className="bg-woodsmoke-900/40 backdrop-blur-sm border-2 border-white/10 p-6">
      <h3 className="font-unbounded text-lg text-white mb-4">
        Relación E-Waste vs GDP per cápita
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis
            dataKey="gdp"
            name="GDP"
            tick={{ fill: '#ffffff80', fontSize: 12 }}
            label={{ value: 'GDP per cápita (USD)', position: 'insideBottom', offset: -10, fill: '#ffffff60' }}
          />
          <YAxis
            dataKey="ewaste"
            name="E-Waste"
            tick={{ fill: '#ffffff80', fontSize: 12 }}
            label={{ value: 'E-Waste (kg/hab)', angle: -90, position: 'insideLeft', fill: '#ffffff60' }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #ffffff20',
              borderRadius: 0
            }}
            formatter={(value, name) => [value, name === 'gdp' ? 'GDP' : 'E-Waste']}
          />
          <Scatter data={clusterData} fill="#8884d8">
            {clusterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="font-sans text-sm text-white/60 mt-4">
        Se observa una correlación positiva entre GDP y generación de e-waste, 
        con los países avanzados (azul) mostrando mayor consumo y residuos per cápita.
      </p>
    </div>
  );
};

// Componente: Sección de Insights
const InsightsSection = () => {
  const insights = [
    {
      title: 'Curva de Kuznets Ambiental',
      content: 'Los países de bajo GDP generan menos e-waste pero con peor gestión (recolección <3%). Los emergentes aumentan contaminación con crecimiento (+85%). Los avanzados mejoran gestión pero escalan riesgos por volumen.',
      icon: '📈'
    },
    {
      title: 'Tendencias Temporales',
      content: 'Crecimiento promedio de e-waste del +54% (2009-2019) en la región. Bolivia pasó de 2.4 a 4.7 kg/hab, mientras Chile de 3.9 a 7.9 kg/hab, reflejando diferentes etapas de desarrollo.',
      icon: '⏱️'
    },
    {
      title: 'Composición Categórica',
      content: 'Small equipment domina en clusters bajos (35-40%, dispositivos desechables), mientras temperature/large equipment prevalece en avanzados (20-28%, electrodomésticos duraderos).',
      icon: '📱'
    },
    {
      title: 'Riesgos Ambientales',
      content: 'Baja recolección formal expone a 1-3 kg/hab de plásticos y BFRs no gestionados anualmente. Los países avanzados tienen mayor exposición tóxica por volumen (2.9 kg/hab plásticos).',
      icon: '⚠️'
    },
    {
      title: 'Brecha con Estándares Globales',
      content: 'LATAM genera ~6 kg/hab vs 7.3 kg/hab global (ONU 2019), pero su tasa de recolección (1-5%) está muy por debajo del promedio mundial (17%).',
      icon: '🌍'
    },
    {
      title: 'Oportunidades de Política',
      content: 'Cluster 0: Invertir en infraestructura (meta 10% recolección). Cluster 1: Escalar sistemas formales con tecnología. Cluster 3: Campañas educativas rurales. Cluster 2: Incentivos para importación sostenible.',
      icon: '🎯'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="bg-woodsmoke-900/60 backdrop-blur-sm border-2 border-white/10 p-6"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{insight.icon}</span>
            <div>
              <h4 className="font-unbounded text-base text-white mb-2">
                {insight.title}
              </h4>
              <p className="font-sans text-sm text-white/70 leading-relaxed">
                {insight.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente Principal
export default function AnalysisComparison() {
  const [selectedMetric, setSelectedMetric] = useState('ewaste');
  const [activeTab, setActiveTab] = useState('clusters');

  const tabs = [
    { id: 'clusters', label: 'Clusters' },
    { id: 'comparison', label: 'Comparación' },
    { id: 'scatter', label: 'Correlación' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-woodsmoke-900/80 backdrop-blur-sm border-2 border-flamingo-400/20 p-8">
        <h1 className="font-unbounded text-3xl text-white mb-3">
          Análisis de Clustering: E-Waste en LATAM
        </h1>
        <p className="font-sans text-base text-white/70 max-w-3xl">
          Clasificación de 13 países LATAM según patrones de desarrollo socioeconómico, 
          consumo de equipos eléctricos y electrónicos (EEE), generación de residuos 
          electrónicos (e-waste) y gestión ambiental (2009-2019).
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b-2 border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-unbounded text-sm px-6 py-3 transition-colors ${
              activeTab === tab.id
                ? 'bg-flamingo-400 text-woodsmoke-950 border-2 border-flamingo-400'
                : 'bg-woodsmoke-900/40 text-white/60 border-2 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'clusters' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clusterInfo.map((cluster, index) => (
              <ClusterCard key={cluster.id} cluster={cluster} index={index} />
            ))}
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-woodsmoke-900/60 backdrop-blur-sm border-2 border-white/10 p-4">
              <label className="font-unbounded text-sm text-white/80 mb-3 block">
                Selecciona métrica:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ewaste', label: 'E-Waste' },
                  { id: 'eee', label: 'EEE' },
                  { id: 'gdp', label: 'GDP' },
                  { id: 'formal', label: 'Recolección' },
                  { id: 'growth', label: 'Crecimiento' }
                ].map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`px-4 py-2 font-sans text-sm transition-colors ${
                      selectedMetric === metric.id
                        ? 'bg-flamingo-400 text-woodsmoke-950'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
            <ComparisonChart selectedMetric={selectedMetric} />
          </div>
        )}

        {activeTab === 'scatter' && <ScatterAnalysis />}

        {activeTab === 'insights' && <InsightsSection />}
      </div>

      {/* Metodología */}
      <div className="bg-woodsmoke-900/40 backdrop-blur-sm border-2 border-white/10 p-6">
        <h3 className="font-unbounded text-lg text-white mb-4">
          Metodología de Clustering
        </h3>
        <div className="space-y-3 font-sans text-sm text-white/70">
          <p>
            <strong className="text-white">Algoritmo:</strong> K-Means con k=4 clusters, 
            validado mediante el método del codo (inercia se aplana en k=3-4).
          </p>
          <p>
            <strong className="text-white">Variables:</strong> ~27 características numéricas 
            incluyendo indicadores económicos (GDP), demográficos (tamaño hogares), volumétricos 
            (e-waste/EEE per cápita), categorías de residuos (temperature equipment, screens, etc.) 
            y agregados temporales (media, std, crecimiento 2009-2019).
          </p>
          <p>
            <strong className="text-white">PCA:</strong> Reducción a 3 componentes capturando 
            ~65.5% de varianza. PC1 (38.9%) mide madurez de mercado, PC2 (15.0%) dinámicas de 
            transición, PC3 (11.6%) riesgos ambientales específicos.
          </p>
          <p>
            <strong className="text-white">Fuente de datos:</strong> Dataset unificado de 
            múltiples hojas Excel con estadísticas por país y año (2009-2019).
          </p>
        </div>
      </div>
    </div>
  );
}