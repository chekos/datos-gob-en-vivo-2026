# Permisos de generación de energía eléctrica

## Fuente

- **Institución**: Comisión Nacional de Energía (CNE)
- **Dataset**: [Permisos otorgados de generación de energía eléctrica](https://www.datos.gob.mx/dataset/a0cc9baf-bd9b-43d2-9fc5-0d322690f920)
- **Licencia**: Creative Commons Attribution 4.0

## Descripción

Registro de los 2,504 permisos otorgados para generación de energía eléctrica en México. Incluye información sobre el permisionario, tipo de energía (renovable vs. fósil), capacidad autorizada, inversión estimada, tecnología utilizada, y ubicación geográfica (estado, municipio, dirección).

Permite analizar la composición del sector eléctrico distribuido en México: qué proporción es renovable vs. fósil, dónde se concentra la generación, y cuánta inversión atrae cada tipo de energía.

## Estructura técnica

- **Formato**: CSV
- **Filas**: 2,504 permisos
- **Columnas**: 23

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `num_permiso` | text | Identificador del permiso | `E/001/AUT/2001` |
| `permisionario` | text | Empresa titular del permiso | `Ingenio El Potrero` |
| `modalidad` | text | Modalidad del permiso | `AUT.`, `COG.`, `PIE.`, `GEN.` |
| `fecha_otorgamiento` | date | Fecha de otorgamiento | `2001-03-15` |
| `cap_aut_mw` | float | Capacidad autorizada en megawatts | `49.3` |
| `gen_est_gwh_anio` | float | Generación estimada anual en GWh | `157.0` |
| `inv_est_mmusd` | float | Inversión estimada en millones USD | `59.16` |
| `fecha_ent_ope` | date | Fecha de entrada en operación | `2003-06-01` |
| `e_primario` | text | Fuente de energía primaria | `Gas Natural`, `Eólica`, `Agua` |
| `act_economica` | text | Sector de actividad económica | `Industria azucarera` |
| `tecnologia` | text | Tipo de tecnología | `Ciclo combinado`, `Turbina eólica` |
| `edo_actual` | text | Estado operativo actual | `Vigente`, `No vigente` |
| `t_modificacion` | text | Tipo de modificación | |
| `fecha_modificacion` | date | Fecha de última modificación | |
| `fecha_terminacion` | date | Fecha de terminación del permiso | |
| `entidad` | text | Estado | `Veracruz`, `Tamaulipas` |
| `municipio` | text | Municipio | `Córdoba` |
| `direccion` | text | Dirección física de la planta | |
| `empresa_lider` | text | Empresa matriz o líder | |
| `p_origen` | text | País de origen de la inversión | |
| `subasta` | text | Información de subasta eléctrica | |
| `ley_aplicable` | text | Marco legal aplicable | |
| `cond_vigencia` | text | Condiciones de vigencia | |

### Muestra de datos

```csv
num_permiso,permisionario,modalidad,fecha_otorgamiento,cap_aut_mw,gen_est_gwh_anio,inv_est_mmusd,...,e_primario,...,entidad,municipio
E/001/AUT/2001,Ingenio El Potrero,AUT.,2001-03-15,49.3,157.0,59.16,...,Bagazo de caña,...,Veracruz,Córdoba
```

## Cobertura

- **Temporal**: Permisos desde 1963 hasta 2025. Actualización mensual (último: noviembre 2025).
- **Geográfica**: Todos los estados de México. Estados con más permisos: Veracruz, Campeche, San Luis Potosí, Tamaulipas, Nuevo León.
- **Fuentes de energía primaria**:
  - **Renovables (~28%)**: Agua (hidroeléctrica), Eólica, Bagazo de caña, Biogás
  - **Fósiles (~72%)**: Gas Natural, Diesel, Combustóleo, Coque
- **Modalidades de permiso**: Autoabastecimiento (AUT.), Cogeneración (COG.), Productor Independiente (PIE.), Generación (GEN.), Importación/Exportación
- **Rango de capacidad**: 1.5 MW a 49+ MW por permiso

## Acceso

| Recurso | URL |
|---|---|
| **Descarga CSV** | https://repodatos.atdt.gob.mx/api_update/cne/permisos_otargados_generacion_energia_electrica/01_permisos_generacion.csv |
| **Dataset completo** | https://www.datos.gob.mx/dataset/a0cc9baf-bd9b-43d2-9fc5-0d322690f920 |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Treemap energético**: Distribución de capacidad instalada por fuente de energía primaria, mostrando la proporción renovable vs. fósil.
- **Mapa de puntos**: Ubicación de plantas por estado/municipio (requiere geocodificar direcciones), coloreadas por tipo de energía.
- **Serie temporal de permisos**: Acumulado de permisos otorgados por año, apilados por fuente de energía, mostrando la transición energética.
- **Scatter plot inversión vs. capacidad**: Relación entre inversión estimada (USD) y capacidad autorizada (MW) por tipo de tecnología.
- **Top permisionarios**: Empresas con mayor capacidad instalada, agrupadas por sector económico.

## Notas

- **Sin coordenadas geográficas**: El dataset tiene estado, municipio y dirección, pero no latitud/longitud. Se necesitaría geocodificar para mapear puntos exactos.
- **Permisos, no generación real**: Los datos reflejan permisos otorgados y capacidad autorizada, no producción eléctrica real.
- **Inversión en USD**: Los montos de inversión están en millones de dólares estadounidenses.
- **Permisos vigentes y no vigentes**: El campo `edo_actual` indica si el permiso sigue activo.
- **Sesgo sectorial**: Predominan permisos de autoabastecimiento para industria (azucarera, petroquímica, cementera), no utilities públicas.
