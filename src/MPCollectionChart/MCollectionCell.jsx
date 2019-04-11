import React from 'react';
import {scaleLinear} from 'd3-scale';

class MPCollectionCell extends React.Component {
    constructor(props) {
        super(props);
    }


    handleClick(grades) {
        const studentIds = grades.reduce(
            (acc,current,index) => {
                acc.add(current.studentid);
                return acc;
            },
            new Set()
        );
        this.props.onStudentSelectionChange([...studentIds]);
    }

    render() {
        const grades = this.props.grades;
        const scale =  scaleLinear().domain([0,this.props.maxGradesCount]).range([0,Number(this.props.cellSize/2)]);

        if (grades) {
            const selectedGrades = this.props.grades.filter((grade) =>
                (this.props.studentSelection) && (this.props.studentSelection.indexOf(grade.studentid) !== -1));

            const scallen = scale(grades.length);
            return <td>
                <svg onClick={this.handleClick.bind(this,grades)} width={this.props.cellSize} height={this.props.cellSize} viewBox={"0 0 " + this.props.cellSize+ " " +this.props.cellSize} className="student-bubble">
                    <circle cx={this.props.cellSize/2} cy={this.props.cellSize/2} r={scale(grades.length)} className="all-students"/>
                    { selectedGrades.length > 0 &&
                        <circle cx={this.props.cellSize / 2} cy={this.props.cellSize / 2}
                                r={scale(selectedGrades.length)} className="selected-students"/>
                    }
                </svg>
            </td>
        } else {
            let rectsize = this.props.cellSize / 4;
            return <td>
                <svg width={this.props.cellSize} height={this.props.cellSize} viewBox={"0 0 " + this.props.cellSize+ " " +this.props.cellSize} className="student-bubble">
                    <rect x={this.props.cellSize/2 - rectsize/2} y={this.props.cellSize/2 - rectsize/2} width={rectsize} height={rectsize} className="no-students"/>
                </svg>
                </td>
        }
    }
}


// Specifies the default values for props
MPCollectionCell.defaultProps = {
            cellSize: '40'
};

export default MPCollectionCell;