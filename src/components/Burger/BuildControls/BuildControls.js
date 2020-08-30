import React from 'react';
import BuildControl from './BuildControl/BuildControl';
import classes from './BuildControls.module.css';

const BuildControls = (props) => {
	const controls = [
		{ label: 'Bacon', type: 'bacon' },
		{ label: 'Salad', type: 'salad' },
		{ label: 'Cheese', type: 'cheese' },
		{ label: 'Meat', type: 'meat' }
	];

	return (
		<div className={classes.BuildControls}>
			<div>
				<strong>Current Price: ${props.price.toFixed(2)}</strong>
			</div>
			{controls.map((ctrl) => (
				<BuildControl
					key={ctrl.label}
					label={ctrl.label}
					added={() => props.added(ctrl.type)}
					removed={() => props.removed(ctrl.type)}
					disabled={props.disabled[ctrl.type]}
				/>
			))}
			<button className={classes.OrderButton} disabled={!props.purchasable} onClick={props.purchased}>
				{props.isAuth ? 'Order Now' : 'Sign Up to Order'}
			</button>
		</div>
	);
};

export default BuildControls;
