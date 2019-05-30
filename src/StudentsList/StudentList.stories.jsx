import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import StudentList from './index';
import README from './README.md';

import { grades as gradesData } from './../../tests/data/grades.data';

storiesOf('StudentList', module)
  .addParameters({ info: { text: README } })
  .add('Basic', () => (
    <StudentList
      students={gradesData.students}
      studentSelection={[151, 201]}
      collections={gradesData.collections}
      cohorts={gradesData.cohorts}
    />
  ));

