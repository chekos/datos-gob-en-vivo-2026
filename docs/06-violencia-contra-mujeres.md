# Violencia contra las mujeres

## Fuente

- **Institución**: Secretaría de las Mujeres
- **Dataset**: [Violencia contra las mujeres](https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Indicadores de diferentes tipos de violencia hacia las mujeres en México. Incluye tasas de homicidios femeninos (1990-2023), prevalencia de violencia de pareja y de cualquier agresor, búsqueda de ayuda, y tipos de daño. Los datos de prevalencia provienen de la ENDIREH (Encuesta Nacional de Dinámica de las Relaciones en los Hogares) de INEGI, aplicada cada 5 años.

## Estructura técnica

El dataset contiene **7 archivos CSV**, cada uno con un indicador distinto:

### Recurso 1: Homicidios femeninos (el más detallado temporalmente)

- **Archivo**: `homicidios_femeninos.csv`
- **Tamaño**: ~46.6 KB
- **Filas**: 1,088 (32 estados × 34 años)
- **Columnas**: 5

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `entidad` | text | Abreviatura del estado | `AGS`, `BC` |
| `anio` | int | Año | `1990` |
| `tasa` | float | Tasa de homicidios por 100,000 mujeres | `3.45` |
| `entidad_etiqueta` | text | Nombre completo del estado | `Aguascalientes` |
| `fecha` | date | Fecha en formato ISO | `1990-01-01` |

### Recursos 2-6: Indicadores de prevalencia (misma estructura)

- **Archivos**: `violencia_prevalencia.csv`, `violencia_pareja.csv`, `violencia_12meses.csv`, `violencia_cualquier_agresor.csv`, `ayuda_violencia.csv`
- **Filas por archivo**: 128 (32 estados × 4 años de encuesta)
- **Columnas**: 5

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `entidad` | text | Nombre del estado | `Aguascalientes` |
| `anio` | int | Año de la encuesta | `2021` |
| `porcentaje_mujeres` | float | Porcentaje de mujeres afectadas | `25.53` |
| `entidad_etiqueta` | text | Etiqueta del estado | `Aguascalientes` |
| `fecha` | date | Fecha ISO | `2021-01-01` |

### Recurso 7: Violencia por tipo de daño

- **Archivo**: `violencia_tipo.csv`
- **Tamaño**: ~35 KB
- **Filas**: 512 (32 estados × 4 años × 4 categorías de daño)
- **Columnas**: 6 (agrega `indicador` para la categoría de daño)

Categorías de daño: "Con violencia de pareja", "Sin daños", "Con daños emocionales", "Con daños físicos y emocionales".

### Muestra de datos (homicidios)

```csv
entidad,anio,tasa,entidad_etiqueta,fecha
AGS,1990,3.45,Aguascalientes,1990-01-01
BC,1990,5.12,Baja California,1990-01-01
```

## Cobertura

- **Temporal**:
  - Homicidios: anual, 1990-2023 (34 años)
  - Prevalencia (ENDIREH): 2006, 2011, 2016, 2021 (4 puntos en el tiempo)
- **Geográfica**: 32 entidades federativas (nivel estatal; sin desglose municipal)
- **Población**: Mujeres de 15 años y más (excepto homicidios, que incluyen todas las edades)
- **Tipos de violencia**:
  - Violencia física y/o sexual por la pareja (en la vida y últimos 12 meses)
  - Violencia física y/o sexual por cualquier agresor
  - Prevalencia general de violencia
  - Búsqueda de ayuda institucional
  - Tipos de daño (emocional, físico, combinado)

## Acceso

| Recurso | URL |
|---|---|
| **Homicidios femeninos** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e/resource/620b4717-0552-422d-bd76-9aee32e98731/download/homicidios_femeninos.csv |
| **Prevalencia general** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e/resource/5dcb59f8-bab8-41cf-9c8a-53b3ff3e3ada/download/violencia_prevalencia.csv |
| **Violencia de pareja (vida)** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e/resource/f56adc44-025e-409e-bda2-9187ca7e2780/download/violencia_pareja.csv |
| **Violencia de pareja (12 meses)** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e/resource/b7af399f-86c1-4182-8c4a-c1bace82de3b/download/violencia_12meses.csv |
| **Cualquier agresor** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e/resource/367bcc8c-5b33-426e-8e7d-3e45cab3b862/download/violencia_cualquier_agresor.csv |
| **Búsqueda de ayuda** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e/resource/b6cccc49-2e67-4e23-b720-68dcdc99e301/download/ayuda_violencia.csv |
| **Por tipo de daño** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e/resource/ee26ab1c-90d2-4c50-90e1-207ed4dcd1d4/download/violencia_tipo.csv |
| **Dataset completo** | https://www.datos.gob.mx/dataset/2b519f50-200b-44e4-bfce-31cc43f4279e |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Mapa choropleth**: Tasa de homicidios femeninos por estado para un año dado, con slider temporal para ver la evolución 1990-2023.
- **Small multiples**: Un panel por estado mostrando la serie anual de homicidios, facilitando comparación de trayectorias.
- **Gráfico de pendiente (slope chart)**: Cambios en prevalencia de violencia por estado entre encuestas ENDIREH (2006 → 2021).
- **Barras divergentes**: Porcentaje de mujeres que buscan ayuda vs. que no la buscan, por estado, revelando brechas en acceso a justicia.
- **Dot plot**: Comparación simultánea de los 7 indicadores por estado para la encuesta más reciente (2021).

## Notas

- **Fuente primaria de prevalencia**: ENDIREH (INEGI), encuesta aplicada cada 5 años. Los datos no son anuales sino puntuales (2006, 2011, 2016, 2021).
- **Homicidios**: Basados en registros administrativos de defunciones (INEGI), no en encuestas. Son el único indicador con datos anuales continuos.
- **Rangos de prevalencia**: La violencia general de por vida va de 48% a 80% según el estado (2021), indicando que es un fenómeno generalizado con variación regional importante.
- **Sin desglose municipal**: Todos los datos son a nivel estatal.
- **Tamaño total del paquete**: ~116 KB (7 archivos CSV pequeños, muy manejables).
- **Tags del dataset**: abuso sexual, alerta violencia género, crimen, feminicidio, violencia doméstica, violencia de género.
