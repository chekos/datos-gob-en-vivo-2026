# Nota: las dos plataformas de datos.gob.mx

## Qué pasó

Los 10 datasets de este proyecto se seleccionaron el 5 de febrero de 2026 usando Claude Code. Claude lanzó agentes que navegaron datos.gob.mx de forma autónoma buscando datasets interesantes para visualizar.

Después, el equipo del portal nos avisó que algunos datasets no aparecían en la interfaz actual del sitio. Revisamos los transcripts de la sesión para entender qué pasó.

## Dos plataformas, un dominio

Al 6 de febrero de 2026, `datos.gob.mx` tiene dos sistemas corriendo en paralelo:

1. **Sistema Ajolote** (la nueva): La página principal. Reporta 4,875 datasets de 170 instituciones. Es lo que ves al entrar a `datos.gob.mx`.

2. **CKAN** (la anterior): Sigue viva en el mismo dominio. Se accede por:
   - La API: `datos.gob.mx/api/3/action/package_search`
   - La interfaz web: `datos.gob.mx/busca/dataset`
   - Tiene ~1,068 datasets

3. **Archivo histórico**: Un tercer nivel en `historico.datos.gob.mx`, enlazado desde la página principal.

## Lo que hizo Claude

Revisamos los transcripts de la sesión `865eaa8d`. Claude lanzó 5 agentes en total:

**Dos agentes de descubrimiento:**
- Uno entró a `datos.gob.mx`, encontró la API CKAN, y le hizo 22 consultas buscando por temas (salud, economía, medio ambiente, criminalidad, etc.). También navegó `datos.gob.mx/busca/dataset`.
- Otro buscó en Google datasets mexicanos mencionados en blogs, GitHub y documentación.

**Tres agentes de perfilado** que descargaron CSVs, inspeccionaron columnas y verificaron URLs. También usaron la API CKAN para metadatos.

En resumen: Claude descubrió los 10 datasets a través de la plataforma CKAN, no de Sistema Ajolote.

## Verificación: qué existe en la plataforma nueva

Buscamos cada dataset en la plataforma nueva:

| # | Dataset | En plataforma nueva | Slug |
|---|---|---|---|
| 01 | Esperanza de vida (CONAPO) | Si | `proyecciones-de-poblacion` |
| 02 | Inversión Extranjera Directa (SE) | Si | `inversion_extranjera_directa` |
| 03 | Calidad del aire - SINAICA (INECC) | Parcial | Solo aparecen datasets genéricos de "calidad del aire", no el de SINAICA |
| 04 | Ocupación hotelera (SECTUR) | Si | `ocupacion_hotelera_70_destinos_principales_monitoreados_datatur` |
| 05 | Permisos generación eléctrica (CNE) | Si | `permisos_otorgados_generacion_energia_electrica` |
| 06 | Violencia contra mujeres (SM) | Si | `violencia_contra_mujeres` |
| 07 | Salud sexual y reproductiva (CONAPO) | Si | `salud_sexual_reproductiva` |
| 08 | Tarifas electricidad (CNE) | Si | `tarifas_finales_suministro_basico` |
| 09 | Incidencia delictiva (SESNSP) | Si | `incidencia_delictiva` |
| 10 | Biodiversidad - SNIB (CONABIO) | **No** | CONABIO no aparece como institución en la plataforma nueva |

8 de 10 se encuentran en la plataforma nueva.

SINAICA aparece de forma indirecta: la nueva plataforma tiene datasets de "calidad del aire" del INECC, pero no con el nombre del sistema SINAICA que Claude encontró en CKAN.

CONABIO/SNIB no existe en la plataforma nueva. Ni la institución ni sus datasets. Este se encontró por búsquedas web y la API CKAN.

Las URLs de descarga de los CSV (en `repodatos.atdt.gob.mx`) funcionan igual en ambas plataformas.

## Por qué pasó

La API CKAN responde en JSON estructurado. Para un agente de IA que navega la web, un endpoint que devuelve datos estructurados es mucho más útil que una interfaz diseñada para humanos. Claude la encontró, la usó, y nunca necesitó la interfaz nueva.

Sistema Ajolote no expone una API pública equivalente, así que cualquier agente de IA que llegue a datos.gob.mx va a terminar en CKAN.

## Qué hicimos al respecto

Actualizamos las URLs en los documentos de `/docs/` para que apunten a la plataforma actual cuando fue posible. Las URLs de descarga de archivos no cambiaron porque ambas plataformas usan el mismo servidor (`repodatos.atdt.gob.mx`).

Si encuentras un enlace que lleva a una interfaz distinta a la que esperas, probablemente apunta a CKAN. La referencia canónica es `datos.gob.mx`.
