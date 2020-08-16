import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const Burger = (props) => {
	let transformedIngredients = Object.keys(props.ingredients) //[salad,meat,cheese]
		.map((ingKey) => {
			return [ ...Array(props.ingredients[ingKey]) ].map((_, i) => {
				return <BurgerIngredient key={ingKey + i} type={ingKey} />;
			});
		})
		.reduce((acc, current) => {
			return acc.concat(current);
		}, []);

	//console.log(transformedIngredients);

	if (transformedIngredients.length === 0) {
		transformedIngredients = <div>Please start adding ingredients</div>;
	}

	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top" />
			{transformedIngredients}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};

export default Burger;
