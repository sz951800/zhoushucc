// Function to create the bar chart
function createBarChart() {
    // Load JSON data using d3.json
    d3.json("germanydata.json").then(data => {

        // Define dimensions and margins
        const margin = { top: 20, right: 30, bottom: 70, left: 90 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create an SVG container
        const svg = d3.select("#bar-chart-germany")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define a color scale for the bars
        const categories = data.map(d => d.category);
        const colorScale = d3.scaleOrdinal()
            .domain(categories)
            .range(["#08519c", "#3182bd", "#6baed6", "#bdd7e7", "#eff3ff"]);

        // Define scales for x and y axes
        const xScale = d3.scaleBand()
            .domain(categories)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([height, 0]);

        // Create x and y axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("dy", "1.2em")
            .attr("y", 10)
            .style("text-anchor", "middle")
            .call(wrap, xScale.bandwidth());

        svg.append("g")
            .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")))
            .selectAll("text")
            .attr("dx", "-0.6em");

        // Create bars
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.category))
            .attr("y", d => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.value))
            .attr("fill", d => colorScale(d.category));
        
            svg.selectAll(".bar-number")
            .data(data)
            .enter().append("text")
            .attr("class", "bar-number")
            .attr("x", d => xScale(d.category) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.value) - 10)
            .attr("text-anchor", "middle")
            .text(d => d3.format(".2s")(d.value));


        

        // Add title and axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Bar Chart");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Categories");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 35)
            .attr("x", -height / 2+30)
            .attr("text-anchor", "middle")
            .text("Values (Billions)");


        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2+50)
            .attr("y", -margin.top+12)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Bar Chart: Germany GDP in 2021 by catogories");

    }).catch(error => {
        console.error("Error loading the data", error);
    });
}

// Call the function to create the bar chart
createBarChart();

// Function to wrap text labels
function wrap(text, width) {
    text.each(function() {
        let text = d3.select(this);
        let words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineHeight = 1.1; // ems
        let y = text.attr("y");
        let dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
            }
        }
    });
}
