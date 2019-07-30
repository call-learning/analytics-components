import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { transform } from 'd3-transform';

const graphMargin = {
  left: 50,
  right: 20,
  top: 20,
  bottom: 80,
};

export function getBarChartMargin() {
  return graphMargin;
}

export function getBarChartInnerHeight(realHeight) {
  return realHeight - (graphMargin.top + graphMargin.bottom);
}

export function getBarChartInnerWidth(realWidth) {
  return realWidth - (graphMargin.left + graphMargin.right);
}

export function getBarChartScaleX(realWidth, domainFunc, padding) {
  const graphInnerWidth = getBarChartInnerWidth(realWidth);
  // The first scale, horizontal scale (X) that will just go through each activity
  return scaleBand()
    .domain(domainFunc)
    .rangeRound([0, graphInnerWidth])
    .padding(padding);
}

export function getBarChartScaleY(realHeight, maxHeight) {
  const graphInnerHeight = getBarChartInnerHeight(realHeight);
  return scaleLinear()
    .domain([0, maxHeight])
    .range([graphInnerHeight, 0]);
}

export function getBarChartXAxis(scaleX, tickFormatFunction) {
  return axisBottom()
    .scale(scaleX)
    .tickSize(0)
    .tickPadding(6)
    .tickFormat(tickFormatFunction);
}

export function getBarChartYAxis(scaleY) {
  return axisLeft()
    .scale(scaleY)
    .tickSize(10);
}

export function appendAxisToGraph(graphElement, xAxis, yAxis) {
  graphElement.append('g')
    .attr('class', 'xAxis')
    .attr('transform', transform()
      .translate(graphMargin.left, yAxis.scale()
        .range()[0] + graphMargin.top))
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .style('font-size', '18px')
    .attr('transform', () => 'rotate(-45)');
  graphElement.append('g')
    .attr('class', 'yAxis')
    .attr('transform', transform()
      .translate(graphMargin.left, graphMargin.top))
    .call(yAxis);
}

export function addRectangleInteractivity(eventName, rectangles, callback) {
  rectangles.on(eventName, callback);
}
