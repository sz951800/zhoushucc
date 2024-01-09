(function() {
    var width = 1000,
        height = 600;

    var svg = d3.select("#map-container2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

    var colorPalette = ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'];
    //['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177']
    // Define thresholds for GDP per capita
    var gdpThresholds = [40000, 47000, 52000, 69000, 70000];
    var color = d3.scaleThreshold()
        .domain(gdpThresholds)
        .range(colorPalette);

    d3.json("countries-110m.json").then(function(world) {
        d3.json("data11.json").then(function(gdpData) {
            world.objects.countries.geometries.forEach(function(d) {
                var countryData = gdpData.find(function(e) {
                    return e.Country === d.properties.name;
                });
                if (countryData) {
                    d.properties.gdpPerCapita = +countryData.GDP;
                }
            });

            svg.append("g")
                .attr("class", "countries")
                .selectAll("path")
                .data(topojson.feature(world, world.objects.countries).features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                    return d.properties.gdpPerCapita ? color(d.properties.gdpPerCapita) : "#d8d8d8";
                })
                .style("stroke", "#fff");

            // Adding the color legend
            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (width - 980) + "," + 400 + ")");

            legend.append("text")
                .attr("x", 0) // Aligning the text to the left side of the legend
                .attr("y", -10) // Positioning the text above the first item of the legend
                .text("GDP per Capita (USD dollors)")
                .style("font-weight", "bold")
                .style("font-size", "16px")
                .style("text-anchor", "start");

            gdpThresholds.forEach(function(gdpThreshold, i) {
                var legendItem = legend.append("g")
                    .attr("transform", "translate(0," + (i * 25) + ")");
                
                legendItem.append("rect")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", colorPalette[i]);
                
                legendItem.append("text")
                    .attr("x", 30)
                    .attr("y", 15)
                    // Add the thresholds to the labels
                    .text(function() {
                        if (i === 0) return "< " + gdpThreshold;
                        else if (i === gdpThresholds.length - 1) return "> " + gdpThresholds[i - 1];
                        else return gdpThresholds[i - 1] + " - " + gdpThreshold;
                    })
                    .style("text-anchor", "start")
                    .style("alignment-baseline", "central");
            });
        });
    });
})();
