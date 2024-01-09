d3.json("data.json").then(function(data) {
    // Calculate average GDP
    const avgGDP = d3.mean(data, d => d.GDP).toFixed(2);

    // Calculate average life expectancy
    const avgLifeExpectancy = d3.mean(data, d => d["Life Expectancy"]).toFixed(2);

    // Find country with the highest GDP
    const maxGDP = d3.max(data, d => d.GDP);
    const countryWithMaxGDP = data.find(d => d.GDP === maxGDP).Country;

    // Find country with the highest life expectancy
    const maxLifeExpectancy = d3.max(data, d => d["Life Expectancy"]);
    const countryWithMaxLifeExpectancy = data.find(d => d["Life Expectancy"] === maxLifeExpectancy).Country;

    // Update HTML elements
    document.getElementById("avg-gdp-value").textContent = `$${avgGDP}`;
    document.getElementById("avg-life-expectancy-value").textContent = `${avgLifeExpectancy} Years`;
    document.getElementById("highest-gdp-country").textContent = countryWithMaxGDP;
    document.getElementById("highest-gdp-value").textContent = `$${maxGDP.toFixed(2)}`;
    document.getElementById("highest-life-expectancy-country").textContent = countryWithMaxLifeExpectancy;
    document.getElementById("highest-life-expectancy-value").textContent = `${maxLifeExpectancy.toFixed(2)} Years`;
});