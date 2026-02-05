# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "requests",
# ]
# ///
"""
Descarga datos horarios de SINAICA para ~20 estaciones y 3 contaminantes.
Guarda el resultado en site/data/sinaica.json.

Estrategia de frescura (Opción C):
  1. Intenta obtener datos de hoy para cada estación/contaminante.
  2. Si una estación regresa 0 lecturas, intenta con ayer (fallback 1 día).
  3. Hace merge con el JSON existente: lecturas nuevas reemplazan las viejas
     del mismo station+param+hora, pero las viejas sobreviven si no hay nuevas.

Ejecutar con: uv run scripts/fetch_sinaica.py
"""

import json
import re
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

ESTACIONES_PATH = Path("site/data/estaciones.json")
OUTPUT_PATH = Path("site/data/sinaica.json")

API_URL = "https://sinaica.inecc.gob.mx/pags/datGrafs.php"

CONTAMINANTES = {
    "PM2.5": {"param": "PM2.5", "unidad": "µg/m³"},
    "O3": {"param": "O3", "unidad": "ppm"},
    "CO": {"param": "CO", "unidad": "ppm"},
}

# Regex to extract the `var dat = [...]` array from the HTML response
DAT_PATTERN = re.compile(r"var\s+dat\s*=\s*(\[.*?\]);", re.DOTALL)


def fetch_datos(estacion_id: int, param: str, fecha: str) -> list[dict]:
    """Fetch hourly data for one station/param/date from SINAICA."""
    resp = requests.post(
        API_URL,
        data={
            "estacionId": estacion_id,
            "param": param,
            "fechaIni": fecha,
            "rango": 1,  # 1 day
            "tipoDatos": "",  # raw/real-time
        },
        timeout=30,
        verify=False,  # SINAICA has SSL issues
    )
    resp.raise_for_status()

    match = DAT_PATTERN.search(resp.text)
    if not match:
        return []

    try:
        datos = json.loads(match.group(1))
    except json.JSONDecodeError:
        return []

    return [d for d in datos if d.get("val") == 1 and d.get("valor") is not None]


def load_existing() -> dict:
    """Load existing sinaica.json for merging, or return empty structure."""
    if not OUTPUT_PATH.exists():
        return {"lecturas": []}
    try:
        return json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, KeyError):
        return {"lecturas": []}


def merge_lecturas(existing: list[dict], nuevas: list[dict]) -> list[dict]:
    """Merge new readings with existing ones.

    Key: (estacion_id, param, fecha, hora).
    New readings replace old ones with the same key.
    Old readings survive if no new reading has the same key.
    """
    by_key = {}
    for l in existing:
        key = (l["estacion_id"], l["param"], l["fecha"], l["hora"])
        by_key[key] = l
    for l in nuevas:
        key = (l["estacion_id"], l["param"], l["fecha"], l["hora"])
        by_key[key] = l
    return list(by_key.values())


def main():
    import urllib3

    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    estaciones = json.loads(ESTACIONES_PATH.read_text(encoding="utf-8"))
    ahora = datetime.now(timezone.utc)
    hoy = ahora.strftime("%Y-%m-%d")
    ayer = (ahora - timedelta(days=1)).strftime("%Y-%m-%d")

    print(f"Fecha: {hoy} (fallback: {ayer})")
    print(f"Estaciones: {len(estaciones)}")
    print(f"Contaminantes: {list(CONTAMINANTES.keys())}")
    print()

    # Load existing data for merge
    existing = load_existing()
    existing_lecturas = existing.get("lecturas", [])
    print(f"Lecturas previas en cache: {len(existing_lecturas)}")
    print()

    lecturas_nuevas = []
    errores = 0
    fallbacks = 0

    for est in estaciones:
        for nombre_param, info in CONTAMINANTES.items():
            try:
                # Try today first
                datos = fetch_datos(est["id"], info["param"], hoy)
                fecha_usada = hoy

                # Fallback to yesterday if no data today
                if not datos:
                    datos = fetch_datos(est["id"], info["param"], ayer)
                    fecha_usada = ayer
                    if datos:
                        fallbacks += 1

                for d in datos:
                    lecturas_nuevas.append(
                        {
                            "estacion_id": est["id"],
                            "param": nombre_param,
                            "fecha": d["fecha"],
                            "hora": d["hora"],
                            "valor": d["valor"],
                        }
                    )

                suffix = "" if fecha_usada == hoy else f" (fallback {fecha_usada})"
                print(
                    f"  {est['nombre']:20s} {nombre_param:6s}"
                    f" → {len(datos):2d} lecturas{suffix}"
                )
            except Exception as e:
                errores += 1
                print(f"  {est['nombre']:20s} {nombre_param:6s} → ERROR: {e}")

            time.sleep(0.3)  # be nice to the server

    # Merge: new readings win, old ones survive for missing station+param combos
    lecturas_merged = merge_lecturas(existing_lecturas, lecturas_nuevas)

    # Prune readings older than 48h to prevent unbounded growth
    cutoff = (ahora - timedelta(hours=48)).strftime("%Y-%m-%d")
    lecturas_merged = [l for l in lecturas_merged if l["fecha"] >= cutoff]

    resultado = {
        "ultima_actualizacion": ahora.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "fecha_datos": hoy,
        "estaciones": estaciones,
        "lecturas": lecturas_merged,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(resultado, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"\nNuevas: {len(lecturas_nuevas)} lecturas")
    print(f"Fallbacks a ayer: {fallbacks}")
    print(f"Total tras merge: {len(lecturas_merged)} lecturas")
    print(f"Errores: {errores}")
    print(f"Guardado en: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
