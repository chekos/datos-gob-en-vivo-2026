# Remesas por municipio

## Fuente

- **Institución**: Secretaría General del Consejo Nacional de Población (CONAPO)
- **Dataset**: [Remesas - Base de datos](https://datos.gob.mx/dataset/remesas)
- **Licencia**: Creative Commons Attribution 4.0
- **Fuente primaria**: Banco de México (Banxico), cuadro [CE166](https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadro&idCuadro=CE166)

## Descripción

Ingresos por remesas familiares hacia México desglosados a nivel municipal. Los datos son trimestrales e incluyen el monto recibido en millones de dólares, la región migratoria a la que pertenece cada municipio y su grado de intensidad migratoria. Permite analizar cómo se distribuyen las remesas geográficamente y cómo han evolucionado desde 2013.

## Estructura técnica

El dataset contiene **1 archivo CSV** con todas las dimensiones:

- **Archivo**: `remesas_2013-2024.csv`
- **Tamaño**: ~8.9 MB
- **Filas**: ~118,000+ (todos los municipios × 4 trimestres × 12 años)
- **Columnas**: 10

| Columna | Tipo | Descripción |
|---|---|---|
| `cve_ent` | int | Clave de entidad federativa (INEGI) |
| `nom_ent` | text | Nombre de la entidad federativa |
| `cve_mun` | int | Clave del municipio (formato EEMMM) |
| `nom_mun` | text | Nombre del municipio |
| `trim` | text | Trimestre (`Ene-Mar`, `Abr-Jun`, `Jul-Sep`, `Oct-Dic`) |
| `aaaa` | int | Año |
| `rem` | float | Monto de remesas recibidas (millones de USD) |
| `reg_mig` | text | Región migratoria (`Tradicional`, `Norte`, `Sur-Sureste`, `Centro`) |
| `giim_ent` | text | Grado de intensidad migratoria a nivel entidad |
| `giim_mun` | text | Grado de intensidad migratoria a nivel municipio |

### Muestra de datos

```csv
cve_ent,nom_ent,cve_mun,nom_mun,trim,aaaa,rem,reg_mig,giim_ent,giim_mun
1,Aguascalientes,1001,Aguascalientes,Ene-Mar,2013,40.690177,Tradicional,Alto,Bajo
1,Aguascalientes,1002,Asientos,Ene-Mar,2013,1.275886,Tradicional,Alto,Alto
1,Aguascalientes,1003,Calvillo,Ene-Mar,2013,10.178654,Tradicional,Alto,Muy alto
32,Zacatecas,32056,Zacatecas,Oct-Dic,2024,42.481471,Tradicional,Muy alto,Bajo
```

## Cobertura

- **Temporal**: 2013 Q1 a 2024 Q4 (trimestral, ~48 trimestres)
- **Geográfica**: Todos los municipios de México (~2,469 municipios en 32 entidades federativas)
- **Nivel**: Municipal (con claves INEGI directas en `cve_ent` y `cve_mun`)
- **Categoría especial**: Existe una categoría `"No identificado"` (clave `XX999`) para remesas que no se pudieron asignar a un municipio específico
- **Regiones migratorias**: Tradicional, Norte, Sur-Sureste, Centro
- **Grados de intensidad migratoria**: Muy alto, Alto, Medio, Bajo, Muy bajo, No aplica

## Acceso

| Recurso | URL de descarga |
|---|---|
| CSV completo | https://repodatos.atdt.gob.mx/api_update/conapo/remesas/remesas_2013-2024.csv |

Se puede cargar directamente con pandas:

```python
import pandas as pd
df = pd.read_csv("https://repodatos.atdt.gob.mx/api_update/conapo/remesas/remesas_2013-2024.csv")
```

### Fuentes complementarias

| Fuente | Nivel | Periodo | Formato |
|---|---|---|---|
| Banxico SIE (CE166) | Municipal (todo México) | 2003-2024 trim. | HTML/Excel |
| Banxico SIE (CE100) | Entidad federativa | 2003-2024 trim. | HTML/Excel |
| OMI/CONAPO | Municipal (todo México) | 2013-2024 trim. | Interactivo (web) |
| COESPO San Luis Potosí | Municipal (solo SLP) | Variable | CSV |
| IIEG Jalisco | Municipal (solo Jalisco) | 2003-2021+ | XLS |

## Potencial de visualización

Con Observable Plot se pueden construir:

- **Mapa choropleth**: Remesas totales por municipio o entidad para un año o trimestre dado. Las claves INEGI (`cve_ent`, `cve_mun`) permiten vincular directamente con geometrías.
- **Series de tiempo**: Evolución trimestral de remesas a nivel nacional, por entidad o por municipio, mostrando tendencias y estacionalidad.
- **Top N dinámico**: Los 10 o 20 municipios/estados que más remesas reciben, con slider temporal para ver cambios en el ranking.
- **Mapa por región migratoria**: Colorear municipios según su región migratoria (`reg_mig`) y dimensionar por monto de remesas.
- **Heatmap**: Matriz entidad × trimestre con intensidad de remesas, revelando patrones estacionales y geográficos.
- **Comparación por intensidad migratoria**: Agrupar municipios por `giim_mun` y comparar montos promedio de remesas, mostrando la relación entre migración e ingresos.

## Notas

- **Unidad**: Todos los valores de `rem` están en **millones de dólares estadounidenses**.
- **Claves INEGI**: El dataset incluye claves numéricas de entidad y municipio compatibles con catálogos INEGI, facilitando cruces con otros datasets y geometrías.
- **Datos preliminares**: Los datos son preliminares y sujetos a revisión en actualizaciones posteriores.
- **Datos de 2025**: No disponibles aún a nivel municipal en formato estructurado. CONAPO publicó una infografía con datos nacionales agregados al corte de junio 2025, pero sin desglose municipal. Es razonable esperar que el CSV se actualice a `remesas_2013-2025.csv` cuando los datos del año estén completos.
- **Fuente original**: Banxico genera los datos; CONAPO los redistribuye en formato CSV en datos.gob.mx. Banxico ofrece series más largas (desde 2003) pero en formatos menos accesibles programáticamente.
- **Última actualización**: 27 de octubre de 2025 (archivo), catalogado el 5 de noviembre de 2025.
