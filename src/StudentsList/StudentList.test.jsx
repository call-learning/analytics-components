import React from 'react';
import { mount } from 'enzyme';

import StudentsList from './index';

import { grades as gradesData } from './../../tests/data/grades.data';

describe('<StudentList />', () => {
  describe('renders', () => {
    const wrapper = mount(<StudentsList
      students={gradesData.students}
      selectedStudents={[151, 201]}
      collections={gradesData.collections}
      cohorts={gradesData.cohorts}
    />).find('StudentsList');

    it('this is a table with two rows', () => {
      expect(wrapper.find('tr').length).toEqual(3);
      expect(wrapper.find('th').length).toEqual(4);
    });
  });
});
