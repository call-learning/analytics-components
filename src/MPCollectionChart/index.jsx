import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { group, rollup, max } from 'd3-array';
import MPCollectionRow from './MCollectionRow';
import StudentsList from '../StudentsList';


class MPCollectionChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStudents: this.props.selectedStudents,
      processedGrades: null,
      studentlist: false,
    };
    this.handleStudentSelectionChange = this.handleStudentSelectionChange.bind(this);
    this.displayStudentList = this.displayStudentList.bind(this);
    this.closeStudentList = this.closeStudentList.bind(this);
    this.processGrades();
  }

  handleStudentSelectionChange(studentList) {
    if (this.props.onStudentSelectionChange) {
      this.props.onStudentSelectionChange(studentList);
    }
    this.setState({ selectedStudents: studentList });
  }

  getHeadings() {
    return (
      <thead
        className={classNames(this.props.headingClassName)}
      >
        <tr>
          <th key="col-start" scope="col" />
          <th key="activity" scope="col" />
          <th key="total" scope="col">Total</th>
          {
          this.props.collections.map((currentCollection, index) =>
            (<th key={index} scope="col">
              <div>{`C${index}`}</div>
              <div
                className="collection-date"
              >{(new Date(currentCollection.timestamp)).toLocaleDateString()}
              </div>
            </th>))
        }
        </tr>
      </thead>
    );
  }

  getTable() {
    if (!this.state.processedGrades) {
      return (<p>Processing ....</p>);
    }
    const maxGradesCount = max(
      this.state.processedGrades.gradesPerFirstCollection.values(),
      gcol => gcol.length,
    );// Extract the max value from each submap
    const allrows = [];
    this.state.processedGrades.gradesPerFirstCollection.forEach((grades, firstCollection) => {
      allrows.push(<MPCollectionRow
        key={`mpcollrow-${firstCollection}`}
        name={Number(firstCollection)
          .toString()}
        grades={grades}
        activities={this.props.activities}
        collections={this.props.collections}
        students={this.props.students}
        studentSelection={this.state.selectedStudents}
        onStudentSelectionChange={this.handleStudentSelectionChange}
        onDisplayStudentList={this.displayStudentList}
        maxGradesCount={maxGradesCount}
      />);
    });

    return (
      <table className={classNames(
        'table',
        this.props.className,
      )}
      >
        {this.getCaption()}
        {this.getHeadings()}
        <tbody>
          {allrows}
        </tbody>
      </table>
    );
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.grades.length !== prevProps.grades.length) {
      this.processGrades();
    }
  }

  getCaption() {
    return this.props.caption && (
      <caption>{this.props.caption}</caption>
    );
  }

  processGrades() {
    // We take the grade processing out of the main thread
    const processgrades = new Promise((resolve) => {
      // We need to extract the changing grades week per week, so we only get additional changes
      // Collection per collection
      const filteredgradelist = this.props.grades.reduce(
        (gradeset, currentgrade) => {
          const gradesetforstudent = gradeset.get(currentgrade.studentid);
          if (gradesetforstudent) {
            const hasgradechanged =
              gradesetforstudent.find(prevgrade =>
                (prevgrade.studentid === currentgrade.studentid) &&
                (prevgrade.activityid === currentgrade.activityid) &&
                (prevgrade.value !== currentgrade.value));
            if (hasgradechanged) {
              gradesetforstudent.push(currentgrade);
            }
          } else {
            gradeset.set(currentgrade.studentid, [currentgrade]);
          }
          return gradeset;
        }
        , new Map(),
      );

      const gradeset = Array.from(filteredgradelist.values())
        .flat();
      // We sort the grade per first collection id
      const gradesPerFirstCollection = group(
        gradeset,
        g => this.props.students.find(s => g.studentid === s.id).firstactivecollection,
        // First  index is first the collection Id
      );
      /* Then we sort get a mapping between the first collection id => the collection id
       and the number of grades */
      const gradeCollectionRoll =
        rollup(
          gradeset,
          g => g.length,
          // First the FIRST collection Id
          g => this.props.students.find(s => g.studentid === s.id).firstactivecollection,
          g => g.collectionid, // Then by collection id first
        );
      resolve({
        gradesPerFirstCollection,
        gradeCollectionRoll,
      });
    });
    processgrades.then((value) => {
      this.setState({
        processedGrades: value,
      });
    });
  }


  render() {
    console.log('Rendering');
    if (this.state.studentlist) {
      return (
        <StudentsList
          students={this.props.students}
          studentSelection={this.state.studentlist}
          collections={this.props.collections}
          cohorts={this.props.cohorts}
          onClose={this.closeStudentList}
        />
      );
    }
    return this.getTable();
  }

  closeStudentList() {
    this.setState({ studentlist: false });
  }

  displayStudentList(studentlist) {
    this.setState({ studentlist });
  }
}

MPCollectionChart.propTypes = {
  caption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  className: PropTypes.string,
  collections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
    timestamp: PropTypes.number,
  })).isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    studentid: PropTypes.number,
    activityid: PropTypes.number,
    value: PropTypes.number,
    collectionid: PropTypes.number,
    cohort: PropTypes.number,
  })).isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.number,
    cohorts: PropTypes.arrayOf(PropTypes.number),
    firstactivecollection: PropTypes.number,
  })).isRequired,
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  activities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  onStudentSelectionChange: PropTypes.func,
  headingClassName: PropTypes.arrayOf(PropTypes.string),
};

MPCollectionChart.defaultProps = {
  caption: null,
  className: undefined,
  headingClassName: [],
  onStudentSelectionChange: null,
  cohorts: [],
};

export default MPCollectionChart;
