import PropTypes from 'prop-types';
import React from 'react';
import StudentsList from './StudentsList';
import MPCollectionRow from './MPCollectionChart/MCollectionRow';

/**
 * Define standard proptypes and default types
 */


const defaultGraphComponentPropTypes = {
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
  selectedStudents: PropTypes.arrayOf(PropTypes.number),
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

const defaultGraphComponentPropsDefault = {
  caption: null,
  className: undefined,
  headingClassName: [],
  onStudentSelectionChange: null,
  cohorts: [],
  selectedStudents: [],
};

/**
 * High order component so we can regroup checks for common properties
 * @param WrappedComponent
 * @param gradeData
 * @returns new component
 */

// https://reactjs.org/docs/higher-order-components.html
// https://medium.com/@lolahef/react-event-emitter-9a3bb0c719


function graphComponentWithGrades(WrappedComponent) {
  const componentWithGrades = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedStudents: this.props.selectedStudents,
        studentlist: false,
      };
      this.handleStudentSelectionChange = this.handleStudentSelectionChange.bind(this);
      this.displayStudentList = this.displayStudentList.bind(this);
      this.closeStudentList = this.closeStudentList.bind(this);
    }

    handleStudentSelectionChange(studentList) {
      if (this.props.onStudentSelectionChange) {
        this.props.onStudentSelectionChange(studentList);
      }
      this.setState({ selectedStudents: studentList });
    }

    displayStudentList(slist) {
      this.setState({ selectedStudents: slist, studentlist: true });
    }

    closeStudentList() {
      this.setState({ studentlist: false });
    }

    render() {
      if (this.state.studentlist) {
        return (
          <StudentsList
            students={this.props.students}
            selectedStudents={this.state.selectedStudents}
            collections={this.props.collections}
            cohorts={this.props.cohorts}
            onClose={this.closeStudentList}
          />
        );
      }

      return (<WrappedComponent
        {...this.props}
        onStudentSelectionChange={this.handleStudentSelectionChange}
        onDisplayStudentList={this.displayStudentList}

      />);
    }
  };

  componentWithGrades.propTypes = WrappedComponent.propTypes;
  componentWithGrades.defaultProps = WrappedComponent.defaultProps;

  /* See https://github.com/airbnb/javascript/tree/master/react#naming */
  const WrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';
  componentWithGrades.displayName = `graphComponentWithGrades(${WrappedComponentName})`;

  return componentWithGrades;
}

export {
  graphComponentWithGrades,
  defaultGraphComponentPropTypes,
  defaultGraphComponentPropsDefault,
};
