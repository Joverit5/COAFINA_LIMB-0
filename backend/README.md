# Backend FastAPI para COAFINA - MVP E-Waste

Este backend expone endpoints pensados para alimentar las visualizaciones descritas en el documento de producto. Está pensado como MVP para uso local y pruebas.

Ubicación de los datos (usados por defecto): `../data/master_final_dataset.csv` (desde `Code/limbo/backend`).

Instalación rápida

1. Crear un virtualenv e instalar dependencias:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

2. Ejecutar servidor (desarrollo):

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

OpenAPI / Swagger estará disponible en `http://127.0.0.1:8000/docs`.

Supuestos metodológicos importantes

- `value_recoverable_usd`: se calcula con una suposición simple: fracción recuperable de metales y precio medio por tonelada recuperada. Estos parámetros son configurables en `utils.py`. Se documenta y puede ajustarse.

Qué incluye este directorio

- `main.py`: app FastAPI con endpoints principales.
- `data_loader.py`: carga y normaliza CSVs.
- `schemas.py`: modelos Pydantic para respuestas.
- `utils.py`: utilidades (cálculos, normalizaciones).

Próximos pasos sugeridos

- Añadir tests unitarios y CI.
- Añadir paginación y filtros más avanzados.
- Opcional: Dockerfile y despliegue.
