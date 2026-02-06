# Tarifas finales del suministro básico de electricidad

## Fuente

- **Institución**: Comisión Nacional de Energía (CNE)
- **Dataset**: [Tarifas finales del suministro básico](https://www.datos.gob.mx/dataset/tarifas_finales_suministro_basico)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Tarifas mensuales de electricidad en México desde diciembre de 2017, desglosadas por tipo de tarifa (doméstica, comercial, industrial, agrícola, alumbrado público), región geográfica, tipo de cargo (fijo, variable, capacidad) y componentes de costo (generación, transmisión, distribución, CENACE, suministro). Permite analizar la evolución de precios de electricidad y su impacto en hogares, comercios e industria.

## Estructura técnica

- **Formato**: CSV
- **Tamaño**: ~8.34 MB
- **Filas**: 62,322
- **Columnas**: 16

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `anio` | int | Año | `2025` |
| `mes` | text | Mes en español | `septiembre` |
| `tarifa` | text | Código de tarifa | `DB1`, `GDBT`, `DIST` |
| `descripcion` | text | Descripción de la tarifa | `Doméstico baja tensión hasta 150 kWh-mes` |
| `int_horario` | text | Intervalo horario | `sin dato`, `B`, `I`, `P`, `SP` |
| `cargo` | text | Tipo de cargo | `Fijo`, `Variable (Energía)`, `Capacidad` |
| `unidades` | text | Unidad de medida | `pesos por mes`, `pesos por kWh`, `pesos por kW` |
| `region` | text | Región de distribución eléctrica | `Valle de México Centro`, `Peninsular` |
| `transmision` | float | Componente de transmisión | `0.1521` |
| `distribucion` | float | Componente de distribución | `0.2340` |
| `cenace` | float | Componente CENACE (operador de la red) | `0.007` |
| `suministro` | float | Componente de suministro básico | `0.0150` |
| `scnmem` | float | Contribución social (SCNMEM) | `0.0030` |
| `generacion` | float | Componente de generación | `0.4500` |
| `capacidad` | float | Componente de capacidad | `0.0800` |
| `total` | float | Tarifa total (suma de componentes) | `0.852` |

### Muestra de datos

```csv
anio,mes,tarifa,descripcion,int_horario,cargo,unidades,region,transmision,distribucion,cenace,suministro,scnmem,generacion,capacidad,total
2017,diciembre,DB1,Doméstico baja tensión hasta 150 kWh-mes,sin dato,Fijo,pesos por mes,Baja California,,,,,,,,67.24
2017,diciembre,DB1,Doméstico baja tensión hasta 150 kWh-mes,sin dato,Variable (Energía),pesos por kWh,Baja California,0.1521,0.2340,0.007,0.015,0.003,0.440,,0.852
```

## Cobertura

- **Temporal**: Diciembre 2017 a septiembre 2025 (~8 años, mensual, ~94 meses).
- **Geográfica**: 17 regiones de distribución eléctrica:
  - Baja California, Baja California Sur, Bajío, Centro Occidente, Centro Oriente, Centro Sur, Golfo Centro, Golfo Norte, Jalisco, Noroeste, Norte, Oriente, Peninsular, Sureste, Valle de México Centro, Valle de México Norte, Valle de México Sur
- **Tipos de tarifa** (11 códigos):

| Código | Descripción | Sector |
|---|---|---|
| `DB1` | Doméstico baja tensión ≤150 kWh/mes | Residencial (bajo consumo) |
| `DB2` | Doméstico baja tensión >150 kWh/mes | Residencial (alto consumo) |
| `PDBT` | Pequeña demanda baja tensión ≤25 kW | Comercial pequeño |
| `GDBT` | Gran demanda baja tensión >25 kW | Comercial grande |
| `RABT` | Riego agrícola baja tensión | Agrícola |
| `RAMT` | Riego agrícola media tensión | Agrícola |
| `APBT` | Alumbrado público baja tensión | Gobierno |
| `APMT` | Alumbrado público media tensión | Gobierno |
| `GDMTO` | Gran demanda media tensión ordinaria | Industrial |
| `GDMTH` | Gran demanda media tensión horaria | Industrial |
| `DIST` | Demanda industrial subtransmisión | Industrial |

- **Tipos de cargo**: Fijo ($/mes), Variable/Energía ($/kWh), Capacidad ($/kW)

## Acceso

| Recurso | URL |
|---|---|
| **Descarga CSV** | https://repodatos.atdt.gob.mx/api_update/cne/tarifas_finales_suministro_basico/02_tarifas_finales_suministro_basico.csv |
| **Dataset completo** | https://www.datos.gob.mx/dataset/tarifas_finales_suministro_basico |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Series de tiempo por tarifa**: Evolución mensual del precio total de DB1 y DB2 (residencial), mostrando el impacto en hogares desde 2018.
- **Heatmap región × tiempo**: Matriz de 17 regiones × 94 meses, coloreada por tarifa total, revelando disparidades geográficas y tendencias.
- **Descomposición de costos**: Barras apiladas con los 7 componentes (generación, transmisión, distribución, etc.) para entender qué impulsa los precios.
- **Comparación regional**: Dot plot o box plot comparando la misma tarifa (e.g., DB1) entre las 17 regiones para un mes dado.
- **Índice de asequibilidad**: Calcular el costo mensual para un hogar típico (e.g., 150 kWh) y graficar su evolución, ajustado por inflación.
- **Tarifas horarias**: Para GDMTH, comparar precios en horario base, intermedio, punta y semipunta.

## Notas

- **Esparsidad**: Muchas celdas de componentes están vacías porque no todos los tipos de cargo aplican todos los componentes. La columna `total` es la más útil para análisis generales.
- **Unidades en pesos mexicanos**: Todos los valores están en pesos corrientes. Para análisis real se necesita deflactar con IPC/INPC.
- **Intervalos horarios**: `B` = Base, `I` = Intermedio, `P` = Punta, `SP` = Semipunta. Solo aplican a tarifas horarias (GDMTH, DIST).
- **Regiones ≠ estados**: Las 17 regiones de distribución no corresponden 1:1 con los 32 estados. Un estado puede estar en más de una región.
- **Frecuencia de actualización**: Mensual. Última actualización: noviembre 2025.
- **Reforma energética**: Los datos comienzan en diciembre 2017, coincidiendo con la implementación de las tarifas reguladas post-reforma energética.
