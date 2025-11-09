<!-- Improved compatibility of back to top link -->
<a id="readme-top"></a>

[![GitHub contributors](https://img.shields.io/github/contributors/Joverit5/COAFINA_LIMB-0)](https://github.com/Joverit5/COAFINA_LIMB-0/graphs/contributors)
![OS](https://img.shields.io/badge/OS-Linux%2C%20Windows%2C%20macOS-0078D4)
![CPU](https://img.shields.io/badge/CPU-x86%2C%20x64%2C%20ARM%2C%20ARM64-FF8C00)
[![GitHub release date](https://img.shields.io/github/release-date/Joverit5/COAFINA_LIMB-0)](#)
[![GitHub last commit](https://img.shields.io/github/last-commit/Joverit5/COAFINA_LIMB-0)](#)
![Open Source](https://img.shields.io/badge/open_source-brightgreen)
[![GitHub repo size](https://img.shields.io/github/repo-size/Joverit5/COAFINA_LIMB-0)](#)
[![GitHub forks](https://img.shields.io/github/forks/Joverit5/COAFINA_LIMB-0)](#)
[![Share](https://img.shields.io/badge/share-000000?logo=x&logoColor=white)](https://x.com/intent/tweet?text=Explora%20Limb-0%3A%20Plataforma%20open-source%20de%20e-waste%20en%20ALC%20https%3A%2F%2Fgithub.com%2FJoverit5%2FCOAFINA_LIMB-0%20%23EWaste360%20%23EconomiaCircular)
[![Share](https://img.shields.io/badge/share-1877F2?logo=facebook&logoColor=white)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/Joverit5/COAFINA_LIMB-0)
[![Share](https://img.shields.io/badge/share-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/Joverit5/COAFINA_LIMB-0)

:star: ¡Estrella el repositorio en GitHub — tu apoyo impulsa la economía circular digital!



<div align="center">
  <a href="https://github.com/Joverit5/COAFINA_LIMB-0">
    <img src="logo.png" alt="Logo" width="180" height="180">
  </a>
  <h3 align="center">Limb-0 — Visualización y análisis del flujo de e-waste en América Latina y el Caribe</h3>
  <p align="center">
    <a href="Documentación SRS Limb-0.pdf"><strong>Ver SRS 📰</strong></a>
    <br />
    <a href="https://limb-0-ewaste.vercel.app/"><strong>App web en Vercel 🌎</strong></a>
    <br />
  </p>
</div>



<details>
  <summary>📚 Tabla de contenidos</summary>
  <ol>
    <li><a href="#sobre-el-proyecto">Sobre el proyecto</a></li>
    <li><a href="#el-reto">El reto</a></li>
    <li><a href="#objetivos">Objetivos</a></li>
    <li><a href="#funcionalidades">Funcionalidades</a></li>
    <li><a href="#cumplimiento-srs">Cumplimiento SRS</a></li>
    <li><a href="#implementación">Implementación</a></li>
    <li><a href="#tecnologías">Tecnologías</a></li>
    <li><a href="#datasets">Datasets utilizados</a></li>
    <li><a href="#impacto">Impacto y estrategia</a></li>
    <li><a href="#instalación">Instalación</a></li>
    <li><a href="#contribuir">Contribuir</a></li>
    <li><a href="#contacto">Contacto</a></li>
    <li><a href="#agradecimientos">Agradecimientos</a></li>
  </ol>
</details>



## Sobre el proyecto

<div align="center">
  <img src="dashboard-preview.png" alt="Preview" width="1000">
</div>

**Limb-0** es una plataforma web *open-source* que visualiza y analiza los flujos de residuos electrónicos (e-waste) en **América Latina y el Caribe (ALC)**.  
Integra datos abiertos de [globalewaste.org](https://globalewaste.org/) y [Our World in Data](https://ourworldindata.org/ewaste) (2010-2022), ofreciendo dashboards interactivos, trazabilidad geoespacial y métricas ESG.

Desarrollada como respuesta al **Reto 3: E-Waste 360°** de **CoAfina 2025**, Limb-0 busca fortalecer la transparencia, la toma de decisiones basada en datos y la economía circular digital.



### 🧩 El reto

ALC genera más de **1.3 millones de toneladas de e-waste por año**, pero **menos del 3 %** recibe tratamiento formal.  
**Limb-0** nace para visibilizar los flujos, los puntos críticos y el valor económico recuperable, apoyando **políticas públicas sostenibles** y la **responsabilidad extendida del productor**.



### 🎯 Objetivos

**General:**  
Desarrollar una plataforma abierta que permita **monitorear, comparar y analizar** la generación, gestión y comercio de e-waste en la región.

**Específicos:**
- Mapear flujos mediante datos abiertos.
- Visualizar indicadores comparativos (toneladas, kg/hab, tasas de recolección).
- Estimar valor recuperable por metales críticos.
- Cumplir con principios FAIR y Open Data Charter.



### ⚙️ Funcionalidades

- Dashboard interactivo: mapa + KPIs + Sankey + ranking top 10.
- Filtros dinámicos (país / año).
- Escenarios “¿qué pasa si?” en tasas de recolección.
- Estimación de metales recuperables.
- Exportación CSV.
- Modal de fuentes y licencias.
- API pública documentada (FastAPI / OpenAPI).




### 🧠 Implementación

- **Frontend:** Next.js (React 18+), TypeScript 5+, Tailwind CSS.  
- **Backend:** FastAPI (Python 3.11+).  
- **Base de datos:** PostgreSQL (+ PostGIS opcional).  
- **Infraestructura:** Despliegue automatizado en **Vercel**.  
- **Procesamiento de datos:** pandas, NumPy, scikit-learn.  
- **Visualización:** Plotly, Recharts, Leaflet.



### 🧰 Tecnologías

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Plotly](https://img.shields.io/badge/Plotly-239120?style=for-the-badge&logo=plotly&logoColor=white)](https://plotly.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

## 🎬 Presentación del proyecto

[![YouTube][youtube-shield]][youtube-url]  

## 🗺️ Datasets utilizados

| Fuente | Descripción | Cobertura | Licencia |
|--------|--------------|------------|-----------|
| [Global E-waste Statistics Partnership (GESP)](https://globalewaste.org/) | Datos de generación, recolección y reciclaje formal de residuos electrónicos por país y región. | América Latina y el Caribe | CC-BY-NC 4.0 |
| [Our World in Data — E-waste Recycling (2010-2022)](https://ourworldindata.org/ewaste) | Tasa de reciclaje de e-waste y métricas globales comparativas. | Global (series 2010-2022) | CC-BY 4.0 |



## 🌎 Impacto y estrategia

- **Transparencia:** democratiza el acceso a datos ambientales.  
- **Empoderamiento:** facilita la toma de decisiones ESG basadas en evidencia.  
- **Educación:** sensibiliza sobre los impactos del e-waste y el potencial económico del reciclaje.  
- **Reproducibilidad:** alineada con principios FAIR y Open Data Charter.



## ⚙️ Instalación

```bash
git clone https://github.com/Joverit5/COAFINA_LIMB-0.git
cd COAFINA_LIMB-0
pip install -r requirements.txt
npm install
npm run dev
```
## 🚀 Despliegue (Vercel)

1. Conecta el repositorio en [vercel.com](https://vercel.com).
2. Selecciona la rama `main`.
3. Haz clic en **Deploy** (¡1 clic y listo!).



## 🤝 Contribuir

¡Tu ayuda impulsa el proyecto!

1. Haz un **fork**.  
2. Crea tu rama (`git checkout -b feature/xyz`).  
3. Commit: `git commit -m 'Agrega nueva funcionalidad'`.  
4. Push y abre un **Pull Request**.



## Top contributors:

<a href="https://github.com/Joverit5/NASA-SPATIUM/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Joverit5/NASA-SPATIUM" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->
## License

Este proyecto está licenciado bajo la licencia MIT. Consulte `LICENSE.txt` para obtener más información.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📬 Contacto

**Equipo Limb-0 (CoAfina 2025)**    
- José Gonzalez - [joseortiz@utb.edu.co](mailto:joseortiz@utb.edu.co)  
- Fabian Quintero - [parejaf@utb.edu.co](mailto:parejaf@utb.edu.co)  
- Santiago Quintero - [squintero@utb.edu.co](mailto:squintero@utb.edu.co)  
- Eduardo Negrin - [enegrin@utb.edu.co](mailto:enegrin@utb.edu.co)  
- Isabella Arrieta - [arrietai@utb.edu.co](mailto:arrietai@utb.edu.co)  


📂 Repositorio: [https://github.com/Joverit5/COAFINA_LIMB-0](https://github.com/Joverit5/COAFINA_LIMB-0)



## 🙌 Agradecimientos

- [Global E-waste Statistics Partnership](https://globalewaste.org)  
- [Our World in Data](https://ourworldindata.org/ewaste)  
- **CoAfina 2025** — Reto 3: *E-Waste 360°*  
- Comunidad open data latinoamericana 🌎  



<p align="right">(<a href="#readme-top">⬆️ volver arriba</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[youtube-shield]: https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube
[youtube-url]: https://youtu.be/4QGIdWIk018