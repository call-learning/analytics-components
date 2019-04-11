/**
 * Hight order component so we can regroup checks for common properties
 * @param WrappedComponent
 * @param gradeData
 * @returns {{new(*=): {componentWillUnmount(): void, componentDidMount(): void, handleChange(): void, render(): *}, prototype: {componentWillUnmount(): void, componentDidMount(): void, handleChange(): void, render(): *}}}
 */

//https://reactjs.org/docs/higher-order-components.html

function withGradeData(WrappedComponent, gradeData) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.handleChange = this.handleChange.bind(this);
            this.state = {
                data: selectData(DataSource, props)
            };
        }

        componentDidMount() {
            // ... that takes care of the subscription...
            DataSource.addChangeListener(this.handleChange);
        }

        componentWillUnmount() {
            DataSource.removeChangeListener(this.handleChange);
        }

        handleChange() {
            this.setState({
                data: selectData(DataSource, this.props)
            });
        }

        render() {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            return <WrappedComponent data={this.state.data} {...this.props} />;
        }
    };
}
