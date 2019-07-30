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


class PerActivityBarChart extends React.Component {
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
      this.node,
      this.props.selectedActivityID,
      // eslint-disable-next-line react/prop-types
      this.props.grades,
      // eslint-disable-next-line react/prop-types
      this.props.activities,
      // eslint-disable-next-line react/prop-types
      this.props.students,
      [0.25, 0.50, 0.75, 1],
      'Number of learners per exercise and their results',
    );
  }

  d3Chart(node, selectedaid, gradeList, activityList, studentList, quantiles, title) {
    // The first scale, horizontal scale (X) that will just go through each activity
    const scaleX = getBarChartScaleX(this.props.size.width, quantiles, this.props.padding);

    // Build the data structure to display
    // Now we optionally filter out students or cohorts from the Gradelist
    // First we get grades for the specified activity and sort it by quantiles
    const gradesForActivty = bestGradesPerStudentAndActivity(gradeList).get(selectedaid).values();

    const gradesPerQuantile = rollup(
      gradesForActivty,
      gs => ({
        quantilevalue: getQuantile(gs[0].value, quantiles), // Take the first grade's quantile as a ref.
        studentsid: gs.map(g => g.studentid),
        gradescount: gs.length,
      }),
      g => getQuantile(g.value, quantiles),
    ); // grade[1]=>value)
    // First take the best grade for each activity for each student

    const color = scaleOrdinal(schemeCategory10);

    // Compute the max height of each grade
    const maxHeight = max(
      gradesPerQuantile,
      acc => acc[1].gradescount,
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
    const quantileRect = graph.selectAll('.layer')
      .data(Array.from(gradesPerQuantile.values()))
      .enter()
      .append('rect')
      .attr('x', g => scaleX(g.quantilevalue))
      .attr('width', scaleX.bandwidth())
      .style('fill', (q, index) => color(index))
      .attr('stroke', 'black')
      .attr('stroke-width', 0)
      .attr('height', quantileGrade => scaleY(maxHeight - quantileGrade.gradescount))
      .attr('y', quantileGrade => scaleY(quantileGrade.gradescount));

    // Create the Tooltips
    addRectangleInteractivity('click', quantileRect, (d) => {
      // eslint-disable-next-line react/prop-types
      this.props.onDisplayStudentList(d.studentsid);
    });

    // Now the Axes
    const axis = svg.append('g')
      .attr('class', 'axis');
    const xAxis = getBarChartXAxis(
      scaleX,
      (quantilevalue) => {
        const index = quantiles.findIndex(q => q === quantilevalue);
        const bottomvalue = (index === 0) ? 0 : quantiles[index - 1];
        const topvalue = quantiles[index];
        return `${bottomvalue}-${topvalue}`;
      },
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


PerActivityBarChart.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  padding: PropTypes.string,
  selectedActivityID: PropTypes.number,
};
Object.assign(PerActivityBarChart.propTypes, defaultGraphComponentPropTypes);

PerActivityBarChart.defaultProps = {
  size: {
    width: 1300,
    height: 500,
  },
  padding: '0.08',
  selectedActivityID: 0,
};
Object.assign(PerActivityBarChart.defaultProps, defaultGraphComponentPropsDefault);

const MPResultsPerActivity = graphComponentWithGrades(PerActivityBarChart);
export default MPResultsPerActivity;
