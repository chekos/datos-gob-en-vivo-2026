// Dashboard SINAICA - Calidad del Aire en México
// Carga datos estáticos de data/sinaica.json y renderiza con Observable Plot

const UMBRALES = {
  "PM2.5": { valor: 45, unidad: "µg/m³" },
  "O3": { valor: 0.07, unidad: "ppm" },
  "CO": { valor: 11, unidad: "ppm" },
};

// Freshness thresholds (in hours)
const FRESCO_MAX = 6;
const TIBIO_MAX = 24;

function getFrescura(fecha, hora) {
  // SINAICA hours are in local Mexican time (CST = UTC-6)
  const readingTime = new Date(`${fecha}T${String(hora).padStart(2, "0")}:00:00-06:00`);
  const now = new Date();
  const diffH = (now - readingTime) / (1000 * 60 * 60);
  if (diffH <= FRESCO_MAX) return "fresco";
  if (diffH <= TIBIO_MAX) return "tibio";
  return "stale";
}

function frescuraLabel(frescura, fecha) {
  if (frescura === "fresco") return "";
  if (frescura === "tibio") return ` · ${fecha}`;
  return ` · ${fecha} ⚠`;
}

// Colors per freshness level (grayscale palette)
const FILL_FRESCO = "#1a1a1a";
const FILL_TIBIO = "#a3a3a3";
const FILL_STALE = "#d4d4d4";

function fillForReading(d) {
  const f = getFrescura(d.fecha, d.hora);
  if (f === "fresco") return FILL_FRESCO;
  if (f === "tibio") return FILL_TIBIO;
  return FILL_STALE;
}

async function main() {
  let data;
  try {
    const resp = await fetch("data/sinaica.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    data = await resp.json();
  } catch (e) {
    document.getElementById("timestamp").textContent =
      "Error cargando datos: " + e.message;
    document.getElementById("timestamp").classList.remove("loading");
    return;
  }

  const { estaciones, lecturas, ultima_actualizacion } = data;

  // Build lookup map
  const estacionMap = new Map(estaciones.map((e) => [e.id, e]));

  // Update status bar
  const ts = new Date(ultima_actualizacion);
  const timestampEl = document.getElementById("timestamp");
  timestampEl.textContent =
    ts.toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " (centro de México)";
  timestampEl.classList.remove("loading");

  const estacionesConDatos = new Set(lecturas.map((l) => l.estacion_id));
  document.getElementById("stats").textContent =
    `${estacionesConDatos.size} estaciones · 3 contaminantes`;

  // Render map section (geo + strip)
  const pm25datos = getUltimaLectura(lecturas, "PM2.5", estacionMap);
  await renderMapSection(pm25datos, estacionMap);

  // Render freshness legend
  renderLegend();

  // Render bar charts for each pollutant
  renderBarChart("chart-pm25", "PM2.5", lecturas, estacionMap);
  renderBarChart("chart-o3", "O3", lecturas, estacionMap);
  renderBarChart("chart-co", "CO", lecturas, estacionMap);

  // Populate station selector and render trend chart
  setupTendencia(estaciones, lecturas, estacionMap);
}

function getUltimaLectura(lecturas, param, estacionMap) {
  // Filter by param, get latest reading per station
  const porEstacion = new Map();
  for (const l of lecturas) {
    if (l.param !== param) continue;
    if (l.valor === null || l.valor < 0) continue;
    const key = l.estacion_id;
    const existing = porEstacion.get(key);
    // Prefer the most recent reading (by date then hour)
    if (
      !existing ||
      l.fecha > existing.fecha ||
      (l.fecha === existing.fecha && l.hora > existing.hora)
    ) {
      porEstacion.set(key, l);
    }
  }

  return Array.from(porEstacion.values())
    .map((l) => {
      const frescura = getFrescura(l.fecha, l.hora);
      const est = estacionMap.get(l.estacion_id);
      const label =
        (est?.nombre ?? `Est. ${l.estacion_id}`) +
        frescuraLabel(frescura, l.fecha);
      return {
        ...l,
        nombre: est?.nombre ?? `Est. ${l.estacion_id}`,
        label,
        red: est?.red ?? "",
        lat: est?.lat,
        lon: est?.lon,
        frescura,
      };
    })
    .sort((a, b) => b.valor - a.valor);
}

function renderBarChart(containerId, param, lecturas, estacionMap) {
  const container = document.getElementById(containerId);
  const datos = getUltimaLectura(lecturas, param, estacionMap);

  if (datos.length === 0) {
    container.innerHTML = '<p class="loading">Sin datos disponibles</p>';
    return;
  }

  const umbral = UMBRALES[param].valor;
  const width = Math.min(container.clientWidth, 920);

  const chart = Plot.plot({
    width,
    height: Math.max(datos.length * 28, 200),
    marginLeft: 180,
    marginRight: 60,
    x: {
      label: UMBRALES[param].unidad,
      grid: true,
    },
    y: {
      label: null,
      domain: datos.map((d) => d.label),
    },
    marks: [
      Plot.barX(datos, {
        x: "valor",
        y: "label",
        fill: (d) => fillForReading(d),
        tip: true,
        title: (d) => {
          const f = getFrescura(d.fecha, d.hora);
          const tag =
            f === "fresco" ? "Fresco" : f === "tibio" ? "Tibio" : "Caduco";
          return `${d.nombre} (${d.red})\n${d.valor} ${UMBRALES[param].unidad}\n${d.fecha} ${d.hora}:00\n${tag}`;
        },
      }),
      Plot.ruleX([umbral], {
        stroke: "#a3a3a3",
        strokeWidth: 2,
        strokeDasharray: "6,4",
      }),
      Plot.text([{ x: umbral }], {
        x: "x",
        text: [`NOM: ${umbral}`],
        dy: -10,
        fill: "#737373",
        fontSize: 11,
        textAnchor: "start",
        dx: 4,
        frameAnchor: "top",
      }),
    ],
  });

  container.innerHTML = "";
  container.appendChild(chart);
}

function renderLegend() {
  const container = document.getElementById("freshness-legend");
  if (!container) return;
  container.innerHTML = `
    <span><span class="swatch" style="background:${FILL_FRESCO}"></span> Fresco (&lt;${FRESCO_MAX}h)</span>
    <span><span class="swatch" style="background:${FILL_TIBIO}"></span> Tibio (${FRESCO_MAX}–${TIBIO_MAX}h)</span>
    <span><span class="swatch" style="background:${FILL_STALE}"></span> Caduco (&gt;${TIBIO_MAX}h)</span>
  `;
}

function setupTendencia(estaciones, lecturas, estacionMap) {
  const select = document.getElementById("estacion-select");
  select.innerHTML = "";

  // Only include stations that have data
  const estacionesConDatos = estaciones.filter((e) =>
    lecturas.some((l) => l.estacion_id === e.id)
  );

  for (const est of estacionesConDatos) {
    const opt = document.createElement("option");
    opt.value = est.id;
    opt.textContent = `${est.nombre} (${est.red})`;
    select.appendChild(opt);
  }

  if (estacionesConDatos.length > 0) {
    renderTendencia(estacionesConDatos[0].id, lecturas, estacionMap);
  }

  select.addEventListener("change", () => {
    renderTendencia(Number(select.value), lecturas, estacionMap);
  });
}

function renderTendencia(estacionId, lecturas, estacionMap) {
  const container = document.getElementById("chart-tendencia");
  const datos = lecturas
    .filter((l) => l.estacion_id === estacionId && l.valor !== null && l.valor >= 0)
    .map((l) => ({
      ...l,
      // SINAICA hours are in local Mexican time (CST = UTC-6)
      timestamp: new Date(`${l.fecha}T${String(l.hora).padStart(2, "0")}:00:00-06:00`),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (datos.length === 0) {
    container.innerHTML = '<p class="loading">Sin datos para esta estación</p>';
    return;
  }

  const width = Math.min(container.clientWidth, 920);

  const chart = Plot.plot({
    width,
    height: 200,
    marginLeft: 50,
    marginRight: 20,
    x: {
      label: "Hora",
      type: "utc",
    },
    y: {
      label: "Valor",
      grid: true,
    },
    color: {
      domain: ["PM2.5", "O3", "CO"],
      range: ["#1a1a1a", "#737373", "#a3a3a3"],
      legend: true,
    },
    facet: {
      data: datos,
      y: "param",
    },
    fy: {
      label: null,
    },
    marks: [
      Plot.line(datos, {
        x: "timestamp",
        y: "valor",
        stroke: "param",
        strokeWidth: 2,
        tip: true,
        title: (d) =>
          `${d.param}: ${d.valor} ${UMBRALES[d.param]?.unidad ?? ""}\n${d.fecha} ${d.hora}:00`,
      }),
      Plot.dot(datos, {
        x: "timestamp",
        y: "valor",
        fill: "param",
        r: 3,
      }),
    ],
  });

  container.innerHTML = "";
  container.appendChild(chart);
}

const MEXICO_TOPOJSON_URL =
  "https://gist.githubusercontent.com/leenoah1/535b386ec5f5abdb2142258af395c388/raw/a045778d28609abc036f95702d6a44045ae7ca99/geo-data.json";

async function renderMapSection(pm25datos, estacionMap) {
  // Fetch Mexico TopoJSON
  let mexico;
  try {
    const resp = await fetch(MEXICO_TOPOJSON_URL);
    const topo = await resp.json();
    mexico = topojson.feature(topo, topo.objects.MEX_adm1);
  } catch (e) {
    document.getElementById("chart-map").innerHTML =
      '<p class="loading">Error cargando mapa</p>';
    return;
  }

  renderGeoMap("chart-map", mexico, pm25datos);
  renderStripMap("chart-strip", pm25datos);
}

function renderGeoMap(containerId, mexico, datos) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth || 500;
  const height = Math.round(width * 0.7);

  // Merge station coords with PM2.5 readings
  const points = datos.map((d) => ({
    ...d,
    r: Math.max(Math.sqrt(d.valor) * 1.8, 4),
  }));

  const chart = Plot.plot({
    width,
    height,
    projection: {
      type: "conic-conformal",
      parallels: [17.5, 29.5],
      rotate: [102, 0],
      domain: mexico,
    },
    marks: [
      Plot.geo(mexico, {
        fill: "#f5f5f5",
        stroke: "#d4d4d4",
        strokeWidth: 0.5,
      }),
      Plot.dot(points, {
        x: "lon",
        y: "lat",
        r: "r",
        fill: (d) => fillForReading(d),
        stroke: "#fafafa",
        strokeWidth: 1,
        tip: true,
        title: (d) =>
          `${d.nombre} (${d.red})\nPM2.5: ${d.valor} µg/m³\n${d.fecha} ${d.hora}:00`,
      }),
      Plot.text(
        points.filter((d) => d.valor > 20),
        {
          x: "lon",
          y: "lat",
          text: (d) => `${Math.round(d.valor)}`,
          dy: -12,
          fontSize: 10,
          fill: "#525252",
        }
      ),
    ],
  });

  container.innerHTML = "";
  container.appendChild(chart);
}

function renderStripMap(containerId, datos) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth || 200;

  // Sort by latitude (north to south)
  const sorted = [...datos].sort((a, b) => {
    const latA = a.lat ?? 0;
    const latB = b.lat ?? 0;
    return latB - latA;
  });

  const chart = Plot.plot({
    width,
    height: Math.max(sorted.length * 24, 200),
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    marginBottom: 20,
    x: {
      label: "µg/m³",
      grid: true,
    },
    y: {
      label: null,
      domain: sorted.map((d) => d.nombre),
      axis: null,
    },
    marks: [
      Plot.barX(sorted, {
        x: "valor",
        y: "nombre",
        fill: (d) => fillForReading(d),
        tip: true,
        title: (d) =>
          `${d.nombre}\n${d.valor} µg/m³\n${d.fecha} ${d.hora}:00`,
      }),
      Plot.text(sorted, {
        x: 0,
        y: "nombre",
        text: "nombre",
        textAnchor: "start",
        dx: 4,
        fill: "#fafafa",
        fontSize: 9,
        fontWeight: 700,
      }),
      Plot.ruleX([UMBRALES["PM2.5"].valor], {
        stroke: "#a3a3a3",
        strokeWidth: 1.5,
        strokeDasharray: "4,3",
      }),
    ],
  });

  container.innerHTML = "";
  container.appendChild(chart);
}

main();
