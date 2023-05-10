let table;
let barChartData = {};
let maxValue;
let selectedCountries = ["Costa Rica", "Panama"];
let colors = {
  "Costa Rica": [255, 100, 100],
  "Panama": [100, 255, 100],
  "Dominican Republic": [100, 100, 255]
};

function preload() {
  table = loadTable('Goal8.csv', 'csv', 'header');
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
}

function setup() {
  createCanvas(600, 400);
  processData();
  drawBarChart();
}

function drawBarChart_old() {
  let barWidth = width / barChartData[selectedCountries[0]].length - 10;
  let scaleY = (height - 250) / maxValue;

    // Rotate the canvas around the center point
    //translate(width / 2, height / 2);
    //rotate(PI / 2);
    //translate(-width / 2, -height / 2);

    // translate(0, 200);


  for (let country of selectedCountries) {
    let countryData = barChartData[country];
    for (let i = 0; i < countryData.length; i++) {
      let x = i * (barWidth + 10);
      let y;
      let barHeight;
      
      if (countryData[i] < 0) {
        y = height / 2;
        barHeight = -countryData[i] * scaleY;
      } else {
        y = height / 2 - countryData[i] * scaleY;
        barHeight = countryData[i] * scaleY;
      }

      fill(colors[country]);
      text("2%", x, y - 2)
      rect(x, y, barWidth, barHeight);
    }
  }
  
  resetMatrix();
}


function drawBarChart() {
  let barWidth = 12
  let scaleY = 8 // (height - 300) / maxValue;
  let chartSpacing = 150;

  for (let country of selectedCountries) {
    let countryData = barChartData[country];
    let yPos = selectedCountries.indexOf(country) * (height + 45) / selectedCountries.length + chartSpacing;

    // Draw the country name as a title
    textSize(16);
    fill(0);
    text(country, 150, yPos - 130);

    for (let i = 0; i < countryData.length; i++) {
      let x = i * (barWidth + 10) + 10;
      let y;
      let barHeight;
      
      if (countryData[i].value < 0) {
        y = yPos;
        barHeight = -countryData[i].value * scaleY;
      } else {
        y = yPos - countryData[i].value * scaleY;
        barHeight = countryData[i].value * scaleY;
      }

      fill(colors[country]);
      rect(x, y, barWidth, barHeight);

      // Display the percentage value and year
      textSize(5);
      fill(0);
      textAlign(CENTER);
      text(countryData[i].value + "%", x + barWidth / 2, y - 5);
      text(countryData[i].year, x + barWidth / 2, y - barWidth);
    }
  }
}




