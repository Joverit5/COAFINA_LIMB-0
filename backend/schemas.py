from typing import List, Optional
from pydantic import BaseModel


class ChoroplethEntry(BaseModel):
    country: str
    country_clean: Optional[str]
    iso3: Optional[str]
    year: int
    e_waste_generated_per_capita: Optional[float]
    e_waste_generated_kt: Optional[float]
    e_waste_collection_rate: Optional[float]


class KPIStats(BaseModel):
    country: str
    year: int
    e_waste_generated_kt: Optional[float]
    e_waste_generated_per_capita: Optional[float]
    e_waste_collection_rate: Optional[float]
    e_waste_formally_collected_kt: Optional[float]
    value_recoverable_usd: Optional[float]


class TimeSeriesPoint(BaseModel):
    year: int
    ewaste_generated_kg_inh: Optional[float]
    eee_placed_on_market_kg_inh: Optional[float]


class CategoryBreakdown(BaseModel):
    country: str
    year: int
    temperature_exchange_equipment_kt: Optional[float]
    screens_kt: Optional[float]
    lamps_kt: Optional[float]
    large_equipment_kt: Optional[float]
    small_equipment_kt: Optional[float]
    small_it_kt: Optional[float]


class SankeyNodes(BaseModel):
    generated_kt: float
    formally_collected_kt: float
    exported_kt: float
    imported_kt: float
    informal_kt: float


class ScatterPoint(BaseModel):
    country: str
    iso3: Optional[str]
    gdp_per_capita: Optional[float]
    e_waste_generated_per_capita: Optional[float]
    population: Optional[int]
    e_waste_collection_rate: Optional[float]


class ScenarioResult(BaseModel):
    country: str
    year: int
    base_formally_collected_kt: Optional[float]
    new_formally_collected_kt: Optional[float]
    delta_absolute_kt: Optional[float]
    base_value_recoverable_usd: Optional[float]
    new_value_recoverable_usd: Optional[float]
