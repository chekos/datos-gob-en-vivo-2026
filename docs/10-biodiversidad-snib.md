# Biodiversidad - SNIB

## Fuente

- **Institución**: Comisión Nacional para el Conocimiento y Uso de la Biodiversidad (CONABIO)
- **Sistema**: Sistema Nacional de Información sobre Biodiversidad (SNIB)
- **Portal**: https://www.snib.mx/
- **Licencia**: Creative Commons Attribution-NonCommercial 2.5 Mexico (CC BY-NC 2.5 MX)

## Descripción

El SNIB es el sistema de referencia para información sobre biodiversidad en México. Integra datos de especímenes y observaciones de 1,177 bases de datos provenientes de 994 proyectos de investigación. Contiene casi 48 millones de registros de 117,895 especies, cubriendo todo el territorio nacional. Los datos siguen el estándar internacional Darwin Core para registros de biodiversidad.

México es uno de los 5 países megadiversos del mundo, y el SNIB es el repositorio central de esta información.

## Estructura técnica

### Estándar de datos: Darwin Core

Cada registro de espécimen/observación incluye campos siguiendo el estándar Darwin Core:

| Campo | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `scientificName` | text | Nombre científico de la especie | `Quercus rugosa` |
| `scientificNameID` | text | Identificador taxonómico | |
| `recordedBy` | text | Colector u observador | `J. Rzedowski` |
| `individualCount` | int | Número de individuos observados | `3` |
| `lifeStage` | text | Etapa de vida | `Adulto`, `Juvenil` |
| `habitat` | text | Tipo de hábitat | `Bosque de encino` |
| `countryCode` | text | Código de país | `MX` |
| `stateProvince` | text | Estado | `Oaxaca` |
| `locality` | text | Localidad de colecta | |
| `decimalLatitude` | float | Latitud | `17.0732` |
| `decimalLongitude` | float | Longitud | `-96.7266` |
| `startDayOfYear` | int | Día del año de la observación | `145` |

### Escala de datos

| Métrica | Valor |
|---|---|
| **Registros totales** | 47,958,578 |
| **Especies documentadas** | 117,895 |
| **Bases de datos integradas** | 1,177 |
| **Proyectos de investigación** | 994 |
| **Mapas temáticos** | 18,000+ |
| **Imágenes de sensores remotos** | 620,000+ |
| **Fotografías e ilustraciones** | 155,000+ |
| **Fichas de especies nativas** | 3,100+ |
| **Fichas de especies exóticas** | 1,280+ |

## Cobertura

- **Temporal**: Proyectos desde 1992 hasta el presente. Los registros de especímenes pueden ser de colectas históricas mucho más antiguas.
- **Geográfica**: Todo el territorio de México (terrestre y marino). Los datos pueden consultarse por:
  - Estado y municipio
  - Área natural protegida
  - Cuenca hidrográfica
  - Ecorregión
  - Región marina
- **Grupos taxonómicos**: Todos los reinos de la vida representados:
  - Mamíferos (496+ especies)
  - Aves (987+ especies)
  - Reptiles, anfibios
  - Peces
  - Plantas (miles de especies)
  - Hongos
  - Invertebrados
- **Coordenadas**: Registros georreferenciados con latitud/longitud

## Acceso

| Recurso | URL |
|---|---|
| **Portal SNIB (consulta y descarga)** | https://www.snib.mx/ |
| **Geoinformación (consulta geográfica/SIG)** | https://www.biodiversidad.gob.mx/region/geoinformacion |
| **EncicloVida (consulta por especie)** | https://enciclovida.mx/ |
| **CONABIO datos abiertos** | https://www.gob.mx/conabio (CONABIO no aparece en la plataforma nueva de datos.gob.mx; ver [nota](./00-nota-sobre-plataformas-datos-gob-mx.md)) |
| **GitHub CONABIO** | https://github.com/CONABIO |
| **Diccionario de datos** | https://www.snib.mx/ejemplares/docs/CONABIO-SNIB-DiccionarioDatosEjemplaresGeoportal-202311.pdf |

### Formatos de descarga

- Shapefiles (para datos geográficos/SIG)
- CSV (para registros tabulares de especímenes)
- Consultas por divisiones geográficas/administrativas

### Plataformas integradas

EncicloVida integra datos del SNIB con observaciones ciudadanas de:
- **Naturalista** (iNaturalist México)
- **AverAves** (eBird México)

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Mapa de puntos**: Distribución geográfica de registros de una especie o grupo taxonómico, usando las coordenadas lat/lon.
- **Mapa de riqueza de especies**: Hexbin o grid map mostrando número de especies por celda geográfica.
- **Treemap taxonómico**: Distribución de registros por reino → filo → clase → orden, mostrando qué grupos están mejor documentados.
- **Serie temporal de esfuerzo de muestreo**: Número de registros colectados por año/década, revelando tendencias en la investigación.
- **Scatter geográfico**: Registros coloreados por grupo taxonómico sobre un mapa de México, mostrando patrones de biodiversidad.
- **Bar chart de riqueza por estado**: Número de especies documentadas por entidad federativa, revelando sesgos de muestreo y zonas megadiversas (Oaxaca, Chiapas).

## Notas

- **Licencia no comercial**: A diferencia de los otros datasets en este proyecto, el SNIB usa CC BY-NC 2.5 MX, que prohíbe uso comercial.
- **Escala masiva**: Con ~48 millones de registros, no es práctico descargar todo el dataset de una vez. Se requiere filtrar por taxonomía, geografía o proyecto.
- **Sesgo de muestreo**: La densidad de registros varía mucho por región. Zonas cercanas a instituciones de investigación (CDMX, Oaxaca) están mejor muestreadas.
- **Calidad heterogénea**: Los datos provienen de 1,177 bases de datos distintas, con niveles variables de completitud y georreferenciación.
- **Sin API REST pública directa**: El acceso es principalmente a través del portal web (snib.mx) y geoportal. No hay un endpoint tipo CKAN o REST para consultas programáticas simples.
- **Catálogos taxonómicos propios**: CONABIO mantiene Catálogos de Autoridades Taxonómicas (CAT) para estandarizar nomenclatura.
- **Contacto**: servext@conabio.gob.mx
