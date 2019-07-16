import React from 'react';
import classNames from 'classnames';
import { group, rollup, max } from 'd3-array';
import MPCollectionRow from './MCollectionRow';
import {
  graphComponentWithGrades,
  defaultGraphComponentPropsDefault,
  defaultGraphComponentPropTypes,
} from '../HOCGraphWithGrades';

class TableCollectionChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processedGrades: null,
    };
    this.processGrades();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.grades.length !== prevProps.grades.length) {
      this.processGrades();
    }
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
      /* The index is in fact a key, so it is fine */
      allrows.push(<MPCollectionRow
        /* eslint-disable-next-line react/no-array-index-key */
        key={`mpcollrow-${firstCollection}`}
        name={Number(firstCollection)
          .toString()}
        grades={grades}
        activities={this.props.activities}
        collections={this.props.collections}
        students={this.props.students}
        selectedStudents={this.props.selectedStudents}
        onStudentSelectionChange={this.props.onStudentSelectionChange}
        onDisplayStudentList={this.props.onDisplayStudentList}
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
              (
                <th key={currentCollection.timestamp} scope="col">
                  <div>{`C${index}`}</div>
                  <div
                    className="collection-date"
                  >{(new Date(currentCollection.timestamp)).toLocaleDateString()}
                  </div>
                </th>
              ))
          }
        </tr>
      </thead>
    );
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
    return this.getTable();
  }
}

TableCollectionChart.propTypes = defaultGraphComponentPropTypes;
TableCollectionChart.defaultProps = defaultGraphComponentPropsDefault;

const MPCollectionChart = graphComponentWithGrades(TableCollectionChart);
export default MPCollectionChart ;
