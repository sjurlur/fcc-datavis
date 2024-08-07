import * as d3 from "d3";
import "./style.css";
import * as topojson from "topojson-client";

let svg;
const width = 1600;
const height = 630;
const padding = {
  top: 10,
  left: 100,
  right: 100,
  bottom: 10,
};

const urls = {
  education:
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
  country:
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
};

function getData(url) {
  return fetch(url).then((result) => result.json());
}

async function main() {
  Promise.all([getData(urls.education), getData(urls.country)]).then(draw);
}

function draw([educationData, countryData]) {
  svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  drawMap(countryData, educationData);
}

function drawMap(countryData, educationData) {
  const [xMin, xMax] = d3.extent(educationData, (d) => d.bachelorsOrHigher);

  //color
  const steps = 8;
  const colorScale = d3
    .scaleThreshold()
    .domain(d3.range(xMin, xMax, (xMax - xMin) / steps)) //[ 2.6, 11.6625, 20.725, 29.7875, 38.85, 47.9125, 56.975, 66.0375 ]
    .range(d3.schemeGreens[steps]); // [ "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32" ]

  const geojson = topojson.feature(countryData, countryData.objects.counties);
  svg
    .append("g")
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("data-fips", (d) => d.id)
    .attr(
      "data-education",
      (d) => educationData.find((it) => it.fips === d.id).bachelorsOrHigher
    )
    .style("fill", ({ id }) => {
      const { bachelorsOrHigher } = educationData.find((it) => it.fips === id);
      return colorScale(bachelorsOrHigher);
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

  //legend
  const legendWidth = 350;
  const legendScale = d3
    .scaleBand()
    .domain(d3.range(xMin, xMax, (xMax - xMin) / steps))
    .range([0, legendWidth]);

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${100}, ${height - 20})`);
  legend.call(
    d3.axisBottom(legendScale).tickFormat((it) => `${d3.format("d")(it)}%`)
  );
  legend
    .selectAll("rect")
    .data(colorScale.domain().slice(0, -1))
    .enter()
    .append("rect")
    .attr("x", (it) => legendScale(it) + legendScale.bandwidth() / 2)
    .attr("y", (it) => -14)
    .attr("width", legendScale.bandwidth())
    .attr("height", 20)
    .attr("fill", (d) => colorScale(d));

  //Tooltip
  const tooltip = d3
    .select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  function mouseover(d) {
    tooltip.style("opacity", 1);
    const { fips, education } = d.target.dataset;
    const state = educationData.find((it) => {
      return Number(it.fips) === Number(fips);
    });
    tooltip.html(`${state.area_name}(${state.state}) – ${education}%`);
    d.target.classList.add("hover");
    tooltip.attr("data-education", education);
  }

  function mousemove(d) {
    tooltip.style("left", `${d.pageX}px`);
    tooltip.style("top", `${d.pageY}px`);
  }

  function mouseout(d) {
    d.target.classList.remove("hover");
    tooltip.style("opacity", 0);
  }
}

main();
