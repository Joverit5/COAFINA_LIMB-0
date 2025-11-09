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

 - Ejecuta: uvicorn main:app --reload --port 8000
 - Para generar versiones JSON de los CSV (opcional pero recomendado):
	 - python scripts/convert_data_to_json.py
	 Esto creará en `Code/limbo/data/` los archivos `df_country_year.json`, `df_category_long.json`, `df_category_pairs.json`, `master_dataset_normalized.json` y `master_final_dataset.json`.

Próximos pasos sugeridos

- Añadir tests unitarios y CI.
- Añadir paginación y filtros más avanzados.
- Opcional: Dockerfile y despliegue.
