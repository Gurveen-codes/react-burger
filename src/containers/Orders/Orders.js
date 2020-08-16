import React, { Component } from 'react';
import Order from './Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

export class Orders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			orders: []
		};
	}

	componentDidMount() {
		axios
			.get('/orders.json')
			.then((res) => {
				const fetchedOrders = [];

				for (let key in res.data) {
					fetchedOrders.push({ ...res.data[key], id: key });
				}

				this.setState({ loading: false, orders: fetchedOrders.reverse() });
			})
			.catch((err) => {
				this.setState({ loading: false });
				console.log(err);
			});
	}
	render() {
		return (
			<div>
				{this.state.orders.map((order) => (
					<Order key={order.id} ingredients={order.ingredients} totalPrice={order.totalPrice} />
				))}
			</div>
		);
	}
}

export default withErrorHandler(Orders, axios);
