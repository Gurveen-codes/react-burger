import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Order from './Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../store/actions/indexActions';
import Spinner from '../../components/UI/Spinner/Spinner';

const Orders = (props) => {
	const { loading, tokenId, userId, onFetchOrders } = props;
	useEffect(
		() => {
			onFetchOrders(tokenId, userId);
		},
		[ tokenId, userId, onFetchOrders ]
	);

	let orders = <Spinner />;
	if (!loading) {
		orders = props.orders.map((order) => (
			<Order key={order.id} ingredients={order.ingredients} totalPrice={order.totalPrice} />
		));
	}

	return <div>{orders}</div>;
};

const mapStateToProps = (state) => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		tokenId: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchOrders: (tokenId, userId) => dispatch(actionCreators.fetchOrders(tokenId, userId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
