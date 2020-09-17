import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../../store/actions/indexActions';
import Auxillary from '../../hoc/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const BurgerBuilder = (props) => {
	const { onInitIngredients } = props;

	const [ purchasing, setPurchasing ] = useState(false);

	useEffect(
		() => {
			onInitIngredients();
		},
		[ onInitIngredients ]
	);
	//////////////////////////////////////
	const updatePurchasable = (ingredients) => {
		const sum = Object.keys(ingredients) //[bacon,salad,cheese...]
			.map((ingKey) => ingredients[ingKey]) //[1,2,0....]
			.reduce((acc, current) => acc + current, 0);

		return sum > 0;
	};
	//////////////////////////////////////

	const purchaseHandler = () => {
		if (props.isAuthenticated) {
			setPurchasing(true);
		} else {
			props.onSetAuthRedirectPath('/checkout');
			props.history.push('/auth');
		}
	};
	//////////////////////////////////////

	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};
	//////////////////////////////////////

	const purchaseContinueHandler = () => {
		props.onInitpurchase();
		props.history.push('/checkout');
	};
	//////////////////////////////////////

	const disabledInfo = { ...props.ings };
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	} //[bacon: true, salad: false .....]

	let modalContent = null;

	let burger = props.error ? <p>Ingredients can't load</p> : <Spinner />;

	if (props.ings) {
		burger = (
			<Auxillary>
				<Burger ingredients={props.ings} />
				<BuildControls
					added={props.onIngredientAdded}
					removed={props.onIngredientRemoved}
					disabled={disabledInfo}
					price={props.price}
					purchasable={updatePurchasable(props.ings)}
					purchased={purchaseHandler}
					isAuth={props.isAuthenticated}
				/>
			</Auxillary>
		);

		modalContent = (
			<OrderSummary
				ingredients={props.ings}
				totalPrice={props.price}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
			/>
		);
	}

	return (
		<Auxillary>
			<Modal show={purchasing} backdropClicked={purchaseCancelHandler}>
				{modalContent}
			</Modal>
			{burger}
		</Auxillary>
	);
};
//////////////////////////////////////

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) => dispatch(actionCreators.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(actionCreators.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actionCreators.initIngredients()),
		onInitpurchase: () => dispatch(actionCreators.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
