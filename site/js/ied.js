// Dashboard IED - Inversión Extranjera Directa en México
// Carga datos de data/ied.json y renderiza con Observable Plot + D3

const MEXICO_TOPOJSON_URL =
  "https://gist.githubusercontent.com/leenoah1/535b386ec5f5abdb2142258af395c388/raw/a045778d28609abc036f95702d6a44045ae7ca99/geo-data.json";

// SCIAN sector codes → human-readable names
const SCIAN_NOMBRES = {
  "11": "Agricultura",
  "21": "Minería",
  "22": "Energía y agua",
  "23": "Construcción",
  "31-33": "Manufacturas",
  "43": "Comercio mayorista",
  "46": "Comercio minorista",
  "48-49": "Transporte",
  "51": "Medios e información",
  "52": "Serv. financieros",
  "53": "Serv. inmobiliarios",
  "54": "Serv. profesionales",
  "55": "Corporativos",
  "56": "Serv. de apoyo",
  "61": "Educación",
  "62": "Salud",
  "71": "Esparcimiento",
  "72": "Alojamiento y alimentos",
  "81": "Otros servicios",
  "93": "Gobierno",
};

// Shorten long country names for axis labels (full name in tooltips)
const PAIS_CORTO = {
  "Estados Unidos de América": "Estados Unidos",
  "Reino Unido de la Gran Bretaña e Irlanda del Norte": "Reino Unido",
};

function paisLabel(name) {
  return PAIS_CORTO[name] || name;
}

function sectorLabel(code) {
  return SCIAN_NOMBRES[code] || code;
}

// Format millions compactly: 1,234.5 → "1.2k", 56.3 → "56"
function fmtMillones(v) {
  if (v == null || isNaN(v)) return "—";
  const abs = Math.abs(v);
  if (abs >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return v.toFixed(abs >= 10 ? 0 : 1);
}

let DATA = null;
let TOPO = null;
let currentTab = "pais";

async function main() {
  // 1. Load data and topojson in parallel
  let data, topo;
  try {
    const [dataResp, topoResp] = await Promise.all([
      fetch("data/ied.json"),
      fetch(MEXICO_TOPOJSON_URL),
    ]);
    if (!dataResp.ok) throw new Error(`Data: HTTP ${dataResp.status}`);
    if (!topoResp.ok) throw new Error(`Topo: HTTP ${topoResp.status}`);
    data = await dataResp.json();
    topo = await topoResp.json();
  } catch (e) {
    document.getElementById("ied-status").textContent = "Error: " + e.message;
    return;
  }

  DATA = data;
  TOPO = topojson.feature(topo, topo.objects.MEX_adm1);

  // 2. Populate year selector
  const select = document.getElementById("anio-select");
  select.innerHTML = "";
  for (const anio of data.anios) {
    const opt = document.createElement("option");
    opt.value = anio;
    opt.textContent = anio;
    select.appendChild(opt);
  }
  // Default to most recent year
  select.value = data.anios[data.anios.length - 1];

  // 3. Status
  document.getElementById("ied-status").textContent =
    `${data.entidades.length} entidades · ${data.anios.length} años (${data.anios[0]}–${data.anios[data.anios.length - 1]})`;

  // 4. Initial render
  const anio = Number(select.value);
  renderAll(anio);

  // 5. Year selector change
  select.addEventListener("change", () => {
    renderAll(Number(select.value));
  });

  // 6. Tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentTab = btn.dataset.tab;
      renderHeatmap(Number(document.getElementById("anio-select").value));
    });
  });
}

function renderAll(anio) {
  renderChoropleth(anio);
  renderTop10(anio);
  renderHeatmap(anio);
  renderSankey(anio);
}

// === CHOROPLETH MAP ===
function renderChoropleth(anio) {
  const container = document.getElementById("chart-choropleth");
  const width = container.clientWidth || 500;
  const height = Math.round(width * 0.7);

  // Build lookup: entidad_topo → valor
  const yearData = DATA.por_entidad_anual.filter((d) => d.anio === anio);
  const lookup = new Map(yearData.map((d) => [d.entidad_topo, d.valor]));

  // Enrich features and split CDMX from rest
  const CDMX_TOPO = "Distrito Federal";
  const restFeatures = [];
  let cdmxFeature = null;

  for (const f of TOPO.features) {
    const valor = lookup.get(f.properties.NAME_1) ?? 0;
    const enriched = {
      ...f,
      properties: { ...f.properties, valor },
    };
    if (f.properties.NAME_1 === CDMX_TOPO) {
      cdmxFeature = enriched;
    } else {
      restFeatures.push(enriched);
    }
  }

  const restGeo = { type: "FeatureCollection", features: restFeatures };
  const cdmxGeo = { type: "FeatureCollection", features: cdmxFeature ? [cdmxFeature] : [] };
  const cdmxVal = cdmxFeature?.properties.valor ?? 0;

  // Color scale based on non-CDMX values only
  const maxVal = d3.max(restFeatures, (f) => f.properties.valor) || 1;

  const chart = Plot.plot({
    width,
    height,
    projection: {
      type: "conic-conformal",
      parallels: [17.5, 29.5],
      rotate: [102, 0],
      domain: TOPO,
    },
    color: {
      type: "quantize",
      n: 5,
      scheme: "Greys",
      domain: [0, maxVal],
      label: "Millones USD (sin CDMX)",
      tickFormat: (d) => fmtMillones(d),
      legend: true,
    },
    marks: [
      // All states except CDMX — colored by value
      Plot.geo(restGeo, {
        fill: (d) => Math.max(d.properties.valor, 0),
        stroke: "#a3a3a3",
        strokeWidth: 0.75,
        tip: true,
        title: (d) =>
          `${d.properties.NAME_1}\n${fmtMillones(d.properties.valor)} millones USD (${anio})`,
      }),
      // CDMX — placeholder fill, will be replaced with hatch pattern
      Plot.geo(cdmxGeo, {
        fill: "#e5e5e5",
        stroke: "#1a1a1a",
        strokeWidth: 1.5,
      }),
      // Annotation arrow + label for CDMX
      Plot.text([{ text: `CDMX: ${fmtMillones(cdmxVal)}M USD` }], {
        x: () => -99.1,
        y: () => 17.8,
        text: "text",
        fontSize: 10,
        fontWeight: 700,
        fill: "#1a1a1a",
        stroke: "#fafafa",
        strokeWidth: 3,
      }),
    ],
  });

  // Inject SVG hatch pattern and apply to CDMX path
  const svg = chart.querySelector("svg") || chart;
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <pattern id="hatch-cdmx" patternUnits="userSpaceOnUse" width="6" height="6"
             patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#e5e5e5"/>
      <line x1="0" y1="0" x2="0" y2="6" stroke="#1a1a1a" stroke-width="1.5"/>
    </pattern>
  `;
  svg.prepend(defs);

  // Find CDMX path: it's the one with stroke-width="1.5" and stroke="#1a1a1a"
  for (const path of svg.querySelectorAll("path")) {
    if (path.getAttribute("stroke-width") === "1.5" &&
        path.getAttribute("stroke") === "#1a1a1a") {
      path.setAttribute("fill", "url(#hatch-cdmx)");
    }
  }

  container.innerHTML = "";
  container.appendChild(chart);
}

// === TOP 10 BAR CHART ===
function renderTop10(anio) {
  const container = document.getElementById("chart-top10");
  const yearData = DATA.por_entidad_anual.filter((d) => d.anio === anio);

  // Sort and take top 10
  const top10 = yearData
    .slice()
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10);

  if (top10.length === 0) {
    container.innerHTML = '<p class="loading">Sin datos</p>';
    return;
  }

  const width = container.clientWidth || 250;

  const chart = Plot.plot({
    width,
    height: Math.max(top10.length * 28, 200),
    marginLeft: 160,
    marginRight: 50,
    x: {
      label: "Millones USD",
      grid: true,
    },
    y: {
      label: null,
      domain: top10.map((d) => d.entidad),
    },
    marks: [
      Plot.barX(top10, {
        x: "valor",
        y: "entidad",
        fill: "#1a1a1a",
        tip: true,
        title: (d) =>
          `${d.entidad}\n${fmtMillones(d.valor)} millones USD`,
      }),
    ],
  });

  container.innerHTML = "";
  container.appendChild(chart);
}

// === HEATMAP (tabbed: país or sector) ===
function renderHeatmap(anio) {
  const container = document.getElementById("chart-heatmap");

  let filtered, yField, yDomain, title;

  if (currentTab === "pais") {
    // Filter to top 10 countries, all entidades, specific year
    const topPaises = DATA.paises_top.slice(0, 10);
    filtered = DATA.entidad_pais.filter(
      (d) => d.anio === anio && topPaises.includes(d.pais)
    );
    // Short names for y-axis, keep full name in data for tooltips
    filtered = filtered.map((d) => ({ ...d, pais_corto: paisLabel(d.pais) }));
    yField = "pais_corto";
    yDomain = topPaises.map(paisLabel);
  } else {
    // Filter to top sectors, all entidades, specific year
    const topSectores = DATA.sectores_top.slice(0, 5);
    filtered = DATA.entidad_sector.filter(
      (d) => d.anio === anio && topSectores.includes(d.sector)
    );
    // Map sector codes to readable names for display
    filtered = filtered.map((d) => ({ ...d, sector_nombre: sectorLabel(d.sector) }));
    yField = "sector_nombre";
    yDomain = topSectores.map(sectorLabel);
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p class="loading">Sin datos para este año</p>';
    return;
  }

  const width = Math.min(container.clientWidth || 920, 920);
  const entidades = DATA.entidades;

  // Compute symmetric domain for diverging scale
  const absMax = d3.max(filtered, (d) => Math.abs(d.valor)) || 1;
  // Round to a clean number for tidy legend
  const order = Math.pow(10, Math.floor(Math.log10(absMax)));
  const roundMax = Math.ceil(absMax / order) * order;
  const heatTicks = [-roundMax, 0, roundMax];

  const chart = Plot.plot({
    width,
    height: yDomain.length * 35 + 120,
    marginLeft: 150,
    marginBottom: 100,
    padding: 0.05,
    x: {
      label: null,
      domain: entidades,
      tickRotate: -60,
      tickSize: 0,
    },
    y: {
      label: null,
      domain: yDomain,
    },
    color: {
      type: "symlog",
      domain: [-roundMax, roundMax],
      scheme: "RdGy",
      pivot: 0,
      label: "Millones USD",
      tickFormat: (d) => fmtMillones(d),
      ticks: heatTicks,
      legend: true,
    },
    marks: [
      Plot.cell(filtered, {
        x: "entidad",
        y: yField,
        fill: "valor",
        tip: true,
        title: (d) => {
          const label = currentTab === "pais" ? d.pais : sectorLabel(d.sector);
          return `${d.entidad} × ${label}\n${fmtMillones(d.valor)} millones USD`;
        },
      }),
    ],
  });

  container.innerHTML = "";
  container.appendChild(chart);
}

// === SANKEY DIAGRAM ===
function renderSankey(anio) {
  const container = document.getElementById("chart-sankey");
  const width = container.clientWidth || 920;
  const height = 500;

  // Get top entities for the year
  const yearEntidad = DATA.por_entidad_anual
    .filter((d) => d.anio === anio && d.valor > 0)
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10);
  const topEntidades = yearEntidad.map((d) => d.entidad);

  // Top 5 countries
  const topPaises = DATA.paises_top.slice(0, 5);

  // Top 5 sectors
  const topSectores = DATA.sectores_top.slice(0, 5);

  // Build links: country → entidad
  const paisEntidadLinks = DATA.entidad_pais
    .filter(
      (d) =>
        d.anio === anio &&
        topPaises.includes(d.pais) &&
        topEntidades.includes(d.entidad) &&
        d.valor > 0
    )
    .map((d) => ({
      source: `País: ${d.pais}`,
      target: d.entidad,
      value: d.valor,
    }));

  // Build links: entidad → sector
  const entidadSectorLinks = DATA.entidad_sector
    .filter(
      (d) =>
        d.anio === anio &&
        topEntidades.includes(d.entidad) &&
        topSectores.includes(d.sector) &&
        d.valor > 0
    )
    .map((d) => ({
      source: d.entidad,
      target: sectorLabel(d.sector),
      value: d.valor,
    }));

  const allLinks = [...paisEntidadLinks, ...entidadSectorLinks];

  if (allLinks.length === 0) {
    container.innerHTML = '<p class="loading">Sin datos positivos para Sankey</p>';
    return;
  }

  // Collect unique nodes
  const nodeNames = Array.from(
    new Set(allLinks.flatMap((l) => [l.source, l.target]))
  );
  const nodeMap = new Map(nodeNames.map((n, i) => [n, i]));

  const sankeyData = {
    nodes: nodeNames.map((name) => ({ name })),
    links: allLinks.map((l) => ({
      source: nodeMap.get(l.source),
      target: nodeMap.get(l.target),
      value: l.value,
    })),
  };

  // d3-sankey layout
  const sankeyLayout = d3
    .sankey()
    .nodeId((d) => d.index)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  const { nodes, links } = sankeyLayout(sankeyData);

  // Create SVG
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  // Links
  svg
    .append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", "#d4d4d4")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", (d) => Math.max(1, d.width))
    .append("title")
    .text(
      (d) =>
        `${d.source.name} → ${d.target.name}\n${fmtMillones(d.value)} millones USD`
    );

  // Nodes
  svg
    .append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => Math.max(d.y1 - d.y0, 1))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", "#1a1a1a")
    .append("title")
    .text(
      (d) =>
        `${d.name}\n${fmtMillones(d.value)} millones USD`
    );

  // Labels
  svg
    .append("g")
    .style("font-family", "'SF Mono', 'Fira Code', monospace")
    .style("font-size", "10px")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.name.replace(/^País: /, ""));

  container.innerHTML = "";
  container.appendChild(svg.node());
}

main();
