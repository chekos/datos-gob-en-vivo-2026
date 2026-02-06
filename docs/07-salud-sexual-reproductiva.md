# Salud sexual y reproductiva

## Fuente

- **Institución**: Secretaría General del Consejo Nacional de Población (CONAPO)
- **Dataset**: [Salud sexual y reproductiva](https://www.datos.gob.mx/dataset/01c8b87d-f691-4983-b698-4234aa8f63a1)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Principales indicadores de salud sexual y reproductiva de las mujeres en edad fértil (15-49 años) en México. Abarca prevalencia anticonceptiva, fecundidad adolescente, necesidad insatisfecha de anticonceptivos, demanda satisfecha de métodos modernos, y características sociodemográficas de madres adolescentes. Los datos provienen de la ENADID (Encuesta Nacional de Dinámica Demográfica) y de registros de nacimientos de INEGI.

## Estructura técnica

El dataset contiene **24 archivos CSV** con distintos indicadores. Se agrupan en 4 categorías principales:

### Indicadores de fecundidad

| Recurso | Descripción | Cobertura |
|---|---|---|
| Fecundidad forzada niñas 10-14 años | Nacimientos en niñas de 10-14, tasa por 1,000 | Nacional y estatal, 2010-2023 |
| Tasas específicas y global de fecundidad | Tasas por grupo de edad quinquenal | Nacional y estatal |
| Tasa de fecundidad adolescente por municipio | Nacimientos por 1,000 mujeres 15-19 | Municipal (~2,454 municipios), 2020 y 2023 |

### Prevalencia anticonceptiva (MEFU y MEFSA)

| Recurso | Descripción | Cobertura |
|---|---|---|
| Prevalencia cualquier método | % de mujeres usando anticonceptivos | Nacional y estatal, por características sociodemográficas |
| Métodos anticonceptivos modernos | % usando métodos modernos | Nacional y estatal |
| Distribución por tipo de método | Desglose por método específico (DIU, pastillas, condón, etc.) | Nacional y estatal |
| Participación masculina | % de uso atribuible a participación del hombre | Nacional y estatal |

### Necesidad insatisfecha y demanda satisfecha

| Recurso | Descripción | Cobertura |
|---|---|---|
| Necesidad insatisfecha de anticonceptivos | % con necesidad no cubierta | Nacional y estatal, 2014 y 2018 |
| Demanda satisfecha métodos modernos | % de demanda cubierta con métodos modernos | Nacional y estatal, 2014-2018 |

### Series de tiempo y características sociodemográficas

| Recurso | Descripción | Cobertura |
|---|---|---|
| Prevalencia anticonceptiva 2009-2023 | Serie temporal de uso anticonceptivo | Nacional y estatal |
| Características sociodemográficas niñas madres | Perfil de madres adolescentes | Nacional y estatal, 1990-2023 |
| Indicadores básicos SSyR 2023 | Snapshot de indicadores clave | Nacional y estatal |
| Planeación y deseo del embarazo | Embarazos planeados vs. no planeados | Nacional y estatal, 2009-2023 |

### Estructura común de columnas

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `entidad_federativa` | text | Nombre del estado | `República Mexicana`, `Aguascalientes` |
| `clave_inegi` | int | Código geográfico INEGI | `0` (nacional), `1`-`32` |
| `anio` | int | Año del dato | `2018` |
| `indicador` | text | Nombre del indicador | `Prevalencia anticonceptiva` |
| `valor` | float | Valor del indicador (%, tasa, número) | `73.1` |

Los archivos con desagregación sociodemográfica agregan columnas como:
- `grupo_edad`: Grupo de edad quinquenal (15-19, 20-24, ..., 45-49)
- `escolaridad`: Nivel educativo (Sin escolaridad, Primaria, Secundaria, Superior)
- `lengua_indigena`: Hablante de lengua indígena (Sí/No)
- `num_hijos`: Número de hijos
- `residencia`: Urbano/Rural

## Cobertura

- **Temporal**: Variable por indicador. Fecundidad forzada: 2010-2023. Anticonceptivos: 2014, 2018, 2023. Series largas: 1990-2023 o 2009-2023.
- **Geográfica**: Nacional + 32 entidades federativas. Fecundidad adolescente disponible a nivel municipal (~2,454 municipios).
- **Poblaciones**:
  - **MEFU**: Mujeres en Edad Fértil Unidas (15-49, casadas o en unión libre)
  - **MEFSA**: Mujeres en Edad Fértil Sexualmente Activas (15-49, con actividad sexual reciente)
- **Desagregaciones**: Edad, escolaridad, residencia urbana/rural, lengua indígena, condición de discapacidad, afrodescendencia, número de hijos

## Acceso

| Recurso | URL |
|---|---|
| **Prevalencia anticonceptiva 2009-2023** | https://repodatos.atdt.gob.mx/api_update/Dist_MEFSA_MEFU_2009_2023.csv |
| **Características madres adolescentes** | https://repodatos.atdt.gob.mx/api_update/Caract_Mad_Pad_1990_2023.csv |
| **Indicadores básicos SSyR 2023** | https://repodatos.atdt.gob.mx/api_update/IndicadoresBasicosSSyR_2023.csv |
| **Planeación del embarazo** | https://repodatos.atdt.gob.mx/api_update/Planeacion_Embarazos_2009_2023.csv |
| **Dataset completo (24 recursos)** | https://www.datos.gob.mx/dataset/01c8b87d-f691-4983-b698-4234aa8f63a1 |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Mapa choropleth municipal**: Tasa de fecundidad adolescente por municipio, con los ~2,454 municipios de México coloreados por intensidad.
- **Series de tiempo**: Evolución de prevalencia anticonceptiva 2009-2023 a nivel nacional, por método (líneas) o por estado (small multiples).
- **Gráfico de brecha**: Diferencia en prevalencia anticonceptiva entre mujeres indígenas vs. no indígenas, o urbanas vs. rurales, por estado.
- **Treemap de métodos**: Distribución del uso anticonceptivo por tipo de método, para ver cuáles dominan.
- **Slope chart temporal**: Cambio en necesidad insatisfecha de anticonceptivos entre 2014 y 2018 por estado.
- **Pirámide de fecundidad**: Tasas específicas de fecundidad por grupo de edad, comparando estados o años.

## Notas

- **Fuentes primarias**: ENADID 2014 y 2018 (INEGI) para prevalencia; registros de nacimientos para fecundidad; proyecciones de población CONAPO.
- **Terminología clave**:
  - **MEFU** = Mujeres en Edad Fértil Unidas (casadas o en unión libre)
  - **MEFSA** = Mujeres en Edad Fértil Sexualmente Activas
  - **NIA** = Necesidad Insatisfecha Anticonceptiva
  - **DS** = Demanda Satisfecha
- **Fecundidad forzada**: Nacimientos en niñas de 10-14 años, típicamente resultado de violencia sexual. Indicador sensible.
- **24 recursos**: Es un dataset grande con muchos CSVs especializados. No todos comparten la misma estructura de columnas.
- **Datos municipales**: Solo disponibles para fecundidad adolescente (2020 y 2023), no para otros indicadores.
- **Actualización**: Último lote de recursos actualizado en octubre 2025.
