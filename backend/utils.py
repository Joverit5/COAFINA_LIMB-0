from typing import Optional

# Supuestos y parámetros para cálculos rápidos
RECOVERY_FRACTION = 0.02  # fracción de peso recuperable (2% por defecto)
PRICE_PER_TONNE_RECOVERED_USD = 2000.0  # precio medio por tonelada recuperada en USD


def value_recoverable_usd_from_kt(e_waste_generated_kt: Optional[float]) -> Optional[float]:
    """Calcula el valor recuperable a partir de e-waste en kilotoneladas.

    Fórmula (suposición simple):
    valor = kt * 1000 (tonnes) * recovery_fraction * price_per_tonne

    Se documenta en README y es configurable aquí.
    """
    if e_waste_generated_kt is None:
        return None
    try:
        tonnes = float(e_waste_generated_kt) * 1000.0
    except Exception:
        return None
    recovered_tonnes = tonnes * RECOVERY_FRACTION
    value = recovered_tonnes * PRICE_PER_TONNE_RECOVERED_USD
    return float(value)
