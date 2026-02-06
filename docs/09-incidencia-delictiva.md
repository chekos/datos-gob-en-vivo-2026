# Incidencia delictiva

## Fuente

- **Institución**: Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública (SESNSP)
- **Dataset**: [Incidencia delictiva](https://datos.gob.mx/dataset/incidencia_delictiva)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Registro mensual de incidencia delictiva en México basado en las carpetas de investigación abiertas por las fiscalías y procuradurías estatales. Cubre 53 tipos de delito y 98 subtipos/modalidades, con datos a nivel estatal y municipal desde 2015. Incluye también un archivo de víctimas con desglose por sexo y grupo de edad. Es la fuente oficial más completa sobre criminalidad en México.

## Estructura técnica

El dataset contiene **3 archivos CSV**:

### Recurso 1: Incidencia delictiva estatal

- **Archivo**: `INM_estatal_nov25.csv`
- **Tamaño**: ~48.8 MB
- **Columnas**: ~18 (incluye meses como columnas)

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `Entidad` | text | Nombre del estado | `Aguascalientes` |
| `Bien jurídico afectado` | text | Categoría legal del delito | `La vida y la Integridad corporal` |
| `Tipo de delito` | text | Tipo de delito | `Homicidio` |
| `Subtipo de delito` | text | Subtipo | `Homicidio doloso` |
| `Modalidad` | text | Modalidad específica | `Con arma de fuego` |
| `Año` | int | Año | `2023` |
| `Enero` | int | Incidentes en enero | `45` |
| `Febrero` | int | Incidentes en febrero | `38` |
| ... | ... | (un columna por cada mes) | ... |
| `Diciembre` | int | Incidentes en diciembre | `41` |

### Recurso 2: Incidencia delictiva municipal

- **Archivo**: `IDM_NM_nov25.csv`
- Misma estructura que el estatal, pero agrega columnas `Municipio` y código de municipio.
- Significativamente más grande (~50,000-100,000+ filas)

### Recurso 3: Víctimas del fuero común

- **Archivo**: `IDVFC_NM_nov25.csv`
- Agrega columnas `Sexo` y `Rango de edad` al desglose de delitos.
- Disponible para 36 de los 98 tipos de delito.

### Clasificación de delitos (Instrumento CNSP/38/15)

Los delitos se organizan en 7 categorías de bien jurídico afectado:

| Bien jurídico | Delitos principales |
|---|---|
| La vida y la Integridad corporal | Homicidio doloso/culposo, feminicidio, lesiones |
| La libertad personal | Secuestro, tráfico de menores, rapto |
| La libertad y seguridad sexual | Violación, abuso sexual, acoso |
| El patrimonio | Robo (vehículo, casa, negocio, transeúnte), fraude, extorsión |
| La familia | Violencia intrafamiliar, violencia de género |
| La sociedad | Trata de personas, corrupción de menores |
| Otros | Delitos varios |

### Muestra de datos

```csv
Entidad,Bien jurídico afectado,Tipo de delito,Subtipo de delito,Modalidad,Año,Enero,Febrero,...,Diciembre
Aguascalientes,La vida y la Integridad corporal,Homicidio,Homicidio doloso,Con arma de fuego,2023,3,2,...,4
```

## Cobertura

- **Temporal**: 2015 a noviembre 2025 (~11 años, mensual). Actualización mensual con ~30 días de rezago.
- **Geográfica**:
  - Estatal: 32 entidades federativas
  - Municipal: Todos los municipios de México (~2,500)
- **Delitos**: 53 tipos y 98 subtipos/modalidades
- **Víctimas**: Desglose por sexo (Hombre/Mujer) y rango de edad para 36 tipos de delito
- **Fuente de datos**: Carpetas de investigación abiertas por las Procuradurías y Fiscalías Generales de los estados

## Acceso

| Recurso | URL |
|---|---|
| **Estatal** | https://repodatos.atdt.gob.mx/api_update/sesnsp/incidencia_delictiva/INM_estatal_nov25.csv |
| **Municipal** | https://repodatos.atdt.gob.mx/api_update/sesnsp/incidencia_delictiva/IDM_NM_nov25.csv |
| **Víctimas** | https://repodatos.atdt.gob.mx/api_update/sesnsp/incidencia_delictiva/IDVFC_NM_nov25.csv |
| **Dataset completo** | https://datos.gob.mx/dataset/incidencia_delictiva |
| **Portal SESNSP** | https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Mapa choropleth**: Tasa de homicidios dolosos por estado o municipio, con slider de año para ver evolución 2015-2025.
- **Series de tiempo**: Evolución mensual de un delito específico (e.g., homicidio doloso) a nivel nacional, con anotaciones de eventos clave.
- **Heatmap estado × delito**: Matriz mostrando la concentración de cada tipo de delito por estado.
- **Small multiples**: Un panel por estado con la serie de homicidios, permitiendo comparar trayectorias regionales.
- **Bump chart**: Ranking de estados por incidencia de un delito, mostrando cómo cambian las posiciones año con año.
- **Treemap de delitos**: Distribución de los 53 tipos de delito a nivel nacional, agrupados por bien jurídico afectado.
- **Pirámide de víctimas**: Distribución por sexo y edad de las víctimas de delitos violentos.

## Notas

- **Nombres de archivo cambian**: Los archivos incluyen el mes de actualización en el nombre (e.g., `nov25`). Las URLs se actualizan mensualmente.
- **Cifra negra**: Los datos reflejan delitos denunciados (carpetas de investigación), no la criminalidad real. La cifra negra en México es alta (~93% según ENVIPE).
- **Formato ancho**: Los meses son columnas (Enero, Febrero, ..., Diciembre), no filas. Se necesita pivotar a formato largo para la mayoría de visualizaciones.
- **Actualizaciones retroactivas**: Los datos de meses anteriores pueden revisarse en publicaciones posteriores.
- **Archivo grande**: El CSV estatal es ~49 MB; el municipal es significativamente mayor. Considerar procesamiento con scripts.
- **Sin coordenadas**: Los datos son por entidad/municipio (nombre), no incluyen latitud/longitud.
- **Datasets relacionados**: ENVIPE (Encuesta Nacional de Victimización) de INEGI complementa estos datos con cifra negra y percepción de inseguridad.
