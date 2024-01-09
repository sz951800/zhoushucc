d3.json("data.json").then(function (data) {
    const tableContainer = d3.select("#data-table");
    
    // Add table title
    tableContainer.append("h3")
        .style("font-size", "1.5rem")
        .style("text-align", "center")
        .style("margin-bottom", "10px")
        .text("Data Overview for 2021");

    const table = tableContainer.append("table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    // Extract the keys (column names) from the first object in the data
    let columns = Object.keys(data[0]);

    // Modify the column names for GDP and Life Expectancy
    columns = columns.map(column => {
        if (column === "GDP") {
            return "GDP per capita (US dollars)";
        } else if (column === "Life Expectancy") {
            return "Life Expectancy (Years)";
        } else {
            return column;
        }
    });

    // Append header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(d => d);

    // Append data rows
    let rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    rows.selectAll("td")
        .data(d => {
            return columns.map(column => {
                if (column === "GDP per capita (US dollars)") {
                    return d["GDP"];
                } else if (column === "Life Expectancy (Years)") {
                    return d["Life Expectancy"];
                } else {
                    return d[column];
                }
            });
        })
        .enter()
        .append("td")
        .text(d => d);

    // Add CSS styles directly
    d3.select("head")
    .append("style")
    .html(`
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-family: Arial, Helvetica, sans-serif;
        }

        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 2px solid #555;  /* Made lines darker */
        }

        th {
            background-color: #f2f2f2;
            border-top: 2px solid #555;  /* Added top border for header */
        }

        tr:hover {
            background-color: #f5f5f5;
        }

        #data-table {
            width: 80%;  /* adjust as needed */
            margin-left: 30%;  /* adjust to center the table */
        }
    `);
});


