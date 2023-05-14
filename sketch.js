
let data;
let table;
let table_2;
let barChartData = {};
let lineChartData = {};
let maxValue;
let maxValue_2;
let selectedCountries = ["Guatemala", "Honduras", "Nicaragua", "Costa Rica", "Panama"];
let colors = {
  "Guatemala": [102, 194, 165],
  "Honduras": [252, 141, 98],
  "Nicaragua": [141, 160, 203],
  "Costa Rica": [231, 138, 195],
  "Panama": [166, 216, 84]  
};
let startingYear = 2008

function preload() {
  table = loadTable('Goal8.csv', 'csv', 'header');     
  table_2 = loadTable('Goal10.csv', 'csv', 'header')
}

function processData() {
  maxValue = 0;

  for (let row of table.rows) {
    let country = row.getString("GeoAreaName");
    let value = row.getNum("Value");
    let year = row.getString("Time_Detail");

    if (selectedCountries.includes(country) && year>=startingYear) {
      if (!barChartData.hasOwnProperty(country)) {
        barChartData[country] = [];
      }
      barChartData[country].push({ value: value, year: year });

      if (abs(value) > maxValue) {
        maxValue = abs(value);
      }
    }
  }

  maxValue_2 = 0;
  for (let row of table_2.rows){
    let country = row.getString("GeoAreaName")
    let value = row.getNum("Value");
    let year = row.getString("Time_Detail");

    if (selectedCountries.includes(country) && year>=startingYear) {
        if(!lineChartData.hasOwnProperty(country)){
          lineChartData[country] = []
        }
        lineChartData[country].push({ value: value, year: year });
        
        if(abs(value) > maxValue_2){
          maxValue_2 = abs(value)
        }
    }
  }

  if(abs(maxValue_2) > abs(maxValue))
    maxValue = maxValue_2

}

function setup() {
  createCanvas(1200, 1000);
  processData();
}

function draw() {
  background(255);
  
  drawYAxis();
  drawBarChart();
  displayPercentageOnHover();
  drawLineChart();
  drawLegend();
}

function drawYAxis() {
  let yAxisHeight = (height - 700);
  let yAxisX = 80;
  let yAxisY = 100;

  // Draw Y-axis line
  stroke(0);
  line(yAxisX, yAxisY, yAxisX, yAxisY + yAxisHeight);

  // Draw ticks and labels
  let tickCount = 10;
  let tickSpacing = yAxisHeight / tickCount;

  for (let i = 0; i <= tickCount; i++) {
    let tickY = yAxisY + i * tickSpacing;
    let tickValue = (tickCount - i) * maxValue / tickCount;

    // Linea
    line(yAxisX - 5, tickY, yAxisX, tickY);

    // Label
    textSize(12);
    textAlign(RIGHT, CENTER);
    text(tickValue.toFixed(2) + "%", yAxisX - 10, tickY);
  }

  // Linea de centro
  line(yAxisX, yAxisX + yAxisHeight + 20, yAxisX + yAxisHeight * 5, yAxisX + yAxisHeight + 20)

  stroke(0);
  line(yAxisX,  yAxisY + yAxisHeight, yAxisX, yAxisY + yAxisHeight * 2);

  tickCount = 10;
  tickSpacing = yAxisHeight / tickCount;  
  let oposite_i = tickCount

  for (let i = 0; i <= tickCount; i++) {
    let tickY = yAxisY + oposite_i * tickSpacing;
    let tickValue = ((tickCount - i) * maxValue / tickCount) * -1;

    // Draw tick line
    line(yAxisX - 5, tickY, yAxisX, tickY);

    // Draw tick label
    textSize(12);
    textAlign(RIGHT, CENTER);
    text(tickValue.toFixed(2) + "%", yAxisX - 10, tickY + yAxisHeight);
    oposite_i -= 1;
  }  

}


function drawBarChart() {
  let paddingRight = 100;
  let barWidth = (width + 100) / barChartData[selectedCountries[0]].length / selectedCountries.length - 10;
  let scaleY = (height - 700) / maxValue;

  for (let i = 0; i < barChartData[selectedCountries[0]].length; i++) {
    for (let country of selectedCountries) {
      let countryData = barChartData[country];
      let countryIndex = selectedCountries.indexOf(country);
      let x = i * (width - paddingRight) / barChartData[selectedCountries[0]].length + countryIndex * barWidth;
      x = x + 100
      let y;      
      let barHeight;
      let negative = false; 
      
      if (countryData[i].value < 0) {
        y = height / 2;
        negative = true
        barHeight = -countryData[i].value * scaleY;
      } else {
        y = height / 2 - countryData[i].value * scaleY;
        barHeight = countryData[i].value * scaleY;
      }

      y = y - 100
      
      fill(colors[country]);
      rect(x, y, barWidth, barHeight);

      // Display the percentage value and year
      textSize(8);
      fill(0);
      textAlign(CENTER);
      // text(countryData[i].value + "%", x + barWidth / 2, y - 5);
      if (countryIndex === 0) {
        if (negative)
          text(countryData[i].year, x + barWidth * selectedCountries.length / 2, height / 2 + 15 - 120);
        else
          text(countryData[i].year, x + barWidth * selectedCountries.length / 2, height / 2 + 15 - 100);
      }
    }
  }
}

function displayPercentageOnHover() {
  for (let i = 0; i < barChartData[selectedCountries[0]].length; i++) {
    for (let country of selectedCountries) {
      let countryData = barChartData[country];
      let countryIndex = selectedCountries.indexOf(country);
      let paddingRight = 100;
      let barWidth = (width + 100) / barChartData[selectedCountries[0]].length / selectedCountries.length - 10;
      let x = i * (width - paddingRight) / barChartData[selectedCountries[0]].length + countryIndex * barWidth;
      x = x + 100
      let scaleY = (height - 700) / maxValue;
      let y;
      let barHeight;

      if (countryData[i].value < 0) {
        y = height / 2;
        barHeight = -countryData[i].value * scaleY;
      } else {
        y = height / 2 - countryData[i].value * scaleY;
        barHeight = countryData[i].value * scaleY;
      }

      y = y - 100

      if (mouseX >= x && mouseX <= x + barWidth && mouseY >= y && mouseY <= y + barHeight) {
        textSize(14);
        fill(0);
        textAlign(CENTER);
        if(mouseY > 400)
          text(country + " " + countryData[i].value + "%", x + barWidth / 2, y + barHeight + 10);
        else
          text(country + " " + countryData[i].value + "%", x + barWidth / 2, y - 10);
        break;
      }
    }
  }
}


function drawLineChart() {
  let paddingRight = 100;
  let scaleY = (height - 700) / maxValue;
  let lineColor;

  for (let country of selectedCountries) {
    lineColor = colors[country]

    let prevX, prevY;
    let x, y;
    for (let i = 0; i < lineChartData[country].length; i++) {
      let dataPoint = lineChartData[country][i];
      let countryIndex = selectedCountries.indexOf(country);
      x = i * (width - paddingRight) / barChartData[selectedCountries[0]].length + countryIndex + 120;
      y = height / 2 - dataPoint.value * scaleY;

      y = y - 100;

      if (i > 0) {      
        stroke(lineColor);
        line(prevX, prevY, x, y);
      }

      prevX = x;
      prevY = y;
    }    
  }
}


function drawLegend() {
  let legendX = width - 800;  // position of the legend
  let legendY = 50; 
  let boxSize = 20;  // size of the color box in the legend
  
  // List of countries and their corresponding colors
  
  for (let i = 0; i < selectedCountries.length; i++) {
    fill(colors[selectedCountries[i]]);
    noStroke();
    rect(legendX, legendY + i * (boxSize + 5), boxSize, boxSize);  // draw a color box
    
    fill(0);  // color for text
    textSize(14);
    text(selectedCountries[i], legendX + boxSize + 80, legendY + i * (boxSize + 5) + boxSize - 8);  // draw the country name
  }
}



// This is the callback for loaded data.
function handleDataLoad(d) {
  data = d;
  redraw();
}
