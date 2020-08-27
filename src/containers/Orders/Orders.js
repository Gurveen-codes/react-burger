import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from './Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../store/actions/indexActions';
import Spinner from '../../components/UI/Spinner/Spinner';

export class Orders extends Component {
	componentDidMount() {
		this.props.onFetchOrders(this.props.tokenId);
	}
	render() {
		let orders = <Spinner />;
		if (!this.props.loading) {
			orders = this.props.orders.map((order) => (
				<Order key={order.id} ingredients={order.ingredients} totalPrice={order.totalPrice} />
			));
		}

		return <div>{orders}</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		tokenId: state.auth.token
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchOrders: (tokenId) => dispatch(actionCreators.fetchOrders(tokenId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
