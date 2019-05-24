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
          <div/>
          <Table
            data={
                this.props.studentSelection.map((studentid) => {
                  const student =
                    Object.assign({}, this.props.students.find(st => st.id === studentid));
                  student.firstactivecollectionts =
                    new Date(this.props.collections.find(
                      col => col.id === student.firstactivecollection).timestamp)
                      .toLocaleDateString();
                  return student;
                })}
            columns={[
                {
                  label: 'Username',
                  key: 'username',
                  columnSortable: true,
                },
                {
                  label: 'ID',
                  key: 'id',
                  columnSortable: false,
                },
                {
                  label: 'Cohort',
                  key: 'cohort',
                  columnSortable: true,
                },
                {
                  label: 'First Active Collection',
                  key: 'firstactivecollectionts',
                  columnSortable: true,
                },
              ]}
            tableSortable
            defaultSortedColumn="username"
            defaultSortDirection="desc"
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
    cohort: PropTypes.string,
    firstactivecollection: PropTypes.number,
  })).isRequired,
  studentSelection: PropTypes.arrayOf(PropTypes.number),
  collections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    filename: PropTypes.string,
    timestamp: PropTypes.number,
  })).isRequired,
  onClose: PropTypes.func,
};

StudentsList.defaultProps = {
  students: [],
  studentSelection: [],
  collections: [],
  onClose: null,
};

export default StudentsList;
