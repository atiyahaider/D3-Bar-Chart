const w = 1000;
const h = 600;
const padding = 40;
const nightBlue = '#003333';

const svg = d3.select('#bar-chart').
append('svg').
attr('viewBox', '0 0 ' + w + ' ' + h).
attr('preserveAspectRatio', 'xMinYMin meet');


svg.append("text").
attr('x', w / 3 + 115).
attr('y', h - 1).
text('Guide to the National Income and Product Accounts of the United States (NIPA)').
attr('class', 'link').
on('click', function () {window.open("http://www.bea.gov/resources/methodologies/nipa-handbook");});

//Sample data
/*data: [
          ["1947-01-01", 243.1],
          ["1947-04-01", 246.3],
        ] */

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(function (jsonData) {

  const GDPData = jsonData.data;
  const barWidth = (w - padding) / GDPData.length;

  var Qtrs = GDPData.map(i => {
    var tmpQtr;
    switch (i[0].substr(5, 2)) {
      case "01":tmpQtr = "Q1";
        break;
      case "04":tmpQtr = "Q2";
        break;
      case "07":tmpQtr = "Q3";
        break;
      case "10":tmpQtr = "Q4";
        break;}

    return i[0].substr(0, 4) + " " + tmpQtr;
  });

  var formattedDates = GDPData.map(i => new Date(i[0]));

  const xScale = d3.scaleTime().
  domain([d3.min(formattedDates), d3.max(formattedDates)]).
  range([padding, w - padding]);

  const yScale = d3.scaleLinear().
  domain([0, d3.max(GDPData, d => d[1])]).
  range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  svg.append("g").
  attr("transform", "translate(0," + (h - padding) + ")").
  attr("id", "x-axis").
  call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  svg.append("g").
  attr("transform", "translate(" + padding + ", 0)").
  attr("id", "y-axis").
  call(yAxis);

  svg.append('text').
  attr('transform', 'rotate(-90)').
  attr('x', -h / 2).
  attr('y', padding + 20).
  text('Gross Domestic Product, USA');

  var tip = d3.tip().
  attr('id', 'tooltip').
  offset(function () {return [this.getBBox().height / 2, 0];}).
  html(function (d, i) {
    d3.select('#tooltip').attr('data-date', d[0]);
    return "<span style='color:white'>" + Qtrs[i] + "<br>" + d3.format("($,.2f")(d[1]) + " Billion</span>";});

  svg.call(tip);

  svg.selectAll("rect").
  data(GDPData).
  enter().
  append("rect").
  attr('x', (d, i) => xScale(formattedDates[i])).
  attr('y', d => yScale(d[1])).
  attr("width", barWidth).
  attr("height", d => h - padding - yScale(d[1])).
  attr("fill", "#008080").
  attr("class", "bar").
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  on('mouseover', tip.show).
  on('mouseout', tip.hide);
});