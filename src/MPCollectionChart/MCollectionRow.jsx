import React from 'react';
import { group } from 'd3-array';
import PropTypes from 'prop-types';
import MPCollectionCell from './MCollectionCell';

class MPCollectionRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isFolded: true };
    this.toggleRowDetails = this.toggleRowDetails.bind(this);
    this.changeStudentSelection = this.changeStudentSelection.bind(this);
    this.displayStudentList = this.displayStudentList.bind(this);
  }
  getRowContent(allGrades, gradesFilter, collections, activityid) {
    let keyprefix = `sum-${this.props.name}`;
    let headerRows;
    if (activityid !== undefined) {
      keyprefix = `${activityid}-${this.props.name}`;
      headerRows = [<td key="button" />,
        <td key="activity">{this.props.activities.find(a => a.id === activityid).name} </td>];
    } else {
      headerRows = [
        <td key="button">
          <button onClick={this.toggleRowDetails}>S:{this.props.name}</button>
        </td>,
        <td key="activity" />];
    }
    return (
      <tr key={`activityrow-${keyprefix}-${this.props.name}`}>
        {headerRows}
        <MPCollectionCell
          grades={allGrades}
          selectedStudents={this.props.selectedStudents}
          onStudentSelectionChange={this.changeStudentSelection}
          onDisplayStudentList={this.displayStudentList}
          maxGradesCount={this.props.maxGradesCount}
          key={`${keyprefix}-${this.props.name}-total`}
        />
        {
          collections.map(coll => (
            <MPCollectionCell
              grades={gradesFilter(coll.id)}
              selectedStudents={this.props.selectedStudents}
              onStudentSelectionChange={this.changeStudentSelection}
              onDisplayStudentList={this.displayStudentList}
              maxGradesCount={this.props.maxGradesCount}
              key={`act-${keyprefix}-${coll.id}`}
            />))
        }
      </tr>
    );
  }
  displayStudentList(studentlist) {
    this.props.onDisplayStudentList(studentlist);
  }
  changeStudentSelection(studentList) {
    this.props.onStudentSelectionChange(studentList);
  }

  toggleRowDetails() {
    this.setState(state => ({
      isFolded: !state.isFolded,
    }));
  }

  render() {
    const {
      grades, collections,
    } = this.props;
    const gradesPerCollection = group(
      grades,
      g => g.collectionid,
    );
    const allActivitiesRows = [];
    allActivitiesRows.push(this.getRowContent(
      grades,
      collid => gradesPerCollection.get(collid),
      collections,
    ));
    if (!this.state.isFolded) {
      const gradesPerActivityType = group(
        grades,
        g => g.activityid, // First index is grade name
        g => g.collectionid, // Second index  index is the real collection Id
      );
      gradesPerActivityType.forEach((gradesPerCollectionMap, activityid) => {
        allActivitiesRows.push(this.getRowContent(
          Array.from(gradesPerCollectionMap.values())
            .flat(),
          collid => gradesPerActivityType.get(activityid)
            .get(collid),
          collections,
          activityid,
        ));
      });
    }
    return allActivitiesRows;
  }
}

MPCollectionRow.defaultProps = {
  selectedStudents: [],
  onStudentSelectionChange: null,
  onDisplayStudentList: null,
};

MPCollectionRow.propTypes = {
  name: PropTypes.string.isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    studentid: PropTypes.number,
    activityid: PropTypes.number,
    value: PropTypes.number,
    collectionid: PropTypes.number,
    cohort: PropTypes.number,
  })).isRequired,
  activities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  collections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
    timestamp: PropTypes.number,
  })).isRequired,
  onStudentSelectionChange: PropTypes.func,
  onDisplayStudentList: PropTypes.func,
  maxGradesCount: PropTypes.number.isRequired,
  selectedStudents: PropTypes.arrayOf(PropTypes.number),
};

export default MPCollectionRow;
