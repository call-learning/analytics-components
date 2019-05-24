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

  changeStudentSelection() {
    this.props.onStudentSelectionChange(this.getStudentListFromGrades());
  }
  displayStudentList(event) {
    this.props.onDisplayStudentList(this.getStudentListFromGrades());
    event.preventDefault();
    event.stopPropagation();
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
        .filter(grade => (this.props.studentSelection)
          && (this.props.studentSelection.indexOf(grade.studentid) !== -1));
      svgCircle.push(<circle
        cx={cellSize / 2}
        cy={cellSize / 2}
        r={scale(grades.length)}
        className="all-students"
      />);
      if (selectedGrades.length > 0) {
        svgCircle.push(<circle
          cx={cellSize / 2}
          cy={cellSize / 2}
          r={scale(selectedGrades.length)}
          className="selected-students"
        />);
      }
    }
    return (
      <td onContextMenu={this.displayStudentList} onClick={this.changeStudentSelection} >
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
      </td>
    );
  }
}

// Specifies the default values for props
MPCollectionCell.defaultProps = {
  cellSize: 100,
  studentSelection: [],
  onStudentSelectionChange: null,
  onDisplayStudentList: null,
};

MPCollectionCell.propTypes = {
  cellSize: PropTypes.number,
  grades: PropTypes.arrayOf(PropTypes.shape({
    studentid: PropTypes.number,
    activityid: PropTypes.number,
    value: PropTypes.number,
    collectionid: PropTypes.number,
    cohort: PropTypes.string,
  })),
  students: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.number,
    cohort: PropTypes.string,
    firstactivecollection: PropTypes.number,
  })).isRequired,
  studentSelection: PropTypes.arrayOf(PropTypes.number),
  maxGradesCount: PropTypes.number.isRequired,
  onStudentSelectionChange: PropTypes.func,
  onDisplayStudentList: PropTypes.func,
};

export default MPCollectionCell;

/*          <OverlayTrigger
            key="left"
            placement="left"
            overlay={
              <Tooltip id="tooltip-right">
                {

                  grades.reduce( (acc, current) => {
                    if (! (current.studentid in acc)) {
                      acc[current.studentid] = this.props.students.find(
                        student => student.id === current.studentid
                      ).username;
                    }
                    return acc;
                  },[]).map(
                    studentname => (<p>{ studentname }</p>)
                  )
}
</Tooltip>
}

...
</OverlayTrigger>
> */
