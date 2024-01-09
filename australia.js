// Fetch data from Australia.json
d3.json("australiadata.json").then(data => {
    
    // Setting up dimensions and scales
    const width = 500;
    const height = 450;
    const radius = Math.min(width, height) / 2 - 80;
    // Define the custom color scale
    const colorScale = d3.scaleOrdinal()
    .range(["#7a0177","#c51b8a","#f768a1","#fbb4b9","#feebe2"]);

    const arc = d3.arc()
        .innerRadius(radius - 60)
        .outerRadius(radius);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${width / 3+30}, ${height / 2})`); // Adjust the leftward shift here

    const arcs = chartGroup.selectAll("path")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => colorScale(d.data.category));

    arcs.append("text")
        .attr("transform", d => {
            const pos = arc.centroid(d);
            const angle = Math.atan2(pos[1], pos[0]); // Calculate angle
            const x = Math.cos(angle) * (radius + 20); // Position text slightly outside the chart
            const y = Math.sin(angle) * (radius + 20); // Position text slightly outside the chart
            return `translate(${x}, ${y})`;
        })
        .attr("text-anchor", "middle")
        .style("font-size", "10px") // Reduce the font size
        .text(d => `${((d.value / d3.sum(data, d => d.value)) * 100).toFixed(1)}%`);
    
    const chartGroup1 = svg.append("g")
    .attr("transform", `translate(${width / 3+30}, ${height / 2})`); // Adjust the leftward shift here

// Append title to the SVG
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - radius - 60) // 20 units above the top of the donut
    .attr("text-anchor", "middle") // center-aligned
    .style("font-size", "18px") // Adjust font-size as needed
    .style("font-weight", "bold")
    .text("Donut chart: Australia GDP in 2021 by categories");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 180}, 310)`)// Keep the legend at the same position
        .selectAll(".legend")
        .data(data)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => colorScale(d.category));

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("font-size", "9.5px") // Reduce the font size
        .text(d => `${d.category} (${((d.value / d3.sum(data, d => d.value)) * 100).toFixed(1)}%)`);

}).catch(error => {
    console.error("Error loading the data", error);
});




