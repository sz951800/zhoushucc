// Load data from your JSON file
d3.json("data1.json").then(function (data) {
    // Define SVG dimensions
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };

    // Extract unique country names
    const countries = [...new Set(data.map(d => d.Country))];

    // Define the years in the desired order
    const years = [2017, 2018, 2019, 2020, 2021];
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    // Define bright colors for lines
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

    // Define a color scale for mapping countries to colors
    const colorScale = d3.scaleOrdinal()
        .domain(countries)
        .range(colors);

    // Define scales for x and y axes
    const xScale = d3.scalePoint()
    .domain(years.map(String))
    .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([70, 90]) // Adjust the domain based on your data
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Create a line generator function
    const lineGenerator = d3.line()
    .x(d => xScale(String(d.Year)))
    .y(d => yScale(d.GDP_Per_Capita_2021));

    // Append an SVG element to the container
    const svg = d3.select("#line-chart-container2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create lines for each country
    const lines = svg.selectAll(".line")
        .data(countries)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", function (country, i) {
            const countryData = data.filter(d => d.Country === country);
            return lineGenerator(countryData);
        })
        .attr("fill", "none")
        .attr("stroke", (d, i) => colors[i])
        .attr("stroke-width", 2.5); // Use brighter colors

    // Create x-axis
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10).tickFormat(d3.format("d"));
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .style("fill", "black") // Set tick label color to black
        .style("font-size", "12px"); // Set tick label font size

    // Create y-axis
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".1f")).tickSize(-width + margin.left + margin.right).tickSizeOuter(0);
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .selectAll("line")
        .style("stroke", "#ddd"); // Lighter horizontal grid lines

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 40)
        .style("text-anchor", "middle")
        .text("Year");

    // Add y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", 0 - height / 2)
        .attr("y", margin.left - 50)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Life Expectancy (years)");

    // Add chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .style("text-anchor", "middle")
        .style("font-size", "1.5rem")
        .text("Life Expectancy Comparison(by year)");

    // Create color legend
    const legend = svg.selectAll(".legend")
        .data(countries)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width - margin.right-30},${margin.top + i * 20})`);

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", d => colorScale(d));

    legend.append("text")
        .attr("x", 20)
        .attr("y", 6)
        .attr("dy", "0.32em")
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .text(d => d);
    }); 
