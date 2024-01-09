// Load data
d3.json("data.json").then(function (data) {
    // Define SVG dimensions
    const width = 700;
    const height = 500;
    const margin = { top: 100, right: 60, bottom: 60, left: 180 }; 

    // Append an SVG element to the scatterplot div
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([35000, d3.max(data, d => d.GDP)])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([76, d3.max(data, d => d["Life Expectancy"])])
        .range([height - margin.bottom, margin.top]);

    // Define color scale
    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.Country))
        .range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e"]);

    // Create circles for each data point
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.GDP))
        .attr("cy", d => yScale(d["Life Expectancy"]))
        .attr("r", 6)
        .attr("fill", d => colorScale(d.Country));

    // Create x-axis with formatted tick mark labels
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("$.2s"));
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    // Add x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 40)
        .style("text-anchor", "middle")
        .text("GDP per capita (in USD)");

    // Create y-axis with formatted tick mark labels
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".1f"));
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

    // Add y-axis label
    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", margin.left - 50)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Life Expectancy (years)");

    // Add chart title
    svg.append("text")
        .attr("x", width / 2+60)
        .attr("y", margin.top / 2)
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "18px")
        .text("Scatterplot: GDP per capita vs Life Expectancy");

    // Create a color legend
    const legend = svg.append("g")
                      .attr("transform", `translate(${width - margin.right-20}, ${margin.top+50})`);

    const legendItems = legend.selectAll(".legendItem")
                              .data(colorScale.domain())
                              .enter().append("g")
                              .attr("class", "legendItem")
                              .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
               .attr("width", 12)
               .attr("height", 12)
               .style("fill", d => colorScale(d));

    legendItems.append("text")
               .attr("x", 15)
               .attr("y", 9)
               .style("alignment-baseline", "middle")
               .text(d => d);
});
