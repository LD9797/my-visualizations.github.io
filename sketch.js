
let data;
let table;
let table_2;
let barChartData = {};
let lineChartData = {};
let maxValue;
let maxValue_2;
let selectedCountries = ["Costa Rica", "Panama", "Nicaragua", "Dominican Republic"];
let colors = {
  "Costa Rica": [0, 174, 228],
  "Panama": [228, 0, 0],
  "Dominican Republic": [0, 228, 38],
  "Nicaragua": [228, 220, 0]
};

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

    if (selectedCountries.includes(country)) {
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

    if (selectedCountries.includes(country)) {
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
  displayPercentageOnHover() 
  drawLineChart();
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
          text(countryData[i].value + "%", x + barWidth / 2, y + barHeight + 10);
        else
          text(countryData[i].value + "%", x + barWidth / 2, y - 10);
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

    let startingYearBar = barChartData[country][0].year;
    let startingYearLine = lineChartData[country][0].year;
    
    x_space = startingYearLine - startingYearBar;
    if (x_space != 0)
      x_space = x_space + 2;

    for (let i = 0; i < lineChartData[country].length; i++) {
      let dataPoint = lineChartData[country][i];
      let countryIndex = selectedCountries.indexOf(country);
      x = x_space * (width - paddingRight) / barChartData[selectedCountries[0]].length + countryIndex;
      y = height / 2 - dataPoint.value * scaleY;

      y = y - 100;

      if (i > 0) {      
        stroke(lineColor);
        line(prevX, prevY, x, y);
      }

      prevX = x;
      prevY = y;

      x_space++; 
    }    
  }
}

// This is the callback for loaded data.
function handleDataLoad(d) {
  data = d;
  redraw();
}
