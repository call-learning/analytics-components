import React from 'react';
import { mount } from 'enzyme';

import MPResultsPerActivity from './index';

import { grades as gradesData } from './../../tests/data/grades.data';

const props = {
  grades: gradesData.grades,
  students: gradesData.students,
  collections: gradesData.collections,
  activities: gradesData.activities,
  caption: 'Simple Stacked Chart',
  selectedActivityID : 1,
};

describe('<MPResultsPerActivity />', () => {
  describe('renders', () => {
    const wrapper = mount(<MPResultsPerActivity {...props} />).find('MPCollectionChart');

    it('with display columns in the right order', () => {
      wrapper.find('th').forEach((th, i) => {
        if (i > 1) {
          const realcollection = i - 2; // First two headers are empty
          expect(th.text()).toEqual(realcollection + props.collections[realcollection].filedate);
        }
      });
    });
  });
});
