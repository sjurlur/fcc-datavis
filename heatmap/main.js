import * as d3 from "d3";
import "./style.css";

const width = 1600;
const height = 630;
const padding = 100;

function getMonth(month) {
  const date = new Date(0, month);
  const monthName = date.toLocaleString("default", { month: "long" });
  return monthName;
}

async function main() {
  const response = await fetch(
    " https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  );
  const data = await response.json();

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3
    .scaleBand()
    .domain(data.monthlyVariance.map((d) => d.year))
    .range([padding, width - padding]);

  const y = d3
    .scaleBand()
    .domain(d3.range(12))
    .range([height - padding, padding]);

  //color
  const numThresholds = 15;
  const [varianceMin, varianceMax] = d3.extent(
    data.monthlyVariance,
    (d) => d.variance
  );

  const colorscaleDiverging = d3
    .scaleDiverging(d3.interpolateRdYlBu)
    .domain([varianceMax, 0, varianceMin])
    .clamp(true);
  const step = (varianceMax - varianceMin) / numThresholds;

  const thresholdScaleDomain = d3
    .range(numThresholds)
    .map((d) => d * step + varianceMin); // [0,1,2,3,4] => [variancemin, step, step, variancemax]
  thresholdScaleDomain.push(varianceMax);
  console.log(thresholdScaleDomain);
  let thresholdScaleRange = thresholdScaleDomain.map((d) =>
    colorscaleDiverging(d)
  );

  const colorScale = d3
    .scaleThreshold()
    .domain(thresholdScaleDomain)
    .range(thresholdScaleRange);

  //x-axis
  svg
    .append("g")
    .call(
      d3
        .axisBottom(x)
        .tickFormat((d) => {
          return d;
        })
        .tickValues(x.domain().filter((val) => val % 10 === 0))
    )
    .attr("transform", `translate(${0}, ${height - padding})`)
    .attr("id", "x-axis");

  //y-axis
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .tickFormat((d) => getMonth(d))
        .tickPadding(10) //horizontal padding
        .offset(y.bandwidth() / 2)
    )
    .attr("transform", `translate(${padding}, ${0})`)
    .attr("id", "y-axis");

  //data
  svg
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("width", x.bandwidth())
    .attr("height", (height - padding * 2) / 12)
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    .attr("fill", (d) => colorScale(d.variance))
    .attr("x", (d) => x(d.year))
    .attr("y", (d) => y(d.month - 1))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

  //legend
  const legendScale = d3
    .scaleBand()
    .domain(colorScale.domain())
    .range([0, 500]);
  const legend = svg.append("g").attr("id", "legend");
  legend
    .append("g")
    .call(
      d3
        .axisBottom(legendScale)
        .tickValues(colorScale.domain())
        .tickFormat(d3.format(".2f"))
    )
    .attr("transform", `translate(100, ${height - 30})`);

  //rects
  legend
    .append("g")
    .attr("transform", `translate(${padding}, ${height - 40})`)
    .selectAll("rect")
    .data(colorScale.domain())
    .enter()
    .append("rect")
    .attr("x", (val) => legendScale(val))
    .attr("y", -10)
    .attr("width", 500 / colorScale.domain().length)
    .attr("height", 20)
    .attr("fill", (val) => colorScale(val));

  //Tooltip
  const tooltip = d3
    .select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  function mouseover(d) {
    tooltip.style("opacity", 1);
    const { month, year, temp } = d.target.dataset;
    tooltip.html(`${year} – ${getMonth(month)}<br>${temp}`);
    tooltip.attr("data-year", year);
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
