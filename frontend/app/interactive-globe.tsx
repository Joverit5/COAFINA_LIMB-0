"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false })

const LATAM_COUNTRIES = [
  "Mexico",
  "Guatemala",
  "Belize",
  "El Salvador",
  "Honduras",
  "Nicaragua",
  "Costa Rica",
  "Panama",
  "Colombia",
  "Venezuela",
  "Guyana",
  "Suriname",
  "French Guiana",
  "Ecuador",
  "Peru",
  "Brazil",
  "Bolivia",
  "Paraguay",
  "Chile",
  "Argentina",
  "Uruguay",
  "Cuba",
  "Jamaica",
  "Haiti",
  "Dominican Republic",
  "Puerto Rico",
  "Trinidad and Tobago",
  "Barbados",
  "Grenada",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Antigua and Barbuda",
  "Dominica",
  "Saint Kitts and Nevis",
  "Bahamas",
  "Aruba",
  "Curaçao",
  "Bonaire",
  "Martinique",
  "Guadeloupe",
]

export default function InteractiveGlobe() {
  const globeEl = useRef<any>(null)
  const [countries, setCountries] = useState({ features: [] })
  const [selectedCountry, setSelectedCountry] = useState<any>(null)

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
    )
      .then((res) => res.json())
      .then((data) => {
        // Filtrar solo países de LATAM
        const filteredData = {
          ...data,
          features: data.features.filter((feature: any) => {
            const countryName = feature.properties.NAME || feature.properties.ADMIN
            return LATAM_COUNTRIES.some(
              (latamCountry) =>
                countryName.toLowerCase().includes(latamCountry.toLowerCase()) ||
                latamCountry.toLowerCase().includes(countryName.toLowerCase()),
            )
          }),
        }
        setCountries(filteredData)
        console.log("[v0] Países cargados:", filteredData.features.length)
      })

    // Configurar rotación automática
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.3
      globeEl.current.pointOfView({ lat: -10, lng: -60, altitude: 2 })
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-[#141414]">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl=""
        backgroundColor="#141414"
        lineHoverPrecision={0}
        polygonsData={countries.features}
        polygonAltitude={(d: any) => (d === selectedCountry ? 0.12 : 0.01)}
        polygonCapColor={(d: any) => (d === selectedCountry ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)")}
        polygonSideColor={() => "rgba(255, 255, 255, 0)"}
        polygonStrokeColor={(d: any) => (d === selectedCountry ? "#ffffff" : "rgba(255, 255, 255, 0)")}
        polygonLabel={() => ""}
        onPolygonHover={() => {}}
        onPolygonClick={(polygon: any) => {
          setSelectedCountry(polygon)
        }}
        polygonsTransitionDuration={300}
        showAtmosphere={true}
        atmosphereColor="#d9d9d9"
        atmosphereAltitude={0.2}
        rendererConfig={{ antialias: false, alpha: false }}
        waitForGlobeReady={true}
        animateIn={false}
      />

      {selectedCountry && (
        <div className="absolute top-8 left-8 bg-card border border-border rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedCountry.properties.NAME || selectedCountry.properties.ADMIN}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{selectedCountry.properties.CONTINENT}</p>
        </div>
      )}
    </div>
  )
}
