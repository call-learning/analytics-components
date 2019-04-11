import React from 'react';
import {group} from 'd3-array';
import MPCollectionCell from "./MCollectionCell";

class MPCollectionRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isFolded: true};
        this.handleClick = this.handleClick.bind(this);
        this.handleStudentSelectionChange = this.handleStudentSelectionChange.bind(this);
    }


    handleClick() {
        this.setState(state => ({
            isFolded: !state.isFolded
        }));
    }

    handleStudentSelectionChange(studentList) {
        this.props.onStudentSelectionChange(studentList);
    }

    render() {
        const grades = this.props.grades;
        const name = this.props.name;
        const firstcollection = this.props.name;
        const allcolumns = this.props.allcolumns;

        const gradesPerActivityName = group(grades,
            g => g.name, // First index is grade name
            g => g.collectid // Second index  index is the real collection Id
        );
        const gradesPerCollection = group(grades,
            g => g.collectid
        );
        let allActivitiesRows = [];
        allActivitiesRows.push(<tr key={"summary-"+firstcollection}>
            <td>
                <button
                    onClick={this.handleClick}>S:{name}
                </button>
            </td>
            <td></td>
            {
                allcolumns.map((coll, collectionId) => <MPCollectionCell grades={gradesPerCollection.get(collectionId)}
                                                                         studentSelection={this.props.studentSelection}
                                                                         onStudentSelectionChange={this.handleStudentSelectionChange}
                                                                         maxGradesCount={this.props.maxGradesCount}
                                                                         key={"summary-"+firstcollection+"-"+collectionId}
                />)
            }
            </tr>);
        if (!this.state.isFolded) {

            gradesPerActivityName.forEach(
                (gradesPerCollectionMap, activityName) => {
                    allActivitiesRows.push(
                        <tr key={activityName+"-"+firstcollection}>
                            <td></td>
                            <td>{activityName}</td>
                            {
                                allcolumns.map((coll, collectionId) =>
                                    <MPCollectionCell grades={gradesPerActivityName.get(activityName).get(collectionId)}
                                                      studentSelection={this.props.studentSelection}
                                                      onStudentSelectionChange={this.handleStudentSelectionChange}
                                                      maxGradesCount={this.props.maxGradesCount}
                                                      key={activityName+firstcollection+"-"+collectionId}
                                    />)
                            }
                        </tr>
                    );
                }
            )
        }
        return allActivitiesRows;
    }
}

export default MPCollectionRow;