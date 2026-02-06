# Inversión Extranjera Directa (IED)

## Fuente

- **Institución**: Secretaría de Economía (SE)
- **Dataset**: [Inversión extranjera directa](https://datos.gob.mx/dataset/inversion_extranjera_directa)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Flujos de inversión extranjera directa hacia México, desglosados por país de origen, tipo de inversión, sector económico y entidad federativa. Los datos se publican con granularidad trimestral y permiten analizar de dónde viene la inversión, a qué sectores se dirige y cómo se distribuye geográficamente.

## Estructura técnica

El dataset contiene **5 archivos CSV**, cada uno con una combinación diferente de dimensiones:

### Recurso 1: IED por entidad y país de origen

- **Archivo**: `ied_entidad_pais_de_origen.csv`
- **Filas**: ~96,200
- **Columnas**: 6

| Columna | Tipo | Descripción |
|---|---|---|
| `entidad` | text | Entidad federativa receptora |
| `pais_de_origen` | text | País de origen de la inversión |
| `anio` | int | Año |
| `trimestre` | int | Trimestre (1-4) |
| `fecha` | timestamp | Fecha de referencia (e.g., `2006-03-01`) |
| `millones_de_dolares` | float | Valor de la IED en millones de USD |

### Recurso 2: IED por entidad y sector

- **Archivo**: `ied_entidad_sector.csv`
- **Filas**: ~616,400
- **Columnas**: 7

| Columna | Tipo | Descripción |
|---|---|---|
| `entidad` | text | Entidad federativa receptora |
| `sector_subsector_rama` | text | Clasificación SCIAN jerárquica |
| `anio` | int | Año |
| `trimestre` | int | Trimestre (1-4) |
| `fecha` | timestamp | Fecha de referencia |
| `millones_de_dolares` | text | Valor de la IED (puede contener `"C"` = confidencial) |
| `fn_millones_de_dolares` | float | Valor numérico limpio (null si confidencial) |

### Recurso 3: IED por entidad y tipo de inversión

- **Archivo**: `ied_entidad_tipo_de_inversion.csv`
- **Filas**: ~7,100
- **Tamaño**: ~610 KB
- **Columnas**: 7

| Columna | Tipo | Descripción |
|---|---|---|
| `entidad` | text | Entidad federativa receptora |
| `tipo_de_inversion` | text | Modalidad de la inversión |
| `anio` | int | Año |
| `trimestre` | int | Trimestre (1-4) |
| `fecha` | timestamp | Fecha de referencia |
| `millones_de_dolares` | text | Valor (puede contener `"C"`) |
| `fn_millones_de_dolares` | float | Valor numérico limpio |

### Recurso 4: IED por país de origen y tipo

- **Archivo**: `ied_pais_de_origen_tipo.csv`
- **Filas**: ~10,900
- **Tamaño**: ~801 KB
- **Columnas**: 7 (misma estructura que recurso 3, con `pais_de_origen` en lugar de `entidad`)

### Recurso 5: IED por país de origen y sector

- **Archivo**: `ied_pais_de_origen_sector.csv`
- **Filas**: ~596,400
- **Tamaño**: ~58 MB
- **Columnas**: 7 (misma estructura que recurso 2, con `pais_de_origen` en lugar de `entidad`)

### Muestra de datos (recurso 1)

```csv
entidad,pais_de_origen,anio,trimestre,fecha,millones_de_dolares
Aguascalientes,Alemania,2006,1,2006-03-01,1.5364600000000002
```

## Cobertura

- **Temporal**: 2006 Q1 a 2024 Q2 (trimestral, ~74 trimestres)
- **Geográfica**: 32 entidades federativas (nombres completos, sin códigos INEGI directos, pero fácilmente vinculables)
- **Países de origen**: ~46 países individuales + "Otros países" + "Total general". Incluye: Estados Unidos, Alemania, Japón, España, Canadá, China, Corea, Francia, Reino Unido, entre otros.
- **Tipos de inversión**: 3 categorías:
  - Nuevas inversiones
  - Reinversión de utilidades
  - Cuentas entre compañías
- **Sectores**: Clasificación SCIAN jerárquica (sectores de 2 dígitos, subsectores de 3 dígitos, ramas de 4 dígitos)

## Acceso

| Recurso | URL de descarga |
|---|---|
| Entidad × País | https://repodatos.atdt.gob.mx/s_economia/inversion_ext_directa/ied_entidad_pais_de_origen.csv |
| Entidad × Sector | https://repodatos.atdt.gob.mx/all_data/secretaria_economia/6477759b-adbb-47fb-bf49-326f9c856627/ied_entidad_sector.csv |
| Entidad × Tipo | https://datos.gob.mx/dataset/6477759b-adbb-47fb-bf49-326f9c856627/resource/be4aa7e1-d8b3-4663-b939-23bbb6970ac9/download/ied_entidad_tipo_de_inversion.csv |
| País × Tipo | https://datos.gob.mx/dataset/6477759b-adbb-47fb-bf49-326f9c856627/resource/8e373c4f-38f3-4cd6-a260-9c3d9fccf607/download/ied_pais_de_origen_tipo.csv |
| País × Sector | https://repodatos.atdt.gob.mx/all_data/secretaria_economia/6477759b-adbb-47fb-bf49-326f9c856627/ied_pais_de_origen_sector.csv |

También disponible vía CKAN Datastore API (plataforma anterior, ver [nota](./00-nota-sobre-plataformas-datos-gob-mx.md)):
```
https://datos.gob.mx/api/3/action/datastore_search?resource_id={resource_id}
```

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Mapa choropleth**: IED total por estado para un trimestre o año dado. Requiere vincular `entidad` (nombre) con geometrías INEGI por nombre de estado.
- **Diagrama Sankey**: Flujos país de origen → entidad federativa, o país → sector económico, mostrando las rutas principales de inversión.
- **Series de tiempo**: Evolución trimestral de la IED total o por país, con barras apiladas por tipo de inversión.
- **Treemap**: Distribución por sector económico (usando la jerarquía SCIAN) para un periodo dado.
- **Heatmap**: Matriz estado × país con intensidad de inversión, revelando concentraciones geográficas.
- **Top N dinámico**: Los 10 principales países inversores o estados receptores, con slider temporal para ver cambios en el ranking.

## Notas

- **Valores confidenciales**: Algunos registros tienen `"C"` en `millones_de_dolares` cuando el dato es confidencial por secreto estadístico. Usar `fn_millones_de_dolares` para análisis numérico (los confidenciales quedan como null/vacío).
- **Unidad**: Todos los valores están en **millones de dólares estadounidenses**.
- **Sin códigos INEGI**: Los estados aparecen por nombre (`entidad`), no por código numérico. Para mapear, se necesita una tabla de correspondencia nombre → código INEGI.
- **Archivos grandes**: Los recursos por sector (2 y 5) son los más pesados (~600K filas cada uno, hasta 58 MB) por la granularidad de la clasificación SCIAN.
- **Actualización**: Metadatos modificados en junio 2025. Los datos llegan hasta Q2 2024.
