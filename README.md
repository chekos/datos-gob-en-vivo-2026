# Datos Abiertos de México - En Vivo 2026

Exploración y visualización de datos del portal de datos abiertos del gobierno de México ([datos.gob.mx](https://datos.gob.mx)).

Proyecto creado en vivo para [tacos de datos](https://tacosdedatos.com).

## Estructura

```
├── data/
│   ├── raw/          # Datos descargados (no se incluyen en git)
│   └── processed/    # Datos procesados listos para visualización
├── scripts/          # Scripts de Python (ejecutar con uv run)
├── site/             # Página de GitHub Pages
│   ├── index.html
│   ├── style.css
│   └── js/
│       └── charts.js
```

## Cómo usar

### Procesar datos

```bash
uv run scripts/process_data.py
```

### Ver el sitio localmente

```bash
cd site && python -m http.server 8000
```

## Herramientas

- **UV** para ejecutar scripts de Python
- **Observable Plot** para visualizaciones interactivas
- **GitHub Pages** para publicar
