// Set the dimensions and margins of the map
(function() {
var width = 1000,
    height = 600;

// Create an SVG element and append it to the DOM
var svg = d3.select("#map-container3").append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a projection for the map
var projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 2]);

// Create a path generator using the projection
var path = d3.geoPath()
    .projection(projection);

// Load the GeoJSON data
d3.json("countries-110m.json").then(function(world) {
    // Load the country data
    d3.json("data11.json").then(function(data) {
        // Draw the countries
        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "#d8d8d8")
            .style("stroke", "#fff");

        // Draw the dots for population
        svg.append("g")
    .attr("class", "dots")
    .selectAll("dot")
    .data(data)
    .enter()
    .each(function(d) {
        var countryFeature = topojson.feature(world, world.objects.countries).features.find(function(c) {
            return c.properties.name === d.Country;
        });

        if (countryFeature) {
            var centroid = path.centroid(countryFeature);
            var population = d.Population;
            var dots = Math.ceil(population / 8000); // For example, 1 dot represents 1 million people

            var rangeMultiplier = d.Country === "United States of America" ? 40 : 20; // Increase range for USA

            for (var i = 0; i < dots; i++) {
                d3.select(this)
                    .append("circle")
                    .attr("cx", centroid[0] + (Math.random() - 0.5) * rangeMultiplier) // Adjust rangeMultiplier for sparsity
                    .attr("cy", centroid[1] + (Math.random() - 0.5) * rangeMultiplier)
                    .attr("r", 2)
                    .style("fill", "#3498db")
                    .style("opacity", 0.8);
            }
        }
    });

    
    var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + 20 + "," + (height - 80-20) + ")")
    .style("font-size", "12px");

// Add rectangle for the legend box
legend.append("rect")
    .attr("width", 200)
    .attr("height", 60)
    .style("fill", "#fff")
    .style("stroke", "#000");

// Add legend title
legend.append("text")
    .attr("x", 100)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Population");

// Add legend explanation
legend.append("text")
    .attr("x", 100)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("1 dot = 8000,000 people");

// Draw a representative dot for the legend
        // The legend code would go here, similar to previous examples
    });
});
})();