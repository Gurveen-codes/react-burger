import React from 'react';
import classes from './Order.module.css';

const Order = (props) => {
	const ingredients = [];

	for (let ingredientName in props.ingredients) {
		ingredients.push({ name: ingredientName, amount: props.ingredients[ingredientName] });
	}

	const ingredientOutput = ingredients.map((ing) => {
		return (
			<span
				key={ing.name}
				style={{
					textTransform: 'capitalize',
					display: 'inline-block',
					margin: '0 8px',
					border: '1px solid #ccc',
					boxShadow: '0 1px 2px #eee',
					padding: '5px'
				}}
			>
				{ing.name} ({ing.amount})
			</span>
		);
	});
	return (
		<div className={classes.Order}>
			<p>Ingredients: {ingredientOutput}</p>
			<p>
				Price: <strong>${props.totalPrice}</strong>
			</p>
		</div>
	);
};

export default Order;
