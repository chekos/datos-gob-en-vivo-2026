# Ocupación hotelera en los 70 destinos principales

## Fuente

- **Institución**: Secretaría de Turismo (SECTUR)
- **Dataset**: [Ocupación hotelera en los 70 destinos principales monitoreados en DataTur](https://www.datos.gob.mx/dataset/a9782641-4c85-4a8d-ae53-91b6129f12f2)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Estadísticas mensuales de ocupación hotelera en los 70 principales destinos turísticos de México, monitoreados por el sistema DataTur. Incluye cuartos disponibles, cuartos ocupados, llegada de turistas y turistas-noche, desglosados por categoría de hotel (1-5 estrellas) y por tipo de turista (residente vs. no residente).

Permite analizar estacionalidad turística, comparar destinos de playa vs. ciudades, y entender patrones de turismo nacional e internacional.

## Estructura técnica

- **Formato**: CSV
- **Tamaño**: ~2.7 MB
- **Columnas**: 13

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `anio` | int | Año | `2016` |
| `mes` | text | Mes (formato MM) | `01` |
| `tipo_centro` | text | Tipo de centro turístico | `Centros de Playa`, `Ciudades` |
| `subtipo_centro` | text | Subtipo | `Integralmente Planeados`, `Tradicionales`, `Grandes`, `Interior`, `Fronterizas` |
| `centro` | text | Nombre del destino | `Cancún`, `Ciudad de México` |
| `categoria` | text | Clasificación por estrellas | `3 estrellas`, `5 estrellas` |
| `cuartos_disponibles` | int | Cuartos-noche disponibles en el periodo | `734023` |
| `cuartos_ocupados_no_residentes` | int | Cuartos ocupados por turistas extranjeros | `251705` |
| `cuartos_ocupados_residentes` | int | Cuartos ocupados por turistas nacionales | `180432` |
| `llegada_turistas_no_residentes` | int | Llegadas de turistas extranjeros | `95000` |
| `llegada_turistas_residentes` | int | Llegadas de turistas nacionales | `120000` |
| `turistas_noche_no_residentes` | int | Turistas-noche extranjeros | `1740019` |
| `turistas_noche_residentes` | int | Turistas-noche nacionales | `850000` |

### Muestra de datos

```csv
anio,mes,tipo_centro,subtipo_centro,centro,categoria,cuartos_disponibles,cuartos_ocupados_no_residentes,cuartos_ocupados_residentes,...
2016,01,Centros de Playa,Integralmente Planeados,Ixtapa - Zihuatanejo,3 estrellas,10819,...
2016,01,Centros de Playa,Integralmente Planeados,Cancún,5 estrellas,734023,...
```

## Cobertura

- **Temporal**: Enero 2016 en adelante (mensual). Última actualización: mayo 2025.
- **Geográfica**: 70 destinos turísticos clasificados en:
  - **Centros de Playa** (~20): Cancún, Los Cabos, Puerto Vallarta, Acapulco, Mazatlán, Cozumel, Riviera Maya, Huatulco, Ixtapa-Zihuatanejo, etc.
  - **Ciudades Grandes**: Ciudad de México, Guadalajara, Monterrey
  - **Ciudades del Interior** (~40): Mérida, Puebla, Oaxaca, Guanajuato, San Miguel de Allende, Querétaro, etc.
  - **Ciudades Fronterizas**: Tijuana, Ciudad Juárez, Mexicali, Piedras Negras
- **Categorías de hotel**: 1 a 5 estrellas
- **Desagregación por origen**: Turistas residentes (nacionales) y no residentes (extranjeros)

## Acceso

| Recurso | URL |
|---|---|
| **Descarga CSV** | https://repodatos.atdt.gob.mx/s_turismo/ocupacion_hotelera/Base70centros.csv |
| **Dataset completo** | https://www.datos.gob.mx/dataset/a9782641-4c85-4a8d-ae53-91b6129f12f2 |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Heatmap de estacionalidad**: Mes × destino con intensidad de ocupación, revelando temporadas altas y bajas por destino.
- **Comparación playa vs. ciudad**: Barras agrupadas o small multiples mostrando patrones opuestos de ocupación entre destinos de playa (invierno alto) y ciudades de negocios.
- **Series de tiempo**: Evolución mensual de ocupación en destinos clave, con bandas por categoría de hotel.
- **Proporción nacional/internacional**: Gráfico apilado mostrando la mezcla de turismo doméstico vs. extranjero por destino.
- **Ranking dinámico**: Los 10 destinos con mayor ocupación por mes, animado para ver cambios estacionales.

## Notas

- **Frecuencia de actualización**: Mensual.
- **Categorías de hotel**: La desagregación por estrellas (1-5) permite analizar turismo de lujo vs. económico.
- **Tipo de centro**: La clasificación en "Integralmente Planeados" (Cancún, Los Cabos, Huatulco) vs. "Tradicionales" (Acapulco, Vallarta) refleja la política turística de México.
- **Turistas-noche**: Métrica más precisa que llegadas para medir impacto económico del turismo.
- **Sin coordenadas**: Los destinos aparecen por nombre, no tienen latitud/longitud. Se necesitaría geocodificar para mapear.
