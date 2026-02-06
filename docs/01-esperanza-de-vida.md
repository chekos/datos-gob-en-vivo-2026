# Esperanza de vida al nacer (1950-2070)

## Fuente

- **Institución**: Secretaría General del Consejo Nacional de Población (CONAPO)
- **Dataset**: [Proyecciones de población](https://datos.gob.mx/dataset/proyecciones-de-poblacion)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Número promedio de años que viviría un recién nacido si se mantiene el patrón de mortalidad observado a lo largo de su vida. Incluye estimaciones retrospectivas (1950-2024) y proyecciones a futuro (2025-2070), desglosadas por sexo, a nivel nacional y por entidad federativa.

Este indicador es clave para entender la evolución de la salud pública en México y las disparidades regionales y de género en longevidad.

## Estructura técnica

- **Formato**: CSV
- **Tamaño**: ~642 KB
- **Filas**: 10,059 (+ 1 encabezado)
- **Columnas**: 8

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `RENGLON` | int | Número de fila secuencial | `1` |
| `ANIO` | int | Año | `1950` |
| `ENTIDAD` | text | Nombre de la entidad federativa | `República Mexicana` |
| `CVE_GEO` | int | Código geográfico INEGI (0 = nacional, 1-32 = estados) | `0` |
| `SEXO` | text | Categoría de sexo | `Hombres`, `Mujeres`, `Total` |
| `EV` | float | Esperanza de vida en años | `44.89935075` |
| `ENTIDAD_FEDERATIVA` | text | Nombre de la entidad (duplicado de `ENTIDAD`) | `República Mexicana` |
| `FECHA` | date | Fecha en formato ISO (1 de enero del año) | `1950-01-01` |

### Muestra de datos

```csv
RENGLON,ANIO,ENTIDAD,CVE_GEO,SEXO,EV,ENTIDAD_FEDERATIVA,FECHA
1,1950,República Mexicana,0,Hombres,44.89935075,República Mexicana,1950-01-01
2,1950,República Mexicana,0,Mujeres,47.70677143,República Mexicana,1950-01-01
3,1950,República Mexicana,0,Total,46.27022327,República Mexicana,1950-01-01
```

## Cobertura

- **Temporal**: 1950-2070 (121 años). Nacional desde 1950; estatal desde 1970.
- **Geográfica**: 33 entidades (República Mexicana + 32 estados)
- **Desagregación por sexo**: Hombres, Mujeres, Total (3 registros por entidad por año)
- **Códigos geográficos**: `CVE_GEO` usa los códigos INEGI estándar (0 = nacional, 1 = Aguascalientes, ..., 32 = Zacatecas), lo que facilita unir con shapefiles y otros datasets oficiales.

## Acceso

| Recurso | URL |
|---|---|
| **Descarga CSV** | https://repodatos.atdt.gob.mx/CONAPO/proyecciones/06_Esperanza_Vida_Nacer_1950_2070.csv |
| **Dataset completo** | https://datos.gob.mx/dataset/proyecciones-de-poblacion |

### Otros CSVs del mismo dataset

El dataset de Proyecciones de Población incluye 11 recursos CSV relacionados:

| Recurso | URL de descarga |
|---|---|
| Población a inicio de año (1950-2070) | `https://repodatos.atdt.gob.mx/CONAPO/proyecciones/00_Pob_Inicio_1950_2070.csv` |
| Población a mitad de año (1950-2070) | `https://repodatos.atdt.gob.mx/CONAPO/proyecciones/00_Pob_Mitad_1950_2070.csv` |
| Defunciones (1950-2070) | `https://repodatos.atdt.gob.mx/CONAPO/proyecciones/01_Defunciones_1950_2070.csv` |
| Migrantes internacionales quinquenales (1950-2069) | `https://repodatos.atdt.gob.mx/CONAPO/proyecciones/02_mig_inter_quinquen_proyecciones.csv` |
| Migrantes interestatales quinquenales (1950-2069) | `https://repodatos.atdt.gob.mx/CONAPO/proyecciones/03_mig_interest_quinquenal_proyecciones.csv` |
| Tasas específicas de fecundidad (1950-2070) | `https://repodatos.atdt.gob.mx/CONAPO/proyecciones/04_Tasas_Especificas_Fecundidad_proyecciones.csv` |
| Indicadores demográficos (1950-2070) | `05_indicadores_demograficos_proyecciones.csv` |
| Población municipal quinquenal (1990-2040) | `pobproy_quinq1.csv` |
| Indicadores demográficos municipales (1990-2040) | `pobproy_ggrupos.csv` |
| Indicadores demográficos (otros) | `pobproy_inddemo.csv` |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Líneas temporales**: Evolución de la esperanza de vida nacional (1950-2070), distinguiendo estimaciones históricas de proyecciones con estilo distinto (línea sólida vs. punteada).
- **Small multiples**: Un panel por estado mostrando la evolución por sexo, para comparar trayectorias regionales.
- **Mapa choropleth**: Esperanza de vida por estado para un año dado, usando `CVE_GEO` para unir con geometrías INEGI. Permite slider temporal para explorar cambios.
- **Brecha de género**: Gráfico de la diferencia (Mujeres - Hombres) por estado y año, mostrando cómo la brecha ha cambiado.
- **Ranking animado**: Estados ordenados por esperanza de vida, animado a lo largo del tiempo (bar chart race).

## Notas

- **Calidad**: Los datos combinan estimaciones históricas (basadas en censos y registros) con proyecciones demográficas. Los valores futuros (2025+) son modelos, no observaciones.
- **Columna duplicada**: `ENTIDAD` y `ENTIDAD_FEDERATIVA` contienen la misma información.
- **`RENGLON`** es un índice secuencial sin valor analítico; puede ignorarse.
- **Actualización**: Última modificación del dataset: octubre 2025. Datos del servidor: julio 2025.
- **Datasets relacionados**: Los otros CSVs del mismo paquete (defunciones, migración, fecundidad) permiten construir un panorama demográfico completo de México.
