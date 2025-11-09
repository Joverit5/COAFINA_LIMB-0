from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import io
import pandas as pd
import numpy as np
from fastapi.encoders import jsonable_encoder

from data_loader import (
    load_df_country_year,
    load_df_category_long,
    load_df_category_pairs,
    load_master_normalized,
    load_master_final_fallback,
)
from schemas import (
    ChoroplethEntry,
    KPIStats,
    KPIStatsBulk,
    TimeSeriesPoint,
    Percapita,
    Ton,
    CategoryBreakdown,
    SankeyNodes,
    ColectionRate,
    Recolection,
    PlacedMarket,
    ScatterPoint,
    ScenarioResult,
)
from utils import value_recoverable_usd_from_kt

app = FastAPI(title="COAFINA E-Waste API", version="0.1")

# Habilitar CORS para permitir peticiones desde el frontend durante desarrollo
# Ajusta `allow_origins` a orígenes específicos en producción si lo deseas.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ewaste/ton", response_model=List[Ton])
def tonelada(country: str = Query(...)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country")
    out = []
    for _, r in sel.sort_values(by='year').iterrows():
        out.append(
            {
                'country': _clean_value(r.get('country')),
                'year': int(r.get('year')) if pd.notna(r.get('year')) else None,
                'e_waste_generated_kt': _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt')),
            }
        )
    return out

@app.get("/ewaste/percapita", response_model=List[Percapita])
def percapita(country:str = Query(...)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country")
    out = []
    for _, r in sel.sort_values(by='year').iterrows():
        out.append(
            {
                'country': _clean_value(r.get('country')),
                'year': int(r.get('year')) if pd.notna(r.get('year')) else None,
                'e_waste_generated_per_capita': _safe_float(r.get('ewaste_generated_kg_inh') or r.get('E_waste_generated_per_capita') or r.get('e_waste_generated_per_capita')),
                'gdp_per_capita': _safe_float(r.get('gdp_per_capita') or r.get('GDP_per_capita')),
            }
        )
    return out

@app.get("/ewaste/formal_recolect", response_model=List[Recolection])
def formal_recolect(country:str = Query(...)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country")
    out = []
    for _, r in sel.sort_values(by='year').iterrows():
        out.append(
            {
                'country': _clean_value(r.get('country')),
                'year': int(r.get('year')) if pd.notna(r.get('year')) else None,
                'e_waste_formally_collected_kt': _safe_float(r.get('e_waste_formally_collected_kt') or r.get('E_waste_formally_collected_kt') or r.get('ewaste_formally_collected_kg_inh')),
            }
        )
    return out

@app.get("/ewaste/placed_market", response_model=List[PlacedMarket])
def placed_market(country: str = Query(...)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country")
    out = []
    for _, r in sel.sort_values(by='year').iterrows():
        out.append(
            {
                'country': _clean_value(r.get('country')),
                'year': int(r.get('year')) if pd.notna(r.get('year')) else None,
                'eee_placed_on_market_kg_inh': _safe_float(r.get('eee_placed_on_market_kg_inh') or r.get('EEE_placed_on_market_kg_inh')),
            }
        )
    return out

@app.get("/ewaste/colection_rate", response_model=List[ColectionRate])
def colection_rate(country: str = Query(...)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country")
    out = []
    for _, r in sel.sort_values(by='year').iterrows():
        out.append(
            {
                'country': _clean_value(r.get('country')),
                'year': int(r.get('year')) if pd.notna(r.get('year')) else None,
                'e_waste_collection_rate': _safe_float(r.get('e_waste_collection_rate') or r.get('E_waste_collection_rate') or r.get('ewaste_management_collection_rate')),
            }
        )
    return out

@app.get("/ewaste/choropleth", response_model=List[ChoroplethEntry])
def choropleth(year: Optional[int] = Query(None, description="Año (ej: 2018)")):
    df = load_df_country_year()
    if df.empty:
        # fallback
        df = load_master_normalized()
    if year is not None:
        df = df[df['year'] == year]
    # Seleccionar columnas clave
    out = []
    for _, r in df.iterrows():
        out.append(
            {
                'country': _clean_value(r.get('country')),
                'country_clean': _clean_value(r.get('country_clean')),
                'iso3': _clean_value(r.get('iso3')),
                'year': int(r['year']) if pd.notna(r.get('year')) else None,
                'e_waste_generated_per_capita': _safe_float(r.get('ewaste_generated_kg_inh') or r.get('E_waste_generated_per_capita') or r.get('e_waste_generated_per_capita')),
                'e_waste_generated_kt': _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt')),
                'e_waste_collection_rate': _safe_float(r.get('e_waste_collection_rate') or r.get('E_waste_collection_rate') or r.get('ewaste_management_collection_rate')),
            }
        )
    return out


def _safe_float(v):
    try:
        if pd.isna(v):
            return None
        return float(v)
    except Exception:
        return None


def _clean_value(v):
    """Convierte valores pandas/numpy a tipos Python serializables por JSON.

    - NaN / pd.NA -> None
    - numpy scalars -> native python via .item()
    """
    try:
        if pd.isna(v):
            return None
    except Exception:
        pass
    if isinstance(v, (np.generic,)):
        try:
            return v.item()
        except Exception:
            return v
    return v


@app.get("/ewaste/stats", response_model=KPIStats)
def ewaste_stats(country: str = Query(...), year: Optional[int] = Query(None)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if year is not None:
        sel = sel[sel['year'] == year]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country/year")
    r = sel.iloc[0]
    ekt = _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt') or r.get('e_waste_generated_kt_x') or r.get('e_waste_generated_kt_y'))
    percap = _safe_float(r.get('ewaste_generated_kg_inh') or r.get('E_waste_generated_per_capita') or r.get('e_waste_generated_per_capita'))
    coll_rate = _safe_float(r.get('e_waste_collection_rate') or r.get('E_waste_collection_rate') or r.get('ewaste_management_collection_rate'))
    formally_kt = _safe_float(r.get('e_waste_formally_collected_kt') or r.get('E_waste_formally_collected_kt') or r.get('ewaste_formally_collected_kg_inh'))
    value = value_recoverable_usd_from_kt(ekt)
    return {
        'country': r.get('country'),
        'year': int(r['year']) if pd.notna(r.get('year')) else None,
        'e_waste_generated_kt': ekt,
        'e_waste_generated_per_capita': percap,
        'e_waste_collection_rate': coll_rate,
        'e_waste_formally_collected_kt': formally_kt,
        'value_recoverable_usd': value,
    }


@app.get("/ewaste/stats_multiple", response_model=KPIStatsBulk)
def ewaste_stats_multiple(countries: List[str] = Query(..., description="Lista de países (repetir parámetro para varios)"), year: Optional[int] = Query(None)):
    """Devuelve estadísticas (KPI) para varios países en una sola llamada.

    Parámetros:
    - countries: lista de nombres de países (repetir ?countries=Pais1&countries=Pais2)
    - year: opcional, filtrar por año

    Respuesta:
    - rows: lista de KPIStats para los países encontrados
    - missing: lista de países que no se encontraron en los datos
    """
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()

    rows = []
    missing = []
    for country in countries:
        sel = df[df['country'].str.lower() == country.lower()]
        if year is not None:
            sel = sel[sel['year'] == year]
        if sel.empty:
            missing.append(country)
            continue
        r = sel.iloc[0]
        ekt = _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt') or r.get('e_waste_generated_kt_x') or r.get('e_waste_generated_kt_y'))
        percap = _safe_float(r.get('ewaste_generated_kg_inh') or r.get('E_waste_generated_per_capita') or r.get('e_waste_generated_per_capita'))
        coll_rate = _safe_float(r.get('e_waste_collection_rate') or r.get('E_waste_collection_rate') or r.get('ewaste_management_collection_rate'))
        formally_kt = _safe_float(r.get('e_waste_formally_collected_kt') or r.get('E_waste_formally_collected_kt') or r.get('ewaste_formally_collected_kg_inh'))
        value = value_recoverable_usd_from_kt(ekt)
        rows.append({
            'country': r.get('country'),
            'year': int(r['year']) if pd.notna(r.get('year')) else None,
            'e_waste_generated_kt': ekt,
            'e_waste_generated_per_capita': percap,
            'e_waste_collection_rate': coll_rate,
            'e_waste_formally_collected_kt': formally_kt,
            'value_recoverable_usd': value,
        })

    return jsonable_encoder({"rows": rows, "missing": missing})


@app.get("/ewaste/time_series", response_model=List[TimeSeriesPoint])
def time_series(country: str = Query(...)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country")
    rows = []
    if isinstance(sel, pd.Series):
        sel = sel.to_frame().T
    for _, r in sel.sort_values(by='year').iterrows():
        rows.append({
            'year': int(r['year']) if pd.notna(r.get('year')) else None,
            'ewaste_generated_kg_inh': _safe_float(r.get('ewaste_generated_kg_inh') or r.get('ewaste_generated_kg_inh')),
            'eee_placed_on_market_kg_inh': _safe_float(r.get('eee_placed_on_market_kg_inh') or r.get('eee_placed_on_market_kg_inh')),
        })
    return rows


@app.get("/ewaste/time_series_full")
def time_series_full(country: str = Query(...)):
    """Devuelve una serie temporal ampliada por país con varias métricas si están disponibles.

    Campos devueltos por fila (si existen en el dataset):
    - year
    - e_waste_generated_kt
    - ewaste_generated_kg_inh
    - eee_placed_on_market_kg_inh
    - e_waste_collection_rate
    - e_waste_formally_collected_kt
    - value_recoverable_usd (calculado)
    """
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country")
    out = []
    if isinstance(sel, pd.Series):
        sel = sel.to_frame().T
    for _, r in sel.sort_values('year').iterrows():
        ekt = _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt'))
        percap = _safe_float(r.get('ewaste_generated_kg_inh') or r.get('E_waste_generated_per_capita') or r.get('e_waste_generated_per_capita'))
        market = _safe_float(r.get('eee_placed_on_market_kg_inh') or r.get('eee_placed_on_market_kg_inh'))
        coll = _safe_float(r.get('e_waste_collection_rate') or r.get('E_waste_collection_rate') or r.get('ewaste_management_collection_rate'))
        formally = _safe_float(r.get('e_waste_formally_collected_kt') or r.get('E_waste_formally_collected_kt') or r.get('ewaste_formally_collected_kg_inh'))
        value = value_recoverable_usd_from_kt(ekt) if ekt is not None else None
        out.append({
            'year': int(r['year']) if pd.notna(r.get('year')) else None,
            'e_waste_generated_kt': ekt,
            'ewaste_generated_kg_inh': percap,
            'eee_placed_on_market_kg_inh': market,
            'e_waste_collection_rate': coll,
            'e_waste_formally_collected_kt': formally,
            'value_recoverable_usd': value,
        })
    return out


@app.get("/ewaste/categories", response_model=CategoryBreakdown)
def categories(country: str = Query(...), year: Optional[int] = Query(None)):
    # usar la tabla larga de categorías
    cat = load_df_category_long()
    if cat.empty:
        # fallback a master normalizado
        master = load_master_normalized()
        if master.empty:
            raise HTTPException(status_code=404, detail="No category data available")
        # intentar construir respuesta desde master_normalized agrupando
        sel = master[master['country'].str.lower() == country.lower()]
        if year is not None:
            sel = sel[sel['year'] == year]
        if sel.empty:
            raise HTTPException(status_code=404, detail="No data for country/year")
        r = sel.iloc[0]
        return {
            'country': r.get('country'),
            'year': int(r['year']) if pd.notna(r.get('year')) else None,
            'temperature_exchange_equipment_kt': _safe_float(r.get('temperature_exchange_equipment_kt') or r.get('temperature_exchange_equipment_kt')),
            'screens_kt': _safe_float(r.get('screens_kt') or r.get('screens_kt')),
            'lamps_kt': _safe_float(r.get('lamps_kt') or r.get('lamps_kt')),
            'large_equipment_kt': _safe_float(r.get('large_equipment_kt') or r.get('large_equipment_kt')),
            'small_equipment_kt': _safe_float(r.get('small_equipment_kt') or r.get('small_equipment_kt')),
            'small_it_kt': _safe_float(r.get('small_it_kt') or r.get('small_it_kt')),
        }
    # filtrar por país/año y pivotar
    sel = cat[cat['country'].str.lower() == country.lower()]
    if year is not None:
        sel = sel[sel['year'] == year]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country/year")
    pivot = sel.pivot_table(index=['country', 'year'], columns='category', values='kt', aggfunc='first')
    row = pivot.reset_index().iloc[0]
    return {
        'country': row['country'],
        'year': int(row['year']) if pd.notna(row.get('year')) else None,
        'temperature_exchange_equipment_kt': _safe_float(row.get('temperature_exchange_equipment_kt')),
        'screens_kt': _safe_float(row.get('screens_kt')),
        'lamps_kt': _safe_float(row.get('lamps_kt')),
        'large_equipment_kt': _safe_float(row.get('large_equipment_kt')),
        'small_equipment_kt': _safe_float(row.get('small_equipment_kt')),
        'small_it_kt': _safe_float(row.get('small_it_kt')),
    }


@app.get("/ewaste/sankey", response_model=SankeyNodes)
def sankey(country: str = Query(...), year: Optional[int] = Query(None)):
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
    sel = df[df['country'].str.lower() == country.lower()]
    if year is not None:
        sel = sel[sel['year'] == year]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country/year")
    r = sel.iloc[0]
    generated = _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt') or r.get('e_waste_generated_kt_x') or r.get('e_waste_generated_kt_y') or 0.0) or 0.0
    formal = _safe_float(r.get('e_waste_formally_collected_kt') or r.get('E_waste_formally_collected_kt') or r.get('ewaste_formally_collected_kg_inh') or 0.0) or 0.0
    exported = _safe_float(r.get('e_waste_exported_kt') or r.get('E_waste_exported_kt') or 0.0) or 0.0
    imported = _safe_float(r.get('e_waste_imported_kt') or r.get('E_waste_imported_kt') or 0.0) or 0.0
    informal = generated - formal - exported + imported
    informal = float(max(informal, 0.0))
    return {
        'generated_kt': generated,
        'formally_collected_kt': formal,
        'exported_kt': exported,
        'imported_kt': imported,
        'informal_kt': informal,
    }


@app.get("/ewaste/heatmap")
def heatmap(year: Optional[int] = Query(None), metric: str = Query("share", description="'share' or 'kt'")):
    """Devuelve por país y año la matriz de categorías para heatmap.

    - metric='kt' devuelve los valores en kt para cada categoría.
    - metric='share' devuelve la fracción respecto a e_waste_generated_kt (0-1) para cada categoría.
    """
    # Prefer the long-format category table (one row per country/year/category)
    cat = load_df_category_long()
    if cat.empty:
        # fallback to master normalized (also long) and pivot
        cat = load_master_normalized()
        if cat.empty:
            # final fallback to denormalized master
            df_f = load_master_final_fallback()
            if df_f.empty:
                raise HTTPException(status_code=404, detail="No category data available")
            # assume df_f is wide: return rows directly (best-effort)
            df = df_f
            if year is not None:
                df = df[df['year'] == year]
            categories = [
                'temperature_exchange_equipment_kt',
                'screens_kt',
                'lamps_kt',
                'large_equipment_kt',
                'small_equipment_kt',
                'small_it_kt',
            ]
            out = []
            for _, r in df.iterrows():
                rec = {'country': r.get('country'), 'iso3': r.get('iso3'), 'year': int(r['year']) if pd.notna(r.get('year')) else None}
                total = _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt'))
                for c in categories:
                    val = _safe_float(r.get(c))
                    if metric == 'kt':
                        rec[c] = val
                    else:
                        rec[c + '_share'] = float(val) / float(total) if total and val is not None and total > 0 else None
                out.append(rec)
            return out
    # now cat is long-format with columns: country, year, category, kt (or similar)
    df = cat.copy()
    if year is not None:
        df = df[df['year'] == year]
    # pivot to wide so each category becomes a column with kt
    if 'category' in df.columns and 'kt' in df.columns:
        pivot = df.pivot_table(index=['country', 'year', 'iso3'] if 'iso3' in df.columns else ['country', 'year'], columns='category', values='kt', aggfunc='first').reset_index()
    else:
        # If the long file already has wide-like column names, try to use as-is
        pivot = df
    cats = [
        'temperature_exchange_equipment_kt',
        'screens_kt',
        'lamps_kt',
        'large_equipment_kt',
        'small_equipment_kt',
        'small_it_kt',
    ]
    out = []
    for _, r in pivot.iterrows():
        rec = {'country': _clean_value(r.get('country')), 'iso3': _clean_value(r.get('iso3')) if 'iso3' in r.index else None, 'year': int(r['year']) if pd.notna(r.get('year')) else None}
        # total ewaste for share computation: prefer e_waste_generated_kt or a column named similarly
        total = _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt') or r.get('e_waste_generated_kt_x') or r.get('e_waste_generated_kt_y'))
        for c in cats:
            val = _safe_float(r.get(c))
            if metric == 'kt':
                rec[c] = val
            else:
                rec[c + '_share'] = float(val) / float(total) if total and val is not None and total > 0 else None
        out.append(rec)
    return out


@app.get("/ewaste/scatter", response_model=List[ScatterPoint])
def scatter(year: Optional[int] = Query(None)):
    # Prefer country-year macro table for scatter (one row per country/year)
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
        # if long-format, reduce to one row per country/year by taking first macro columns
        if not df.empty and 'category' in df.columns:
            df = df.groupby(['country', 'year']).first().reset_index()
    if year is not None:
        df = df[df['year'] == year]
    out = []
    for _, r in df.iterrows():
        out.append({
            'country': _clean_value(r.get('country')),
            'iso3': _clean_value(r.get('iso3')),
            'gdp_per_capita': _safe_float(r.get('gdp_per_capita')),
            'e_waste_generated_per_capita': _safe_float(r.get('ewaste_generated_kg_inh') or r.get('E_waste_generated_per_capita') or r.get('e_waste_generated_per_capita')),
            'population': (lambda v: int(v) if v is not None else None)(_safe_float(r.get('population'))),
            'e_waste_collection_rate': _safe_float(r.get('e_waste_collection_rate') or r.get('E_waste_collection_rate')),
        })
    return out


@app.get("/data/table")
def data_table(country: Optional[str] = None, year: Optional[int] = None, limit: int = 100, offset: int = 0):
    df = load_master_normalized()
    if df.empty:
        df = load_master_final_fallback()
    if country:
        df = df[df['country'].str.lower() == country.lower()]
    if year is not None:
        df = df[df['year'] == year]
    total = len(df)
    df_page = df.iloc[offset: offset + limit]
    # Convert DataFrame page to JSON-serializable records (replace NaN/pd.NA and numpy types)
    df_page_clean = df_page.where(pd.notnull(df_page), None)
    records = df_page_clean.to_dict(orient='records')  # type: ignore
    # Convert numpy scalars to python primitives
    def _normalize_record(rec):
        out = {}
        for k, v in rec.items():
            # Convert pandas/np missing values to None
            try:
                if pd.isna(v):
                    out[k] = None
                    continue
            except Exception:
                pass
            # numpy scalar -> python native
            if isinstance(v, (np.generic,)):
                try:
                    out[k] = v.item()
                    continue
                except Exception:
                    pass
            # floats that are NaN
            if isinstance(v, float) and np.isnan(v):
                out[k] = None
                continue
            out[k] = v
        return out

    rows = [_normalize_record(r) for r in records]
    # Ensure final structure is JSON-serializable (handles any remaining numpy types)
    payload = {"total": int(total), "rows": rows}
    return jsonable_encoder(payload)


@app.get("/data/export")
def data_export(country: Optional[str] = None, year: Optional[int] = None):
    df = load_master_normalized()
    if df.empty:
        df = load_master_final_fallback()
    if country:
        df = df[df['country'].str.lower() == country.lower()]
    if year is not None:
        df = df[df['year'] == year]
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type='text/csv', headers={"Content-Disposition": "attachment; filename=export.csv"})


@app.get("/ewaste/scenario", response_model=ScenarioResult)
def scenario(country: str = Query(...), year: Optional[int] = Query(None), delta_percent: float = Query(10.0, description="Incremento porcentual en la recolección formal")):
    # Use country-year macro table for scenario calculations
    df = load_df_country_year()
    if df.empty:
        df = load_master_normalized()
        if not df.empty and 'category' in df.columns:
            df = df.groupby(['country', 'year']).first().reset_index()
    sel = df[df['country'].str.lower() == country.lower()]
    if year is not None:
        sel = sel[sel['year'] == year]
    if sel.empty:
        raise HTTPException(status_code=404, detail="No data for country/year")
    r = sel.iloc[0]
    base_formal = _safe_float(r.get('e_waste_formally_collected_kt') or r.get('E_waste_formally_collected_kt') or r.get('ewaste_formally_collected_kg_inh') or 0.0) or 0.0
    generated = _safe_float(r.get('e_waste_generated_kt') or r.get('E_waste_generated_kt') or r.get('e_waste_generated_kt_x') or r.get('e_waste_generated_kt_y') or 0.0) or 0.0
    new_formal = base_formal * (1.0 + delta_percent / 100.0)
    # no superar el total generado
    new_formal = float(min(new_formal, generated))
    delta_abs = new_formal - base_formal
    base_value = value_recoverable_usd_from_kt(base_formal) if base_formal else value_recoverable_usd_from_kt(generated)
    new_value = value_recoverable_usd_from_kt(new_formal)
    return {
        'country': r.get('country'),
        'year': int(r['year']) if pd.notna(r.get('year')) else None,
        'base_formally_collected_kt': base_formal,
        'new_formally_collected_kt': new_formal,
        'delta_absolute_kt': delta_abs,
        'base_value_recoverable_usd': base_value,
        'new_value_recoverable_usd': new_value,
    }
