import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {group, rollup, max} from 'd3-array';
import MPCollectionRow from './MCollectionRow';

/**
 *
 */
class MPCollectionChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudents: this.props.selectedStudents
        };
        this.handleStudentSelectionChange = this.handleStudentSelectionChange.bind(this);
    }

    getCaption() {
        return this.props.caption && (
            <caption>{this.props.caption}</caption>
        );
    }

    handleStudentSelectionChange(studentList) {
        if (this.props.onStudentSelectionChange) {
            this.props.onStudentSelectionChange(studentList)
        }
        this.setState({selectedStudents: studentList});
    }

    getHeadings() {
        return (
            <thead
                className={classNames(this.props.headingClassName)}>
            <tr>
                <th key="col-start" scope="col"/>
                <th key="activity" scope="col"/>
                {
                    this.props.collections.map(
                        (currentCollection, index) =>
                            <th key={index} scope="col">
                                <div>{index}</div>
                                <div className="collection-date">{currentCollection.filedate}</div>
                            </th>
                    )
                }
            </tr>
            </thead>
        );
    }

    getBody() {
        const gradesPerFirstCollection = group(this.props.grades,
            g => this.props.students[g.studentid].firstactivecollection, // First  index is first the collection Id
        );
        const gradeCollectionRoll =
            rollup(this.props.grades,
                g => g.length,
                g => this.props.students[g.studentid].firstactivecollection, // First the FIRST collection Id
                g => g.collectid // Then by collection id first
            );

        const maxGradesCount = max(gradeCollectionRoll.values(),
            gcol => max(gcol.values())
        );// Extract the max value from each submap
        let allrows = [];
        gradesPerFirstCollection.forEach((grades, firstCollection) => {
            allrows.push(<MPCollectionRow
                key={firstCollection} name={firstCollection} grades={grades}
                allcolumns={this.props.collections}
                studentSelection={this.state.selectedStudents}
                onStudentSelectionChange={this.handleStudentSelectionChange}
                maxGradesCount={maxGradesCount}
            />);
        });
        return (
            <tbody>
            {allrows}
            </tbody>
        )
    }

    render() {
        return (
            <table className={classNames(
                'table',
                this.props.className,
            )}
            >
                {this.getCaption()}
                {this.getHeadings()}
                {this.getBody()}
            </table>
        );
    }
}

MPCollectionChart.propTypes = {
    caption: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    className: PropTypes.string,
    collections: PropTypes.arrayOf(
        PropTypes.shape({
            filename: PropTypes.string,
            filedate: PropTypes.string
        })).isRequired,
    grades: PropTypes.arrayOf(
        PropTypes.shape({
            studentid: PropTypes.number,
            name: PropTypes.string,
            value: PropTypes.number,
            filedate: PropTypes.string,
            collectid: PropTypes.number
        })).isRequired,
    students: PropTypes.objectOf(
        PropTypes.shape({
            username: PropTypes.string,
            id: PropTypes.number,
            cohort: PropTypes.string,
            firstactivecollection: PropTypes.number
        })).isRequired,
    headingClassName: PropTypes.arrayOf(PropTypes.string),
    rowHeaderColumnKey: PropTypes.string,
};

MPCollectionChart.defaultProps = {
    caption: null,
    className: undefined,
    headingClassName: [],
};


export default MPCollectionChart;
