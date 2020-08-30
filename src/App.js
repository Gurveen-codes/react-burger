import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Logout/Logout';
import * as actionCreators from './store/actions/indexActions';

export class App extends Component {
	componentDidMount() {
		this.props.onAutomaticAuthCheck();
	}
	render() {
		return (
			<div>
				<Layout>
					<Switch>
						<Route path="/checkout" component={Checkout} />
						<Route path="/orders" component={Orders} />
						<Route path="/auth" component={Auth} />
						<Route path="/logout" component={Logout} />
						<Route path="/" component={BurgerBuilder} />
					</Switch>
				</Layout>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAutomaticAuthCheck: () => {
			dispatch(actionCreators.authCheckState());
		}
	};
};

export default withRouter(connect(null, mapDispatchToProps)(App));
