## Diccionario de Variables

| **Variable** | **Descripción** | **Unidad / Formato** | **Tipo de Dato** | **Fuente / Notas** |
|--------------|----------------|----------------------|------------------|--------------------|
| Country | Nombre del país reportado en el dataset original. | Texto | Categórica nominal | Proviene de datasets originales antes de la limpieza. |
| Year | Año de referencia de los datos. | Año (YYYY) | Entero | Unificado durante el proceso de concatenación. |
| iso3 | Código del país en formato ISO 3166-1 alfa-3. | Texto (3 caracteres) | Categórica nominal | Clave estándar para hacer merges robustos. |
| Population | Población total del país en el año correspondiente. | Habitantes | Numérica continua | Usualmente del Banco Mundial u organismos estadísticos. |
| E_waste_generated_kt | Residuos electrónicos generados. | Kilotoneladas (kt) | Numérica continua | Representa el total producido en el país. |
| EEE_put_on_market_kt | Equipos eléctricos y electrónicos introducidos al mercado. | Kilotoneladas (kt) | Numérica continua | Relacionado con la futura generación de e-waste. |
| E_waste_collection_rate | Tasa de recolección formal de e-waste. | Proporción (0–1) o % | Numérica continua | Confirmar si está expresado en proporción o porcentaje. |
| E_waste_formally_collected_kt | E-waste gestionado formalmente. | Kilotoneladas (kt) | Numérica continua | Incluye flujos registrados oficialmente. |
| E_waste_imported_kt | E-waste importado al país. | Kilotoneladas (kt) | Numérica continua | Puede contener valores vacíos por no disponibilidad. |
| E_waste_exported_kt | E-waste exportado desde el país. | Kilotoneladas (kt) | Numérica continua | Puede incluir comercio informal. |
| E_waste_generated_per_capita | Residuos electrónicos por persona. | Kilogramos por habitante (kg/hab) | Numérica continua | Indicador clave de intensidad de consumo y descarte. |
| EEE_put_on_market_per_capita | Equipos eléctricos en el mercado por persona. | Kilogramos por habitante (kg/hab) | Numérica continua | Relacionado con nivel de consumo tecnológico. |
| Temperature_Exchange_Equipment_kt | Residuos de equipos de intercambio térmico. | Kilotoneladas (kt) | Numérica continua | Ej.: neveras, aires acondicionados. |
| Screens_kt | Residuos de pantallas y monitores. | Kilotoneladas (kt) | Numérica continua | Incluye monitores, televisores, pantallas planas. |
| Lamps_kt | Residuos de lámparas electrónicas. | Kilotoneladas (kt) | Numérica continua | Ej.: CFL, LED. |
| Large_Equipment_kt | Residuos de grandes electrodomésticos. | Kilotoneladas (kt) | Numérica continua | Ej.: lavadoras, estufas, fotocopiadoras grandes. |
| Small_Equipment_kt | Residuos de pequeños electrodomésticos. | Kilotoneladas (kt) | Numérica continua | Ej.: planchas, tostadoras, aspiradoras. |
| Small_IT_kt | Residuos de pequeños dispositivos de informática. | Kilotoneladas (kt) | Numérica continua | Ej.: laptops, celulares. |
| source_file | Nombre del archivo de origen. | Texto | Categórica nominal | Permite trazabilidad del merge. |
| country_clean | Nombre del país estandarizado tras limpieza. | Texto | Categórica nominal | Utilizado para emparejar con `iso3`. |
