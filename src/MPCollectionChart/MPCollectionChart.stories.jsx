import React from 'react';
import {storiesOf} from '@storybook/react';

import MPCollectionChart from './index';
import README from './README.md';

import {grades as gradesData} from './../../tests/data/grades.data';

storiesOf('MPCollectionChart', module)
    .addParameters({info: {text: README}})
    .add('Basic', () => (
        <MPCollectionChart
            grades={gradesData.grades}
            students={gradesData.students}
            collections={gradesData.collections}
            activities={gradesData.activities}
            caption="Basic Generation Chart"
        />
    ))
    .add('Preselected', () => (
            <MPCollectionChart
                grades={gradesData.grades}
                students={gradesData.students}
                collections={gradesData.collections}
                activities={gradesData.activities}
                selectedStudents={[152]}
                caption="Generation Chart with one student preselected"
            />
        )
    );
