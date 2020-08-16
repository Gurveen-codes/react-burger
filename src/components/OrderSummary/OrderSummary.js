import React from 'react';
import Auxillary from '../../hoc/Auxillary';
import Button from '../UI/Button/Button';

const OrderSummary = (props) => {
	const ingredientsSummary = Object.keys(props.ingredients).map((ingKey) => (
		<li key={ingKey}>
			<span style={{ textTransform: 'capitalize' }}>{ingKey}</span> : {props.ingredients[ingKey]}
		</li>
	));
	return (
		<Auxillary>
			<h3>Your Order</h3>
			<p>A delicious Burger with :</p>
			<ul>{ingredientsSummary}</ul>
			<p>
				<strong>Total price: ${props.totalPrice.toFixed(2)}</strong>
			</p>
			<p>Continue to checkout?</p>
			<div style={{ width: 'fit-content', margin: '0 auto' }}>
				<Button btnType="Danger" clicked={props.purchaseCancelled}>
					Cancel
				</Button>
				<Button btnType="Success" clicked={props.purchaseContinued}>
					Continue
				</Button>
			</div>
		</Auxillary>
	);
};

export default OrderSummary;
