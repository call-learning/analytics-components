import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import MPEnrolmentPerCollection from './index';
import README from './README.md';

import { grades as gradesData } from './../../tests/data/grades.data';

// See https://github.com/storybooks/storybook/issues/696#issuecomment-280368818
class LoadData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    fetch(this.props.url).then(response => response.json().then(data => this.setState({ data })));
  }

  render() {
    // eslint-disable-next-line react/prop-types
    return this.props.children(this.state.data);
  }
}

storiesOf('MPEnrolmentPerCollection', module)
  .addParameters({ info: { text: README } })
  .add('Basic', () => (
    <MPEnrolmentPerCollection
      grades={gradesData.grades}
      students={gradesData.students}
      collections={gradesData.collections}
      activities={gradesData.activities}
      cohorts={gradesData.cohorts}
      caption="Stacked Chart Chart"
    />
  ))
  .add('Preselected', () => (
    <MPEnrolmentPerCollection
      grades={gradesData.grades}
      students={gradesData.students}
      collections={gradesData.collections}
      activities={gradesData.activities}
      cohorts={gradesData.cohorts}
      selectedStudents={[152]}
      caption="Stacked Chart with one student preselected"
    />
  ))
  .add('Volume Data', () => (
    <LoadData url="/volumesamplegrades.json">
      {data => (data ?
          (<MPEnrolmentPerCollection
            grades={data.grades}
            students={data.students}
            collections={data.collections}
            activities={data.activities}
            cohorts={data.cohorts}
            caption="Stacked Chart with a lot of data"
          />) : (<p> Fetching Data ...</p>))
        }
    </LoadData>
  ));

