import * as d3 from "d3";
import "./style.css";

const width = 700;
const height = 600;
const padding = 50;

async function main() {
  const response = await fetch(
    `https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json`
  );
  const json = await response.json();
  const dataset = json.data;

  const xmin = d3.min(dataset, (d) => new Date(d[0]));
  const xmax = d3.max(dataset, (d) => new Date(d[0]));
  const xScale = d3
    .scaleTime()
    .domain([xmin, xmax])
    .range([padding, width - padding]);

  const ymin = d3.min(dataset, (d) => d[1]);
  const ymax = d3.max(dataset, (d) => d[1]);
  const yScale = d3
    .scaleLinear()
    .domain([0, ymax])
    .range([height - padding, padding]);
  // dataset.forEach((d) => {
  //   console.log(yScale(d[1]));
  // });

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("id", "title")
    .attr("width", width)
    .attr("height", height);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", 3)
    .attr("height", (d) => height - padding - yScale(d[1]))
    .attr("y", (d) => yScale(d[1]))
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .on("mousemove", mousemove);

  //Tooltip
  const tooltip = d3
    .select("#chart")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip");

  function mouseover(d) {
    const { date, gdp } = d.target.dataset;
    tooltip.html(
      `Dato: ${new Date(date).toISOString().split("T")[0]}<br> GDP: ${gdp}`
    );
    tooltip.attr("data-date", date);
    tooltip.style("opacity", 1);
    tooltip.style("position", "fixed");
  }

  function mouseleave() {
    tooltip.style("opacity", 0);
  }

  function mousemove(d) {
    tooltip.style("left", `${d.pageX}px`);
    tooltip.style("top", `${d.pageY}px`);
  }

  // axis
  svg
    .append("g")
    .attr("id", "x-axis")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${height - padding})`);
  svg
    .append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale))
    .attr("transform", `translate(${padding}, 0)`);
}

main();
