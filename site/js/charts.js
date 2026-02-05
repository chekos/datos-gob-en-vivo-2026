// Visualizaciones con Observable Plot
// Los datos procesados se cargan desde ../data/processed/

async function main() {
    const container = document.getElementById("chart-1");
    container.innerHTML = "<h2>Listo para visualizar</h2><p>Los datos se agregarán pronto.</p>";

    // Ejemplo de estructura para agregar charts:
    // const data = await d3.csv("../data/processed/dataset.csv", d3.autoType);
    // const chart = Plot.plot({
    //     marks: [
    //         Plot.barY(data, { x: "categoria", y: "valor" })
    //     ]
    // });
    // container.innerHTML = "";
    // container.appendChild(chart);
}

main();
