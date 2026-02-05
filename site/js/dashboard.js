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
  // Build a Date from the reading's fecha + hora (treat as UTC for simplicity)
  const readingTime = new Date(`${fecha}T${String(hora).padStart(2, "0")}:00:00Z`);
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

  // Render bar charts for each pollutant
  renderBarChart("chart-pm25", "PM2.5", lecturas, estacionMap);
  renderBarChart("chart-o3", "O3", lecturas, estacionMap);
  renderBarChart("chart-co", "CO", lecturas, estacionMap);

  // Render freshness legend
  renderLegend();

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
      // Create a proper timestamp for x-axis sorting across dates
      timestamp: new Date(`${l.fecha}T${String(l.hora).padStart(2, "0")}:00:00Z`),
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

main();
