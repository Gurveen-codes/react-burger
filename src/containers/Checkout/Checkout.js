import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';

export class Checkout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ingredients: {},
			totalPrice: 0
		};
	}

	componentDidMount() {
		const query = new URLSearchParams(this.props.location.search);
		const ingredients = {};
		let totalPrice = 0;

		for (let param of query.entries()) {
			//param =['salad',1]
			if (param[0] === 'totalPrice') {
				totalPrice = param[1];
			} else {
				ingredients[param[0]] = +param[1];
			}
		}

		let newState = { ...this.state };
		newState.ingredients = ingredients;
		newState.totalPrice = totalPrice;
		this.setState(newState);
	}

	checkoutCancelled = () => {
		this.props.history.goBack();
	};

	checkoutContinued = () => {
		this.props.history.replace('/checkout/contact-data');
	};
	render() {
		return (
			<div>
				<CheckoutSummary
					ingredients={this.state.ingredients}
					checkoutCancelled={this.checkoutCancelled}
					checkoutContinued={this.checkoutContinued}
				/>
				<Route
					path={this.props.match.path + '/contact-data'}
					render={(props) => (
						<ContactData
							ingredients={this.state.ingredients}
							totalPrice={this.state.totalPrice}
							{...props}
						/>
					)}
				/>
			</div>
		);
	}
}

export default Checkout;
