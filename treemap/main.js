import * as d3 from "d3";
import "./style.css";

const width = 920;
const height = 630;
const padding = 50;

async function main() {
  const response = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
  );
  const data = await response.json();

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //color
  const colors = [
    "#1C1832",
    "#9E999D",
    "#F2259C",
    "#347EB4",
    "#08ACB6",
    "#91BB91",
    "#BCD32F",
    "#75EDB8",
    "#89EE4B",
    "#AD4FE8",
    "#D5AB61",
    "#BC3B3A",
    "#F6A1F9",
    "#87ABBB",
    "#412433",
    "#56B870",
    "#FDAB41",
    "#64624F",
  ];

  const categories = data.children.map((d) => d.name);
  const colorScale = d3.scaleOrdinal().domain(categories).range(colors);

  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => a.value - b.value);

  const treemap = d3
    .treemap()
    .size([width, height - padding * 2])
    .padding(1);
  const root = treemap(hierarchy);

  svg
    .append("g")
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => colorScale(d.data.category))
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

  const legenditems = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(0, ${height - padding})`)
    .selectAll("g")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr(
      "transform",
      (d, i) => `translate(${(i % 9) * 60},${i < 9 ? 0 : 40})`
    );

  legenditems
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", 0)
    .attr("y", -15)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d) => colorScale(d));

  legenditems
    .append("text")
    .text((d) => d)
    .attr("x", 20);

  //Tooltip
  const tooltip = d3
    .select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  function mouseover(d) {
    tooltip.style("opacity", 1);
    const { name, category, value } = d.target.dataset;

    tooltip.html(`${name} – ${category} – ${value}`);
    tooltip.attr("data-value", value);
  }

  function mousemove(d) {
    console.log("mousemove");
    tooltip.style("left", `${d.pageX}px`);
    tooltip.style("top", `${d.pageY}px`);
  }

  function mouseout(d) {
    d.target.classList.remove("hover");
    tooltip.style("opacity", 0);
  }

  console.log(legenditems);
}

main();
