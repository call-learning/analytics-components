import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Icon } from '@edx/paragon';
import styles from './StudentsList.scss';

/**
 *
 * Pretty print a student's list from their list of identifiers
 *
 */
class StudentsList extends React.Component {
  render() {
    return (
      <div className="container student-list">
        <div className="row">
          <div className="col-auto mr-auto" />
          <div className="col-auto">
            <Button onClick={this.props.onClose} className="btn-light">
              <Icon className="fa fa-close" />
            </Button>
          </div>
        </div>
        <div className={styles.row}>
          <div />
          <Table
            data={
              this.props.selectedStudents.map((studentid) => {
                const student =
                  Object.assign({}, this.props.students.find(st => st.id === studentid));
                student.firstactivecollectionts =
                  new Date(this.props.collections.find(
                    col => col.id === student.firstactivecollection).timestamp)
                    .toLocaleDateString();
                student.cohortnames = student.cohorts.reduce(
                  (acc, current) => {
                    const cohortname = this.props.cohorts.find(c => c.id === current).name;
                    const sep = acc ? ',' : '';
                    return `${acc}${sep}${cohortname}`;
                  },
                  '',
                );
                return student;
              })
            }
            columns={[
              {
                label: 'Username',
                key: 'username',
                columnSortable: false,
              },
              {
                label: 'ID',
                key: 'id',
                columnSortable: false,
              },
              {
                label: 'Cohort',
                key: 'cohortnames',
                columnSortable: false,
              },
              {
                label: 'First Active Collection',
                key: 'firstactivecollectionts',
                columnSortable: false,
              },
            ]}
          />
        </div>
        <div className="row justify-content-center">
          <div>
            <Button onClick={this.props.onClose} className="btn-primary"> Close </Button>
          </div>
        </div>
      </div>
    );
  }
}

StudentsList.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.number,
    cohorts: PropTypes.arrayOf(PropTypes.number),
    firstactivecollection: PropTypes.number,
  })).isRequired,
  selectedStudents: PropTypes.arrayOf(PropTypes.number),
  collections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
    timestamp: PropTypes.number,
  })).isRequired,
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  onClose: PropTypes.func,
};

StudentsList.defaultProps = {
  students: [],
  studentSelection: [],
  collections: [],
  cohorts: [],
  onClose: null,
};

export default StudentsList;
