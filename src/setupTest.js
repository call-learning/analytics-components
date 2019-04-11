import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

// Don't forget to add a babelrc in the project

// Polyfill Webpack's require.context function for our test environment, so we use the require-context-hook and
// don't fail on import keyword


// It is currently used in .storybook/config.js. See this for more info:
// https://www.npmjs.com/package/@storybook/addon-storyshots#configure-jest-to-work-with-webpacks-requirecontext
registerRequireContextHook();


Enzyme.configure({ adapter: new Adapter() });