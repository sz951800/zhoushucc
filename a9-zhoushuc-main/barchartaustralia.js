// Function to create the bar chart
function createBarChart() {
    // Load JSON data using d3.json
    d3.json("australiadata.json").then(data => {
        // Define dimensions and margins
        const margin = { top: 20, right: 30, bottom: 70, left: 90 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create an SVG container
        const svg = d3.select("#bar-chart-australia")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Extract category and value from the loaded data
        const categories = data.map(d => d.category);
        const values = data.map(d => d.value);

        // Define a color scale for the bars
        const colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(["#7a0177","#c51b8a","#f768a1","#fbb4b9","#feebe2"]);

        // Define scales for x and y axes
        const xScale = d3.scaleBand()
            .domain(categories)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(values)])
            .nice()
            .range([height, 0]);
        

        // Create x-axis with well-formatted tick mark labels
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickSize(5).tickSizeOuter(0))
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("dy", "1.2em") // Adjust the spacing between axis labels
            .attr("x", 0)
            .attr("y", 10)
            .attr("transform", "rotate(0)") // Rotate x-axis labels if needed
            .call(wrap, xScale.bandwidth()); // Wrap text labels

        // Create y-axis with well-formatted tick mark labels in billions
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale).ticks(5).tickSize(5).tickSizeOuter(0).tickFormat(d3.format(".2s")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .call(wrap, margin.left - 50); // Wrap text labels

        // Create bars with color
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.category))
            .attr("y", d => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.value))
            .style("fill", (d, i) => colorScale(i)); // Use color scale

        // Add numbers on top of the bars
        svg.selectAll(".bar-number")
    .data(data)
    .enter().append("text")
    .attr("class", "bar-number")
    .attr("x", d => xScale(d.category) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.value) - 10)
    .attr("text-anchor", "middle")
    .text(d => d3.format(".2s")(d.value));

        // Add chart title
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", -margin.top)
            .attr("text-anchor", "middle")
            .text("Bar Chart");

        // Add x-axis label
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Categories");

        // Add y-axis label
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2+30)
            .attr("y", -margin.left + 50)
            .attr("text-anchor", "middle")
            .text("Values (Billions)");


            svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2+50)
            .attr("y", -margin.top+12)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Bar Chart: Australia GDP in 2021 by catogories");

        // Add legend (if needed)
        // You can customize the legend based on your data
    }).catch(error => {
        console.error("Error loading the data", error);
    });
}

// Call the function to create the bar chart
createBarChart();

// Function to wrap text labels
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this);
        var words = text.text().split(/\s+/).reverse();
        var word;
        var line = [];
        var lineHeight = 1.2; // ems
        var y = text.attr("y") || 0;
        var x = text.attr("x") || 0;
        var dy = parseFloat(text.attr("dy") || 0);
        var tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
            }
        }
    });
}