# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pandas",
#     "requests",
# ]
# ///
"""
Descarga y procesa datos de datos.gob.mx.
Ejecutar con: uv run scripts/process_data.py
"""

import json
from pathlib import Path

import pandas as pd
import requests

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")

RAW_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


def download_csv(url: str, filename: str) -> Path:
    """Descarga un CSV y lo guarda en data/raw/."""
    dest = RAW_DIR / filename
    if not dest.exists():
        print(f"Descargando {filename}...")
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        print(f"  -> {dest}")
    else:
        print(f"  {filename} ya existe, saltando descarga.")
    return dest


def save_json(data, filename: str) -> Path:
    """Guarda datos procesados como JSON para la visualización web."""
    dest = PROCESSED_DIR / filename
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"  -> {dest}")
    return dest


def main():
    print("=== Procesamiento de datos de datos.gob.mx ===\n")
    # Aquí se agregarán los pasos de descarga y procesamiento
    # cuando seleccionemos los datasets específicos.
    print("Listo. Agrega datasets en la función main().")


if __name__ == "__main__":
    main()
