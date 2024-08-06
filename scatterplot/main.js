import * as d3 from "d3";
import "./style.css";

const width = 920;
const height = 630;
const padding = 50;

async function main() {
  const response = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  );
  const data = await response.json();

  function toDate(time) {
    const [minutes, seconds] = time.split(":");
    console.log({ minutes, seconds });
    return new Date(0, 0, 0, 0, minutes, seconds, 0);
    // return new Date(`1970-01-01 00:${minutes}:${seconds}`);
  }

  const x = d3
    .scaleLinear()
    .domain([1993, 2016])
    .range([padding, width - padding]);

  const y = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => toDate(d.Time)))
    .range([height - padding, padding]);

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //title
  svg
    .append("text")
    .text("Doping in Professional Bicycle Racing")
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .attr("x", 420)
    .attr("y", 20);

  svg
    .append("text")
    .text("35 Fastest times up Alpe d'Huez")
    .attr("text-anchor", "middle")
    .attr("x", 420)
    .attr("y", 40);

  //axis
  svg
    .append("g")
    .call(
      d3
        .axisBottom(x)
        .ticks(15)
        .tickFormat((d) => d)
    )
    .attr("transform", `translate(0, ${height - padding})`)
    .attr("id", "x-axis");

  svg
    .append("g")
    .call(
      d3.axisLeft(y).tickFormat((d) => {
        const formatter = d3.timeFormat("%M:%S");
        return formatter(d);
      })
    )
    .attr("transform", `translate(${padding}, ${0})`)
    .attr("id", "y-axis");

  //data
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(toDate(d.Time)))
    .attr("r", 5)
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => toDate(d.Time))
    .attr("fill", (d) => (d.Doping.length ? "red" : "blue"))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

  //legend
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${width - 200}, ${height - 200})`);
  const legendDoping = legend.append("g");
  legendDoping
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "red");
  legendDoping.append("text").text("Doping").attr("y", "10").attr("x", 20);

  const legendNoDoping = legend
    .append("g")
    .attr("transform", `translate(0,20)`);
  legendNoDoping
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "blue");
  legendNoDoping.append("text").text("No Doping").attr("y", "10").attr("x", 20);

  //Tooltip
  const tooltip = d3
    .select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  function mouseover(d) {
    tooltip.style("opacity", 1);
    const { xvalue, yvalue } = d.target.dataset;
    const date = new Date(yvalue);
    const formatter = d3.timeFormat("%M:%S");
    tooltip.html(`Year: ${xvalue}, Time: ${formatter(date)}`);
    tooltip.attr("data-year", xvalue);
  }

  function mousemove(d) {
    tooltip.style("left", `${d.pageX}px`);
    tooltip.style("top", `${d.pageY}px`);
  }

  function mouseout() {
    tooltip.style("opacity", 0);
  }
}

main();
