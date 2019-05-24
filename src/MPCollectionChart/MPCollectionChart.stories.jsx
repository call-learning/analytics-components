import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import MPCollectionChart from './index';
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

storiesOf('MPCollectionChart', module)
  .addParameters({ info: { text: README } })
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
  ))
  .add('Volume Data', () => (
    <LoadData url="/volumesamplegrades.json">
      {data => (data ?
          (<MPCollectionChart
            grades={data.grades}
            students={data.students}
            collections={data.collections}
            activities={data.activities}
            caption="Generation Chart with a lot of data"
          />) : (<p> Fetching Data ...</p>))
        }
    </LoadData>
  ));

