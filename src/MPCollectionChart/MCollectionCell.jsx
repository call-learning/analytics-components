import React from 'react';
import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';

class MPCollectionCell extends React.Component {

  constructor(props) {
    super(props);
    this.changeStudentSelection = this.changeStudentSelection.bind(this);
    this.displayStudentList = this.displayStudentList.bind(this);
  }

  // Tools - Internal
  getStudentListFromGrades() {
    const studentIds = this.props.grades.reduce(
      (acc, current) => {
        acc.add(current.studentid);
        return acc;
      },
      new Set(),
    );
    return [...studentIds];
  }

  // Here we use arrow function as shortcut, so we avoid binding
  changeStudentSelection() {
    this.props.onStudentSelectionChange(this.getStudentListFromGrades());
  }

  displayStudentList(e) {
    this.props.onDisplayStudentList(this.getStudentListFromGrades());
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { grades, cellSize } = this.props;
    const scale = scaleLinear()
      .domain([0, this.props.maxGradesCount])
      .range([0, Number(this.props.cellSize / 2)]);

    const svgCircle = [];
    const gradeCount = grades ? grades.length : 0;
    if (grades) {
      const selectedGrades = grades
        .filter(grade => (this.props.selectedStudents)
          && (this.props.selectedStudents.indexOf(grade.studentid) !== -1));
      svgCircle.push(<circle
        cx={cellSize / 2}
        cy={cellSize / 2}
        r={scale(grades.length)}
        className="all-students"
        key="outer-circle"
      />);
      if (selectedGrades.length > 0) {
        svgCircle.push(<circle
          cx={cellSize / 2}
          cy={cellSize / 2}
          r={scale(selectedGrades.length)}
          className="selected-students"
          key="inner-circle"
        />);
      }
    }
    return (
      <td>
        <button
          className="tc-button"
          onContextMenu={this.displayStudentList}
          onClick={this.changeStudentSelection}
          onKeyPress={this.changeStudentSelection}
        >
          <svg
            width={cellSize}
            height={cellSize}
            viewBox={`0 0 ${cellSize} ${cellSize}`}
            className="student-bubble"
          >
            {svgCircle}
            <g className="text-label">
              <rect
                x={cellSize / 4}
                y={0}
                width={cellSize / 2}
                height={cellSize / 4}
              />
              <text
                x={cellSize / 2}
                y={0}
              > {gradeCount}
              </text>
            </g>
          </svg>
        </button>
      </td>
    );
  }
}

// Specifies the default values for props
MPCollectionCell.defaultProps = {
  cellSize: 100,
  selectedStudents: [],
  onStudentSelectionChange: null,
  onDisplayStudentList: null,
  grades: [],
};

MPCollectionCell.propTypes = {
  cellSize: PropTypes.number,
  grades: PropTypes.arrayOf(PropTypes.shape({
    studentid: PropTypes.number,
    activityid: PropTypes.number,
    value: PropTypes.number,
    collectionid: PropTypes.number,
    cohort: PropTypes.number,
  })),
  selectedStudents: PropTypes.arrayOf(PropTypes.number),
  maxGradesCount: PropTypes.number.isRequired,
  onStudentSelectionChange: PropTypes.func,
  onDisplayStudentList: PropTypes.func,
};

export default MPCollectionCell;
