from functools import lru_cache
from pathlib import Path
import pandas as pd


@lru_cache(maxsize=1)
def get_data_dir() -> Path:
    # resuelve la ruta relativa: Code/limbo/backend -> ../data
    current = Path(__file__).resolve()
    # `current` is .../Code/limbo/backend/data_loader.py
    # queremos la carpeta `backend/data` (parent `backend` + 'data')
    backend_dir = current.parents[0]
    data_dir = backend_dir / "data"
    return data_dir


def _read_csv(path: Path, **kwargs) -> pd.DataFrame:
    df = pd.read_csv(path, **kwargs)
    # strip column names
    df.columns = [c.strip() for c in df.columns]
    return df


def _read_json(path: Path, **kwargs) -> pd.DataFrame:
    # read JSON file saved as an array of records
    df = pd.read_json(path, **kwargs)
    # strip column names
    df.columns = [c.strip() for c in df.columns]
    return df


@lru_cache(maxsize=1)
def load_df_country_year() -> pd.DataFrame:
    """Carga la tabla `df_country_year.csv`: una fila por (country, year) con métricas macro."""
    data_dir = get_data_dir()
    # Prefer JSON-only workflow: read df_country_year.json. If absent, return empty DataFrame.
    jpath = data_dir / "df_country_year.json"
    if not jpath.exists():
        return pd.DataFrame()
    df = _read_json(jpath)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df


@lru_cache(maxsize=1)
def load_df_category_long() -> pd.DataFrame:
    """Carga `df_category_long.csv`: formato largo por categoría (country, year, category, kt, share)."""
    data_dir = get_data_dir()
    jpath = data_dir / "df_category_long.json"
    if not jpath.exists():
        return pd.DataFrame()
    df = _read_json(jpath)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    # asegurar nombres limpios
    df.rename(columns=lambda c: c.strip(), inplace=True)
    return df


@lru_cache(maxsize=1)
def load_df_category_pairs() -> pd.DataFrame:
    """Carga `df_category_pairs.csv` si existe (pares de categorías)."""
    data_dir = get_data_dir()
    jpath = data_dir / "df_category_pairs.json"
    if not jpath.exists():
        return pd.DataFrame()
    df = _read_json(jpath)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df


@lru_cache(maxsize=1)
def load_master_normalized() -> pd.DataFrame:
    """Carga `master_dataset_normalized.csv` si se prefiere usar un único archivo normalizado."""
    data_dir = get_data_dir()
    jpath = data_dir / "master_dataset_normalized.json"
    if not jpath.exists():
        return pd.DataFrame()
    df = _read_json(jpath)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df


@lru_cache(maxsize=1)
def load_master_final_fallback() -> pd.DataFrame:
    """Fallback para cargas antiguas: `master_final_dataset.csv` (denormalizado).
    Usar solo si no existen los datasets normalizados.
    """
    data_dir = get_data_dir()
    jpath = data_dir / "master_final_dataset.json"
    if not jpath.exists():
        return pd.DataFrame()
    df = _read_json(jpath)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df
