import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderdata: orderData
	};
};

const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		error: error
	};
};

const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	};
};

export const purchaseBurger = (orderData, tokenId) => {
	return (dispatch) => {
		dispatch(purchaseBurgerStart());
		axios
			.post('/orders.json?' + tokenId, orderData)
			.then((response) => {
				dispatch(purchaseBurgerSuccess(response.data.name, orderData));
			})
			.catch((err) => dispatch(purchaseBurgerFail(err)));
	};
};

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	};
};

const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders
	};
};
const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAIL,
		error: error
	};
};
export const fetchOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START
	};
};

export const fetchOrders = (tokenId) => {
	return (dispatch) => {
		dispatch(fetchOrdersStart());

		axios
			.get('/orders.json?auth=' + tokenId)
			.then((res) => {
				const fetchedOrders = [];

				for (let key in res.data) {
					fetchedOrders.push({ ...res.data[key], id: key });
				}

				dispatch(fetchOrdersSuccess(fetchedOrders.reverse()));
			})
			.catch((err) => {
				dispatch(fetchOrdersFail(err));
			});
	};
};
