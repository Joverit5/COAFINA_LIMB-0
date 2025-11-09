from functools import lru_cache
from pathlib import Path
import pandas as pd


@lru_cache(maxsize=1)
def get_data_dir() -> Path:
    # resuelve la ruta relativa: Code/limbo/backend -> ../data
    current = Path(__file__).resolve()
    limbo = current.parents[1]
    data_dir = limbo / "data"
    return data_dir


def _read_csv(path: Path, **kwargs) -> pd.DataFrame:
    df = pd.read_csv(path, **kwargs)
    # strip column names
    df.columns = [c.strip() for c in df.columns]
    return df


@lru_cache(maxsize=1)
def load_df_country_year() -> pd.DataFrame:
    """Carga la tabla `df_country_year.csv`: una fila por (country, year) con métricas macro."""
    data_dir = get_data_dir()
    path = data_dir / "df_country_year.csv"
    df = _read_csv(path)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df


@lru_cache(maxsize=1)
def load_df_category_long() -> pd.DataFrame:
    """Carga `df_category_long.csv`: formato largo por categoría (country, year, category, kt, share)."""
    data_dir = get_data_dir()
    path = data_dir / "df_category_long.csv"
    df = _read_csv(path)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    # asegurar nombres limpios
    df.rename(columns=lambda c: c.strip(), inplace=True)
    return df


@lru_cache(maxsize=1)
def load_df_category_pairs() -> pd.DataFrame:
    """Carga `df_category_pairs.csv` si existe (pares de categorías)."""
    data_dir = get_data_dir()
    path = data_dir / "df_category_pairs.csv"
    if not path.exists():
        return pd.DataFrame()
    df = _read_csv(path)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df


@lru_cache(maxsize=1)
def load_master_normalized() -> pd.DataFrame:
    """Carga `master_dataset_normalized.csv` si se prefiere usar un único archivo normalizado."""
    data_dir = get_data_dir()
    path = data_dir / "master_dataset_normalized.csv"
    if not path.exists():
        return pd.DataFrame()
    df = _read_csv(path)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df


@lru_cache(maxsize=1)
def load_master_final_fallback() -> pd.DataFrame:
    """Fallback para cargas antiguas: `master_final_dataset.csv` (denormalizado).
    Usar solo si no existen los datasets normalizados.
    """
    data_dir = get_data_dir()
    path = data_dir / "master_final_dataset.csv"
    if not path.exists():
        return pd.DataFrame()
    df = _read_csv(path)
    if 'year' in df.columns:
        df['year'] = pd.to_numeric(df['year'], errors='coerce').astype('Int64')
    return df
