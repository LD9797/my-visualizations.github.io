let barChartData = {};
let lineChartData = {};
let startingYear = 2008;
let selectedCountries = ["Guatemala", "Honduras", "Nicaragua", "Costa Rica", "Panama"];
let colors = ['#66C2A5','#FC8D62', '#8DA0CB', '#E78AC3', '#A6D854'];

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 1300 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", (height + margin.top + margin.bottom) * 2)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

  d3.csv("Goal8.csv", function(data) {
  
    for (var i = 0; i < data.length; i++) {
        let country = data[i].GeoAreaName;
        let value = data[i].Value;
        let year = data[i].Time_Detail

        if (year >= startingYear && selectedCountries.includes(country)) {
            barChartData[country] = barChartData[country] || [];
            barChartData[country].push({ value: value, year: year });
        }
    }

    // 1. Preprocess the data
    let my_data = []; 
    let years = []
    for (let year = 2008; year <= 2021; year++) { // iterate through years
        let yearObj = {year: year.toString()}; // each year is an object
        years.push(year.toString());
        for (let country in barChartData) { // iterate through countries
            for (let dataPoint of barChartData[country]) { // iterate through data points
                if (dataPoint.year === year.toString()) {
                    yearObj[country] = dataPoint.value.toString(); // add country data to year object
                }
            }
        }
        my_data.push(yearObj); // add year object to data array
    }
    
    let subgroups = selectedCountries;
    let groups = years; 
    

      // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])  
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 20])
        .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        
    var y2 = d3.scaleLinear()
            .domain([0, 20])
            .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(colors)

    // Show the bars Positive Values
    svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(my_data)
        .enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); });

    // Show the bars Negative Values
    svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(my_data)
        .enter()
        .append("g")     
        .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { if(d[key] > 0) {d[key] = 0} return {key: key, value: Math.abs(d[key])}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return 370 })     
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); })
            

    })

    d3.csv("Goal10.csv", function(data) {

        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) {  if(d.Time_Detail >= startingYear && selectedCountries.includes(d.GeoAreaName))  return d.GeoAreaName;})
        .entries(data);
        sumstat.shift();

        var x = d3.scaleLinear()
        .domain([2008, 2021])        
        .range([50, width - 90]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(0));

          // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 20])
            .range([ height, 0 ]);
            svg.append("g")
            .call(d3.axisLeft(y));

        var res = sumstat.map(function(d){ return d.key }) // list of group names
        var color = d3.scaleOrdinal()
              .domain(res)
              .range(colors)

        svg.selectAll(".line")
              .data(sumstat)
              .enter()
              .append("path")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                  return d3.line()
                    .x(function(d) { return x(d.Time_Detail); })
                    .y(function(d) { return y(+d.Value); })
                    (d.values)
                })        
    })    





// Handmade legend
svg.append("circle").attr("cx",200).attr("cy",30).attr("r", 6).style("fill", "#66C2A5")
svg.append("circle").attr("cx",200).attr("cy",60).attr("r", 6).style("fill", "#FC8D62")
svg.append("circle").attr("cx",200).attr("cy",90).attr("r", 6).style("fill", "#8DA0CB")
svg.append("circle").attr("cx",200).attr("cy",120).attr("r", 6).style("fill", "#E78AC3")
svg.append("circle").attr("cx",200).attr("cy",150).attr("r", 6).style("fill", "#A6D854")


svg.append("text").attr("x", 220).attr("y", 30).text("Guatemala").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 60).text("Honduras").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 90).text("Nicaragua").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 120).text("Costa Rica").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 150).text("Panama").style("font-size", "15px").attr("alignment-baseline","middle")
