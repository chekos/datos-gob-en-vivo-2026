# Calidad del aire - SINAICA

## Fuente

- **Institución**: Instituto Nacional de Ecología y Cambio Climático (INECC), bajo SEMARNAT
- **Sistema**: Sistema Nacional de Información de la Calidad del Aire (SINAICA)
- **Portal**: https://sinaica.inecc.gob.mx/
- **Datos.gob.mx**: [Mediciones de contaminantes del SINAICA](https://www.datos.gob.mx/busca/dataset/mediciones-de-contaminantes-del-sistema-nacional-de-informacion-de-la-calidad-del-aire)

## Descripción

SINAICA recopila, almacena y distribuye datos de calidad del aire de estaciones de monitoreo en toda la República Mexicana. Incluye mediciones horarias de contaminantes criterio (PM10, PM2.5, O3, NO2, SO2, CO) y parámetros meteorológicos (temperatura, humedad, viento), tanto en tiempo real como validados históricamente.

Es el sistema de referencia para monitoreo de calidad del aire en México, con más de 249 estaciones distribuidas en 103 ciudades y áreas metropolitanas de 30 entidades federativas.

## Estructura técnica

### Datos de medición (respuesta de la API)

Cada registro representa una lectura horaria de un contaminante en una estación:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Clave compuesta: stationId + parámetro + fecha/hora |
| `fecha` | string | Fecha en formato `YYYY-MM-DD` |
| `hora` | int | Hora del día (0-23) |
| `valor` | float | Valor medido (en la unidad del parámetro) |
| `bandO` | string | Bandera/indicador (generalmente vacío) |
| `val` | int | Indicador de validez (1 = válido) |

### Muestra de datos

```json
[
  {"id": "271O326020100", "fecha": "2026-02-01", "hora": 0, "valor": 0.001, "bandO": "", "val": 1},
  {"id": "271O326020101", "fecha": "2026-02-01", "hora": 1, "valor": 0.002, "bandO": "", "val": 1}
]
```

### Información de estaciones

Las estaciones tienen 26 atributos, incluyendo:

| Campo | Tipo | Descripción |
|---|---|---|
| `station_id` | int | ID numérico de la estación |
| `station_name` | string | Nombre de la estación |
| `network_name` | string | Red de monitoreo |
| `state_code` | int | Código INEGI del estado |
| `municipio_code` | int | Código INEGI del municipio |
| `lat` | float | Latitud |
| `lon` | float | Longitud |
| `altitude` | float | Altitud en metros |
| `year_started` | string | Año de inicio de operaciones |

## Cobertura

- **Temporal**: Desde 1997 (varía por estación) hasta tiempo real
- **Geográfica**: 34 sistemas de monitoreo en 30 entidades federativas, 249+ estaciones en 103 ciudades
- **Frecuencia**: Horaria (24 lecturas por día por parámetro por estación)
- **Tipos de datos**:
  - **Crudo** (tiempo real, sin validar)
  - **Validado** (limpiado y verificado)
  - **Manual** (muestras de laboratorio, e.g., filtros de PM)

### Contaminantes criterio

| Código | Contaminante | Unidad |
|---|---|---|
| `O3` | Ozono | ppm |
| `PM10` | Partículas menores a 10 micras | µg/m³ |
| `PM2.5` | Partículas menores a 2.5 micras | µg/m³ |
| `NO2` | Dióxido de nitrógeno | ppm |
| `SO2` | Dióxido de azufre | ppm |
| `CO` | Monóxido de carbono | ppm |

### Parámetros meteorológicos disponibles

| Código | Parámetro | Unidad |
|---|---|---|
| `TMP` | Temperatura | °C |
| `HR` | Humedad relativa | % |
| `VV` | Velocidad del viento | m/s |
| `DV` | Dirección del viento | grados |
| `PB` | Presión barométrica | mmHg |
| `RS` | Radiación solar | W/m² |
| `PP` | Precipitación | mm |

### Redes principales (por número de estaciones)

| Red | Estaciones |
|---|---|
| Valle de México | 59 |
| Municipio de Juárez | 15 |
| Monterrey | 14 |
| Toluca | 12 |
| Zona Metropolitana de Querétaro | 11 |
| Guadalajara | 10 |
| Mexicali | 10 |

## Acceso

### API directa de SINAICA (funcional)

La API del portal SINAICA usa POST con formularios:

**Obtener datos de una estación:**
```
POST https://sinaica.inecc.gob.mx/pags/datGrafs.php

Parámetros:
  estacionId: 271          # ID de estación
  param: O3                # Código del contaminante
  fechaIni: 2026-02-01     # Fecha de inicio (YYYY-MM-DD)
  rango: 1                 # 1=1 día, 2=1 semana, 3=2 semanas, 4=1 mes
  tipoDatos:               # "" = crudo, "V" = validado, "M" = manual
```

La respuesta es HTML con JavaScript embebido. Los datos están en una variable `var dat = [...]` que contiene un arreglo JSON.

**Obtener parámetros de una estación:**
```
POST https://sinaica.inecc.gob.mx/lib/libd/cnxn.php

Parámetros:
  estId: 271
  metodo: getParamsPorEstAjax
  tipoDatos:
```

Respuesta JSON:
```json
[
  {"id": "O3", "nombre": "Ozono"},
  {"id": "PM10", "nombre": "Particulas menores a 10 micras"},
  {"id": "PM2.5", "nombre": "Particulas menores a 2.5 micras"}
]
```

**Obtener rango de fechas disponibles:**
```
POST https://sinaica.inecc.gob.mx/lib/libd/cnxn.php

Parámetros:
  id: 271
  metodo: getFechasLimiteEstacionAjax
  tipoDatos:
```

Respuesta: `["1997-01-01", "2026-02-05"]`

### API de datos.gob.mx (no disponible)

> **Nota (febrero 2026)**: El servidor `api.datos.gob.mx` (v1 y v2) no está respondiendo (timeout de conexión). La URL documentada era:
> ```
> https://api.datos.gob.mx/v2/sinaica?pageSize=5000&parametro=O3&estacionesid=259&page=1
> ```
> No requiere autenticación. Si vuelve a estar disponible, soporta paginación (`pageSize`, `page`) y filtros por contaminante y estación.

### Herramientas existentes

| Herramienta | Lenguaje | Repositorio |
|---|---|---|
| `rsinaica` | R (CRAN) | https://github.com/diegovalle/rsinaica |
| `api-datos-gob-mx` | Node.js (npm) | https://github.com/weasysolutions/api-datos-gob-mx |
| `calidad-del-aire` | Python/Jupyter | https://github.com/mxabierto/calidad-del-aire |

## Potencial de visualización

Con Observable Plot y JavaScript se pueden construir:

- **Mapa de estaciones**: Puntos en un mapa de México usando `lat`/`lon`, coloreados según el nivel actual de un contaminante (escala del Índice AIRE y SALUD).
- **Dashboard en vivo**: Usando `fetch()` desde JavaScript para llamar a la API de SINAICA directamente y mostrar datos en tiempo real. No requiere autenticación.
- **Series de tiempo**: Evolución horaria/diaria de un contaminante en una estación, con líneas de umbral NOM.
- **Heatmap temporal**: Hora del día × día de la semana para un contaminante, revelando patrones de contaminación urbana.
- **Comparación entre ciudades**: Small multiples comparando niveles de O3 o PM2.5 entre las principales zonas metropolitanas.
- **Rosa de vientos**: Dirección y velocidad del viento combinadas con niveles de contaminante para entender patrones de dispersión.

### Índice AIRE y SALUD (NOM-172-SEMARNAT-2023)

| Nivel | Color | Riesgo |
|---|---|---|
| Buena | Verde | Bajo |
| Aceptable | Amarillo | Moderado |
| Mala | Naranja | Alto |
| Muy Mala | Rojo | Muy alto |
| Extremadamente Mala | Morado | Extremo |

## Notas

- **Autenticación**: Ninguna de las APIs requiere autenticación.
- **Límite por consulta**: La API directa de SINAICA permite máximo 1 mes de datos por solicitud (usar `rango=4`).
- **Delay recomendado**: El paquete `rsinaica` agrega un delay aleatorio de hasta 0.5 segundos entre solicitudes para no sobrecargar el servidor. No hay rate limit formal documentado.
- **Zonas horarias**: Cada estación tiene su propia zona horaria. Algunas estaciones tienen metadatos de zona horaria incorrectos.
- **SSL**: El servidor de SINAICA puede tener problemas con certificados SSL (el paquete R desactiva verificación: `ssl_verifypeer = 0L`).
- **Umbrales de valores extremos**: Valores por encima de estos límites se consideran atípicos y deben tratarse con precaución:

| Parámetro | Umbral |
|---|---|
| O3 | > 0.2 ppm |
| PM10 | > 600 µg/m³ |
| PM2.5 | > 175 µg/m³ |
| NO2 | > 0.21 ppm |
| SO2 | > 0.2 ppm |
| CO | > 15 ppm |

- **Valores negativos**: Deben tratarse como nulos (error de sensor).
- **Datasets relacionados en datos.gob.mx**: "Calidad del aire - Equipos de medición" (INECC) y "Calidad del aire - Emisiones de Contaminantes" (SEMARNAT).
