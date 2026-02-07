# Datos Abiertos de México - En Vivo 2026

Exploración y visualización de datos del portal de datos abiertos del gobierno de México ([datos.gob.mx](https://datos.gob.mx)).

Proyecto creado en vivo para [tacos de datos](https://tacosdedatos.com).

## Dashboards

### Calidad del Aire (SINAICA)

Datos en tiempo real de 20 estaciones de monitoreo del [SINAICA](https://sinaica.inecc.gob.mx/) (INECC). Se miden PM2.5, O3 y CO con umbrales de las normas oficiales mexicanas. Se actualiza automáticamente cada hora via GitHub Actions.

- Mapa de estaciones con lecturas de PM2.5
- Barras horizontales por contaminante con indicadores de frescura
- Tendencia 24h por estación

### Inversión Extranjera Directa (IED)

Datos trimestrales de la Secretaría de Economía (2006–2024) sobre inversión extranjera directa por entidad, país de origen y sector económico.

- Mapa choropleth por entidad (CDMX excluida de la escala con hatching por ser outlier)
- Top 10 estados por año
- Heatmap con tabs: por país de origen / por sector (escala divergente para desinversiones)
- Diagrama Sankey interactivo: país → entidad → sector (clic para resaltar flujos)

## Estructura

```
├── data/raw/             # Datos descargados (gitignored)
├── docs/                 # Documentación de datasets candidatos
├── scripts/
│   ├── fetch_sinaica.py  # Descarga datos horarios de SINAICA
│   └── fetch_ied.py      # Descarga y procesa CSVs de IED
├── site/                 # GitHub Pages
│   ├── index.html        # Dashboard SINAICA
│   ├── ied.html          # Dashboard IED
│   ├── style.css         # Estilos brutalistas compartidos
│   ├── data/             # JSON pre-procesados para el frontend
│   └── js/
│       ├── dashboard.js  # Lógica de visualización SINAICA
│       └── ied.js        # Lógica de visualización IED
└── .github/workflows/
    ├── fetch-sinaica.yml # Actualización horaria de datos SINAICA
    └── deploy-pages.yml  # Deploy automático a GitHub Pages
```

## Cómo usar

### Instalar uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Generar datos

```bash
# Calidad del aire (requiere conexión, datos de hoy)
uv run scripts/fetch_sinaica.py

# Inversión extranjera directa (descarga ~65 MB de CSVs)
uv run scripts/fetch_ied.py
```

### Ver el sitio localmente

```bash
cd site && python -m http.server 8000
# Abrir http://localhost:8000 (SINAICA) o http://localhost:8000/ied.html (IED)
```

## Herramientas

- **[uv](https://docs.astral.sh/uv/)** para ejecutar scripts de Python (inline script metadata, sin virtualenv)
- **[Observable Plot](https://observablehq.com/plot/)** + **D3** para visualizaciones
- **[d3-sankey](https://github.com/d3/d3-sankey)** para el diagrama de flujos de IED
- **GitHub Pages** para publicar
- **GitHub Actions** para actualización automática de datos
