import React from 'react';
import { addParameters, addDecorator, configure } from '@storybook/react';
import { setConsoleOptions } from '@storybook/addon-console';
import { withInfo } from '@storybook/addon-info'
import { SyntaxHighlighter } from '@storybook/components';

// Style applied to all stories
import "./style.scss";


setConsoleOptions({
  panelExclude: ['warn', 'error'],
});

// Option defaults:
addParameters({
  options: {
    brandTitle: 'Analytics Components',
    brandUrl: 'https://github.com/call-learning/analytics-components',
    showPanel: true,
  },
  info: {
    inline: true,
    header: false,
    source: true,
    components: {
      code: function({language, code}) {
        return (
            <SyntaxHighlighter language="jsx" format={false} copyable={false}>{code}</SyntaxHighlighter>
        );
      },
    }
  },
});



addDecorator(storyFn => <div className="p-5 mt-3">{storyFn()}</div>);
addDecorator(withInfo);

// automatically import all files ending in *.stories.jsx
const req = require.context('../src', true, /\.stories\.jsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
