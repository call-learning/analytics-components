import React from 'react';
import { mount } from 'enzyme';

import MPCollectionChart from './index';

import { grades as gradesData } from './../../tests/data/grades.data';

const props = {
  grades: gradesData.grades,
  students: gradesData.students,
  collections: gradesData.collections,
  caption: 'Simple Generation Chart',
};

describe('<MPCollectionChart />', () => {
  describe('renders', () => {
    const wrapper = mount(<MPCollectionChart {...props} />).find('MPCollectionChart');

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
