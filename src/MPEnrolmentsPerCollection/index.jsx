import React from 'react';
import PropTypes from 'prop-types';
import { scaleOrdinal } from 'd3-scale';
import { rollup, max, least } from 'd3-array';
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
      this.node, this.props.grades, this.props.activities, this.props.collections, this.props.students,
      [0.25, 0.50, 0.75, 1],
      'Number of learners per collection',
    );
  }

  d3Chart(node, gradeList, activityList, collections, studentList, quantiles, title) {
    // The first scale, horizontal scale (X) that will just go through each activity
    const scaleX = getBarChartScaleX(this.props.size.width, activityList.map(a => a.id), this.props.padding);

    // Build the data structure to display
    // ATTENTION: Assumptions here: we have one grade per student and activity, so there should not
    // be any duplicate studentid
    const gradesByActivityAndCollection = rollup(
      gradeList,
      glist => glist.map(grade => grade.studentid),
      g => g.activityid, // First is the activity type
      g => g.collectionid, // Secondly  index is by the collection id
    );
    // TODO : now we need create an array of collection / studentid sorted by chronological order
    // with c0 list of students, then c0-c1 list of student and so on (we only add student who
    // appear in between collections
    // See: https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848
    const gradesByActivityAndCollectionAccumulated =
      Array.from(gradesByActivityAndCollection.entries())
        .map((value) => {
          const activityId = value[0];
          const collectionArray = Array.from(value[1].entries())
            .sort((c1, c2) => c1[0] - c2[0]); // Sorted collection Map
          // Now we return an object { collectionid : id, studentidlist: [] }
          const collectionStudentArray = collectionArray.map((collmapvalue, i, collmap) => {
            let studentIncrList = collmapvalue[1];
            if (i > 0) {
              const prevStudentList = collmap[i - 1][1];
              studentIncrList = studentIncrList.filter(x => !prevStudentList.includes(x));
            }
            return {
              collectionid: collmapvalue[0],
              studentidlist: studentIncrList,
            };
          });
          return {
            activityid: activityId,
            collectionStudents: collectionStudentArray,
          };
        });

    const color = scaleOrdinal(schemeCategory10);

    // Compute the max height of each grade
    const maxHeight = max(
      gradesByActivityAndCollectionAccumulated,
      actlist => actlist.collectionStudents.reduce((height, collstudentlist) => height + collstudentlist.studentidlist.length, 0),
    );
    // Second scale in Y, the values being between 0 and max
    const scaleY = getBarChartScaleY(this.props.size.height, maxHeight);

    const svg = select(node)
      .select('svg');
    const graph = svg.append('g')
      .attr('class', 'graph')
      .attr('transform', transform()
        .translate(getBarChartMargin().left, getBarChartMargin().top));

    // We add an element of type <g class='layer'...> for each activity
    const activityGroup = graph.selectAll('.layer')
      .data(gradesByActivityAndCollectionAccumulated)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('transform', transform()
        .translate(aid => scaleX(aid.activityid)));

    // For each collection we draw a rectangle
    // We get a flat array, with [collectionid,studentlist] and we sort it by collectionid
    const rect = activityGroup.selectAll('rect')
      .data(d => d.collectionStudents)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('width', scaleX.bandwidth())
      .style('fill', (q, index) => color(index))
      .attr('stroke', 'black')
      .attr('stroke-width', 0)
      .attr('height', (collectionStudents) => {
        const studList = collectionStudents.studentidlist;
        return scaleY(maxHeight - studList.length);
      })
      .attr('y', (currentCollection, i, allCollections) => {
        const currentStudentList = currentCollection.studentidlist;
        const previousHeight = allCollections.reduce(
          (currentHeight, otherCollection) => {
            const currentCollectionId = currentCollection.collectionid;
            const otherCollectionId = select(otherCollection)
              .datum().collectionid;
            const otherCollectionHeight = select(otherCollection)
              .datum().studentidlist.length;
            return currentCollectionId > otherCollectionId ?
              currentHeight + otherCollectionHeight : currentHeight;
          }
          , 0,
        );
        const posY = currentStudentList.length + previousHeight;
        return scaleY(posY);
      });

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

const MPEnrolmentsPerCollection = graphComponentWithGrades(StackedBarChart);
export default MPEnrolmentsPerCollection;
