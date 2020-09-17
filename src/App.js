import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Logout/Logout';
import * as actionCreators from './store/actions/indexActions';
import { lazyLoad } from './shared/utility';

const AsyncCheckout = React.lazy(() => import('./containers/Checkout/Checkout'));

const AsyncOrders = React.lazy(() => import('./containers/Orders/Orders'));

const AsyncAuth = React.lazy(() => import('./containers/Auth/Auth'));

const App = (props) => {
	useEffect(
		() => {
			props.onAutomaticAuthCheck();
		},
		[ props ]
	);

	let routes = (
		<Switch>
			<Route path="/auth" render={(props) => lazyLoad(props, AsyncAuth)} />
			<Route path="/" component={BurgerBuilder} />
			<Redirect to="/" />
		</Switch>
	);

	if (props.isAuthenticated) {
		routes = (
			<Switch>
				<Route path="/checkout" render={(props) => lazyLoad(props, AsyncCheckout)} />
				<Route path="/orders" render={(props) => lazyLoad(props, AsyncOrders)} />
				<Route path="/auth" render={(props) => lazyLoad(props, AsyncAuth)} />
				<Route path="/logout" component={Logout} />
				<Route path="/" component={BurgerBuilder} />
				<Redirect to="/" />
			</Switch>
		);
	}

	return (
		<div>
			<Layout>{routes}</Layout>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token != null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAutomaticAuthCheck: () => {
			dispatch(actionCreators.authCheckState());
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
