new Vue({
    el: '#app',
    data: {
        data2019: [
            { category: 'AM Rush Hours', value: 362156 },
            { category: 'PM Rush Hours', value: 595012 },
            { category: 'Non-Rush Hours', value: 898582 }
        ],
        data2020: [
            { category: 'AM Rush Hours', value: 202548 },
            { category: 'PM Rush Hours', value: 555270 },
            { category: 'Non-Rush Hours', value: 1006317 } // calculated as Total - (AM + PM)
        ],
        data2022: [
            { category: 'AM Rush Hours', value: 259035 },
            { category: 'PM Rush Hours', value: 731788 },
            { category: 'Non-Rush Hours', value: 1381454 } // calculated as Total - (AM + PM)
        ]
    },
    methods: {
        createPieChart(data, element, year) {
            const width = 300;
            const height = 300;
            const legendWidth = 100;
            const radius = Math.min(width, height) / 2;
            const labelOffset =  60
            const totalHeight = height + labelOffset;

    
            const svg = d3.select(element).append('svg')
                .attr('width', width )  // Increase width for legend
                .attr('height', height+labelOffset)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
            const color = d3.scaleOrdinal(d3.schemeCategory10);
    
            const pie = d3.pie().value(d => d.value);
            const arc = d3.arc().innerRadius(0).outerRadius(radius);
    
            const total = d3.sum(data, d => d.value); // Calculate total for percentages
    
            const arcs = svg.selectAll('.arc')
                .data(pie(data))
                .enter().append('g')
                .attr('class', 'arc');
    
            arcs.append('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data.category));
            
            // Add percentage labels to the arcs
            arcs.append('text')
                .attr('transform', d => `translate(${arc.centroid(d)})`)
                .attr('dy', '0.35em')
                .text(d => `${(d.data.value / total * 100).toFixed(1)}%`)
                .style('text-anchor', 'middle');

            d3.select(element).select('svg').append("text")
                .attr("x", width / 2)
                .attr("y", totalHeight - labelOffset / 2-10)
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .style("font-weight", "bold")
                .text(year);
            
            
            const tooltip = d3.select(element).append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
    
            // Mouseover event
            arcs.on('mouseover', function(d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`Value: ${d.data.value}`)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', function(d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
        },
        createLegend() {
            const color = d3.scaleOrdinal(d3.schemeCategory10);
            const categories = ['AM Rush Hours (6:30am-9:00am)', 'PM Rush Hours (3:30pm-7:00pm)', 'Non-Rush Hours (others)'];
    
            // Select the container where the legend will be appended
            const legendContainer = d3.select('#legend-container')
                .append('svg')
                .attr('width', 600)
                .attr('height', categories.length * 30+100); // Adjust height based on number of categories
    
            categories.forEach((category, index) => {
                let legend = legendContainer.append('g')
                    .attr('class', 'legend')
                    .attr('transform', `translate(0, ${index * 20})`);
    
                legend.append('rect')
                    .attr('width', 18)
                    .attr('height', 18)
                    .style('fill', color(index));
    
                legend.append('text')
                    .attr('x', 24)
                    .attr('y', 9)
                    .attr('dy', '.35em')
                    .style('text-anchor', 'start')
                    .text(category);
            });
        }
    },
    
            


    mounted() {
        this.createPieChart(this.data2019, this.$refs.pieChart2019, "2019");
    this.createPieChart(this.data2020, this.$refs.pieChart2020, "2020");
    this.createPieChart(this.data2022, this.$refs.pieChart2022, "2022");
        this.createLegend();
    }
});
