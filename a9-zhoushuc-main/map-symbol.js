(function() {
    var width = 1000,
        height = 600;

    var svg = d3.select("#map-container1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    
    var radius = function(value) {
            return Math.sqrt(value) / 4;
        };

        var calculateRadius = function(value) {
            return Math.sqrt(value) / 4;
        };
    
        

    // Load the GeoJSON data
    d3.json("countries-110m.json").then(function(world) {
        // Load the age_data.json
        d3.json("age_data.json").then(function(ageData) {
            // Join the data from age_data.json to the world GeoJSON
            world.objects.countries.geometries.forEach(function(d) {
                var country = ageData.find(function(e) {
                    return e.Country === d.properties.name;
                });
                if (country) {
                    d.properties.populationAged0to4 = +country.PopulationAged0to4;
                }
            });

            // Draw the world map
            svg.append("g")
                .attr("class", "countries")
                .selectAll("path")
                .data(topojson.feature(world, world.objects.countries).features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "#d8d8d8")
                .style("stroke", "#fff");

            // Draw the bubbles for the population aged 0 to 4
            svg.append("g")
                .selectAll("circle")
                .data(topojson.feature(world, world.objects.countries).features)
                .enter()
                .filter(function(d) {
                    return d.properties.populationAged0to4; // Only include countries with data
                })
                .append("circle")
                .attr("cx", function(d) {
                    return projection(d3.geoCentroid(d))[0];
                })
                .attr("cy", function(d) {
                    return projection(d3.geoCentroid(d))[1];
                })
                .attr("r", function(d) {
                    // Scale the population to get a suitable radius
                    return Math.sqrt(d.properties.populationAged0to4) / 4;
                })
                .style("fill", "#3498db")
                .style("opacity", 0.6)
                .style("stroke", "#fff")
                .style("stroke-width", 0.5);


                var sampleSizes = [calculateRadius(2000), calculateRadius(10000), calculateRadius(20000)];
            
                // Create a group for the legend
                var legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width - 900) + ", " + (height - 300) + ")");
    
                // Add the circles for the legend
                var legendCircles = legend.selectAll("circle")
                    .data(sampleSizes)
                    .enter()
                    .append("circle")
                    .attr("cx", 0)
                    .attr("cy", function(d, i) {
                        // This positions the circles vertically
                        var offset = i === 0 ? 0 : 2 * sampleSizes[i - 1];
                        return i * 60 + offset;
                    })
                    .attr("r", function(d) { return d; })
                    .style("fill", "#3498db")
                    .style("opacity", 0.6)
                    .style("stroke", "#fff")
                    .style("stroke-width", 0.5);
    
                // Add labels to the circles
                var legendLabels = legend.selectAll("text")
                    .data(sampleSizes)
                    .enter()
                    .append("text")
                    .attr("x", function(d) { return d + 5; }) // 5 pixels to the right of the circle
                    .attr("y", function(d, i) {
                        var offset = i === 0 ? 0 : 2 * sampleSizes[i - 1];
                        return i * 60 + offset;
                    })
                    .attr("dy", "0.35em") // Center text vertically in the circle
                    .style("font-size", "12px")
                    .text(function(d) { return Math.round(Math.PI * (d * 4) ** 2); }); // Convert radius back to population size for the label
                
                    var legendPadding = 20; // Padding around the legend items
                    var legendTitle = "Population (thousands)"; // Title for the legend
                
                    // Calculate the size of the legend box
                    var legendWidth = 150; // Width of the legend box
                    var legendHeight = sampleSizes.length * 60 + legendPadding * 2+80; // Height based on the number of items
                
                    // Add a title to the legend
                    var titleX = legendWidth / 2 - legendPadding;

                    legend.append("text")
                        .attr("x", titleX-50)
                        .attr("y", -25) // Position the title above the legend items
                        .attr("dy", "0.05em")
                        .style("font-size", "12px")
                        .style("text-anchor", "middle")
                        .style("font-weight",'bold')
                        .text(legendTitle);
                
                    // Add a rectangle around the legend items
                    legend.append("rect")
                        .attr("x", -legendPadding-50)
                        .attr("y", -legendHeight / 2+100)
                        .attr("width", legendWidth)
                        .attr("height", legendHeight)
                        .style("fill", "#f9f9f9") // Light grey background for the legend box
                        .style("stroke", "#000") // Black border for the legend box
                        .style("stroke-width", 1.5)
                        .style("opacity", 0.8);
                
                    // Re-append circles to be on top of the legend box
                    legend.selectAll("circle")
                        .raise(); // This moves the circles above the rectangle in the SVG stacking context
                
                    // Re-append text to be on top of the legend box
                    legend.selectAll("text")
                        .raise(); // This m

                  
                // You can add additional code here to handle other features
            });
        });
    })();






    
