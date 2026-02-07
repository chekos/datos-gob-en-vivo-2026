# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "requests",
#     "pandas",
# ]
# ///
"""
Descarga datos de Inversión Extranjera Directa (IED) de datos.gob.mx,
los procesa en 5 agregaciones y guarda el resultado en site/data/ied.json.

Fuentes:
  - ied_entidad_pais_de_origen.csv
  - ied_entidad_sector.csv

Ejecutar con: uv run scripts/fetch_ied.py
"""

import json
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import requests

RAW_DIR = Path("data/raw")
OUTPUT_PATH = Path("site/data/ied.json")

SOURCES = {
    "ied_entidad_pais_de_origen.csv": (
        "https://repodatos.atdt.gob.mx/s_economia/"
        "inversion_ext_directa/ied_entidad_pais_de_origen.csv"
    ),
    "ied_entidad_sector.csv": (
        "https://repodatos.atdt.gob.mx/all_data/secretaria_economia/"
        "6477759b-adbb-47fb-bf49-326f9c856627/ied_entidad_sector.csv"
    ),
}

# Mapping for topojson-compatible names
ENTIDAD_TOPO_MAP = {
    "Ciudad de México": "Distrito Federal",
    "Estado de México": "México",
}

# Sector codes considered "top level" (2-digit or range)
SECTOR_CODES_VALID = {
    "11", "21", "22", "23",
    "31-33", "43", "46", "48-49",
    "51", "52", "53", "54", "55", "56",
    "61", "62", "71", "72", "81", "93",
}


def download_csv(name: str, url: str) -> Path:
    """Download a CSV to data/raw/ and return the local path."""
    dest = RAW_DIR / name
    print(f"Descargando {name} ...")
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    dest.write_bytes(resp.content)
    size_mb = len(resp.content) / 1_048_576
    print(f"  -> {dest} ({size_mb:.1f} MB)")
    return dest


def build_por_entidad_anual(df: pd.DataFrame) -> list[dict]:
    """Group by (entidad, anio), sum millones_de_dolares."""
    agg = (
        df.groupby(["entidad", "anio"], as_index=False)["millones_de_dolares"]
        .sum()
    )
    records = []
    for _, row in agg.iterrows():
        entidad = row["entidad"]
        records.append({
            "entidad": entidad,
            "entidad_topo": ENTIDAD_TOPO_MAP.get(entidad, entidad),
            "anio": int(row["anio"]),
            "valor": round(float(row["millones_de_dolares"]), 2),
        })
    return records


def build_entidad_pais(df: pd.DataFrame) -> list[dict]:
    """Group by (entidad, pais_de_origen, anio), sum millones_de_dolares."""
    agg = (
        df.groupby(["entidad", "pais_de_origen", "anio"], as_index=False)[
            "millones_de_dolares"
        ].sum()
    )
    records = []
    for _, row in agg.iterrows():
        records.append({
            "entidad": row["entidad"],
            "pais": row["pais_de_origen"],
            "anio": int(row["anio"]),
            "valor": round(float(row["millones_de_dolares"]), 2),
        })
    return records


def extract_sector_code(sector_str: str) -> str:
    """Extract the short sector code prefix from sector_subsector_rama.

    Examples:
        '11 Agricultura, cría y ...' -> '11'
        '31-33 Industrias manufactureras' -> '31-33'
        '48-49 Transportes, correos ...' -> '48-49'
    """
    parts = str(sector_str).split(maxsplit=1)
    return parts[0] if parts else ""


def build_entidad_sector(df: pd.DataFrame) -> tuple[list[dict], pd.DataFrame]:
    """Filter to top-level sector codes, group by (entidad, sector, anio).

    Returns the aggregated records and the filtered dataframe (for sectores_top).
    """
    df = df.copy()
    df["sector_corto"] = df["sector_subsector_rama"].apply(extract_sector_code)

    # Filter to valid top-level sector codes
    df = df[df["sector_corto"].isin(SECTOR_CODES_VALID)].copy()

    # fn_millones_de_dolares is the numeric column; "C" (confidential) becomes NaN
    df["valor_num"] = pd.to_numeric(df["fn_millones_de_dolares"], errors="coerce")
    df["valor_num"] = df["valor_num"].fillna(0)

    agg = (
        df.groupby(["entidad", "sector_corto", "anio"], as_index=False)["valor_num"]
        .sum()
    )
    records = []
    for _, row in agg.iterrows():
        records.append({
            "entidad": row["entidad"],
            "sector": row["sector_corto"],
            "anio": int(row["anio"]),
            "valor": round(float(row["valor_num"]), 2),
        })
    return records, agg


def build_paises_top(df: pd.DataFrame, n: int = 10) -> list[str]:
    """Top N countries by total historical IED."""
    totals = (
        df.groupby("pais_de_origen")["millones_de_dolares"]
        .sum()
        .sort_values(ascending=False)
    )
    return totals.head(n).index.tolist()


def build_sectores_top(agg: pd.DataFrame, n: int = 10) -> list[str]:
    """Top N sector codes by total historical IED."""
    totals = (
        agg.groupby("sector_corto")["valor_num"]
        .sum()
        .sort_values(ascending=False)
    )
    return totals.head(n).index.tolist()


def main():
    ahora = datetime.now(timezone.utc)

    # Ensure directories exist
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    # Download CSVs
    paths = {}
    for name, url in SOURCES.items():
        paths[name] = download_csv(name, url)
    print()

    # Read CSVs
    df_pais = pd.read_csv(paths["ied_entidad_pais_de_origen.csv"], encoding="utf-8-sig")
    df_sector = pd.read_csv(paths["ied_entidad_sector.csv"], encoding="utf-8-sig")

    print(f"Filas ied_entidad_pais_de_origen: {len(df_pais):,}")
    print(f"Filas ied_entidad_sector:         {len(df_sector):,}")
    print(f"Columnas pais:   {list(df_pais.columns)}")
    print(f"Columnas sector: {list(df_sector.columns)}")
    print()

    # Build aggregations
    por_entidad_anual = build_por_entidad_anual(df_pais)
    entidad_pais = build_entidad_pais(df_pais)
    entidad_sector, agg_sector = build_entidad_sector(df_sector)
    paises_top = build_paises_top(df_pais)
    sectores_top = build_sectores_top(agg_sector)

    # Metadata
    anios = sorted(df_pais["anio"].dropna().unique().astype(int).tolist())
    entidades = sorted(df_pais["entidad"].dropna().unique().tolist())

    resultado = {
        "ultima_actualizacion": ahora.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "anios": anios,
        "entidades": entidades,
        "paises_top": paises_top,
        "sectores_top": sectores_top,
        "por_entidad_anual": por_entidad_anual,
        "entidad_pais": entidad_pais,
        "entidad_sector": entidad_sector,
    }

    json_str = json.dumps(resultado, ensure_ascii=False)
    OUTPUT_PATH.write_text(json_str, encoding="utf-8")

    size_kb = len(json_str.encode("utf-8")) / 1024
    print(f"Registros por_entidad_anual: {len(por_entidad_anual):,}")
    print(f"Registros entidad_pais:      {len(entidad_pais):,}")
    print(f"Registros entidad_sector:    {len(entidad_sector):,}")
    print(f"Años:     {anios[0]}–{anios[-1]} ({len(anios)} años)")
    print(f"Entidades: {len(entidades)}")
    print(f"Top países:  {paises_top}")
    print(f"Top sectores: {sectores_top}")
    print(f"\nGuardado en: {OUTPUT_PATH} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
