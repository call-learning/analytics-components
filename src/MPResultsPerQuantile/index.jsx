import React from 'react';
import PropTypes from 'prop-types';
import { scaleOrdinal } from 'd3-scale';
import { rollup, max } from 'd3-array';
import { select } from 'd3-selection';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { transform } from 'd3-transform';
import {
  graphComponentWithGrades,
  defaultGraphComponentPropsDefault,
  defaultGraphComponentPropTypes,
} from '../HOCGraphWithGrades';
import getQuantile from '../utils/quantileFromValue';
import bestGradesPerStudentAndActivity from '../utils/bestGradesPerStudentAndActivity';
import {
  getBarChartMargin,
  getBarChartScaleX,
  getBarChartScaleY,
  getBarChartXAxis,
  getBarChartYAxis,
  appendAxisToGraph,
  addRectangleInteractivity,
} from '../utils/barChartCommons';

class StackedBarChart extends React.Component {
  static defaultProps = {
    size: {
      width: {
        width: 1300,
        height: 500,
      },
      padding: '0.08',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      processedGrades: null,
    };
    this.processGrades();
  }

  componentDidMount() {
    // We silence errors here because they are actually validated but lint does not see it as it is
    // made in the HOC
    this.d3Chart(
      // eslint-disable-next-line react/prop-types
      this.node, this.props.grades, this.props.activities, this.props.students,
      [0.25, 0.50, 0.75, 1],
      'Number of learners per exercise and their results',
    );
  }

  d3Chart(node, gradeList, activityList, studentList, quantiles, title) {
    // The first scale, horizontal scale (X) that will just go through each activity
    const scaleX = getBarChartScaleX(this.props.size.width, activityList.map(a => a.id), this.props.padding);

    // Build the data structure to display
    // Now we optionally filter out students or cohorts from the Gradelist
    // First we regroup student grades per activity and then per student and we take the
    // student max grade for this activity
    const bestGradesPerActivity = bestGradesPerStudentAndActivity(gradeList);

    /**
     * Now we need to obtain an array of objects like:
     * [ {activityid: 1, name: 'activity name', quantiles:
     *     [ { quantilevalue: 0.45, studentdsid: [1,2,3], gradecount: 4 } , ...]
     *
     * This is because D3JS supports arrays and not maps as input for data()
     */
    const gradesPerActivityAndQuantile = []; // No need to have a map as we need a flat
    // array for d3.data
    bestGradesPerActivity.forEach((grades, key) => {
      const ad = activityList.find(a => a.id === key);
      const actquantiles = rollup(
        grades.values(),
        gs => ({
          quantilevalue: getQuantile(gs[0].value, quantiles), // Take the first grade's quantile as a ref.
          studentsid: gs.map(g => g.studentid),
          gradescount: gs.length,
        }),
        g => getQuantile(g.value, quantiles), // grade[1]=>value
      );
      const sortedquantiles = Array.from(actquantiles.values())
        .sort((g1, g2) => g2.quantilevalue - g1.quantilevalue);
      gradesPerActivityAndQuantile.push({
        activityid: ad.id,
        activityname: ad.name,
        quantiles: sortedquantiles,
      });
    });

    // First take the best grade for each activity for each student

    const color = scaleOrdinal(schemeCategory10);

    // Compute the max height of each grade
    const maxHeight = max(
      gradesPerActivityAndQuantile,
      acc => acc.quantiles.reduce((height, g) => height + g.gradescount, 0),
    );
    // Second scale in Y, the values being between 0 and max
    const scaleY = getBarChartScaleY(this.props.size.height, maxHeight);


    const svg = select(node)
      .select('svg');
    const graph = svg.append('g')
      .attr('class', 'graph')
      .attr('transform', transform()
        .translate(getBarChartMargin().left, getBarChartMargin().top));

    // We add an element of type <g class='layer'...> for each quantile
    const activityGroup = graph.selectAll('.layer')
      .data(gradesPerActivityAndQuantile)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('transform', transform()
        .translate(g => scaleX(g.activityid)));

    // For each quantile we draw a rectangle
    const rect = activityGroup.selectAll('rect')
      .data(d => Array.from(d.quantiles)) // We pass the values so we get a flat array
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('width', scaleX.bandwidth())
      .style('fill', (q, index) => color(index))
      .attr('stroke', 'black')
      .attr('stroke-width', 0)
      .attr('height', quantileGrade => scaleY(maxHeight - quantileGrade.gradescount))
      .attr('y', (currentQuantile, i, allQuantiles) =>
        scaleY(currentQuantile.gradescount + allQuantiles.reduce(
          (currentHeight, quantileGrades) =>
            ((currentQuantile.quantilevalue) > parseFloat(select(quantileGrades)
              .datum().quantilevalue) ?
              currentHeight + select(quantileGrades)
                .datum().gradescount : currentHeight),
          0, // Initial height is 0
        )));

    // Create the Tooltips
    addRectangleInteractivity('click', rect, (d) => {
      // eslint-disable-next-line react/prop-types
      this.props.onDisplayStudentList(d.studentsid);
    });

    // Now the Axes
    const axis = svg.append('g')
      .attr('class', 'axis');

    const xAxis = getBarChartXAxis(
      scaleX,
      activityid => activityList.find(a => a.id === activityid).name,
    );
    const yAxis = getBarChartYAxis(scaleY);

    appendAxisToGraph(axis, xAxis, yAxis);
  }

  processGrades() {
    // We take the grade processing out of the main thread
    const processgrades = new Promise((resolve) => {
      // We need to extract the changing grades week per week, so we only get additional changes
      // Collection per collection
      resolve({});
    });
    processgrades.then((value) => {
      this.setState({
        processedGrades: value,
      });
    });
  }

  render() {
    // We use D3JS to render content here
    return (
      <div ref={(node) => { this.node = node; }}>
        <svg
          width={this.props.size.width}
          height={this.props.size.height}
        />
      </div>);
  }
}


StackedBarChart.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  padding: PropTypes.string,
};
Object.assign(StackedBarChart.propTypes, defaultGraphComponentPropTypes);

StackedBarChart.defaultProps = {
  size: {
    width: 1300,
    height: 500,
  },
  padding: '0.08',
};
Object.assign(StackedBarChart.defaultProps, defaultGraphComponentPropsDefault);

const MPResultsPerQuantile = graphComponentWithGrades(StackedBarChart);
export default MPResultsPerQuantile;
