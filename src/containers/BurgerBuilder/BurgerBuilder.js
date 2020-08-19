import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import Auxillary from '../../hoc/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENTS_PRICES = {
	base_price: 2,
	bacon: 1,
	cheese: 0.5,
	salad: 0.5,
	meat: 1.5
};
export class BurgerBuilder extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// ingredients: null,
			totalPrice: INGREDIENTS_PRICES.base_price,
			purchasable: false,
			purchasing: false,
			loading: false,
			error: null
		};
	}

	componentDidMount() {
		// axios
		// 	.get('/ingredients.json')
		// 	.then((response) => {
		// 		this.setState({ ingredients: response.data });
		// 	})
		// 	.catch((error) => {
		// 		this.setState({ error: true });
		// 	});
	}

	updatePurchasable(ingredients) {
		const sum = Object.keys(ingredients) //[bacon,salad,cheese...]
			.map((ingKey) => ingredients[ingKey]) //[1,2,0....]
			.reduce((acc, current) => acc + current, 0);

		this.setState({ purchasable: sum > 0 });
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;

		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = updatedCount;

		const oldPrice = this.state.totalPrice;
		const updatedPrice = oldPrice + INGREDIENTS_PRICES[type];
		this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice });

		this.updatePurchasable(updatedIngredients);
	};

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) {
			return;
		}
		const updatedCount = oldCount - 1;

		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = updatedCount;

		const oldPrice = this.state.totalPrice;
		const updatedPrice = oldPrice - INGREDIENTS_PRICES[type];
		this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice });

		this.updatePurchasable(updatedIngredients);
	};

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		const queryParams = [];
		for (let i in this.props.ings) {
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]));
		}
		queryParams.push('totalPrice=' + this.state.totalPrice);
		const queryString = queryParams.join('&');

		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
	};

	render() {
		const disabledInfo = { ...this.props.ings };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		} //[bacon: true, salad: false .....]

		let modalContent = null;

		let burger = this.state.error ? <p>Ingredients can't load</p> : <Spinner />;

		if (this.props.ings) {
			burger = (
				<Auxillary>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						added={this.props.onIngredientAdded}
						removed={this.props.onIngredientRemoved}
						disabled={disabledInfo}
						price={this.state.totalPrice}
						purchasable={this.state.purchasable}
						purchased={this.purchaseHandler}
					/>
				</Auxillary>
			);

			modalContent = (
				<OrderSummary
					ingredients={this.props.ings}
					totalPrice={this.state.totalPrice}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinued={this.purchaseContinueHandler}
				/>
			);
		}
		if (this.state.loading) {
			modalContent = <Spinner />;
		}

		return (
			<Auxillary>
				<Modal show={this.state.purchasing} backdropClicked={this.purchaseCancelHandler}>
					{modalContent}
				</Modal>
				{burger}
			</Auxillary>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.ingredients
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) =>
			dispatch({
				type: actionTypes.ADD_INGREDIENT,
				ingredientName: ingName
			}),
		onIngredientRemoved: (ingName) =>
			dispatch({
				type: actionTypes.REMOVE_INGREDIENT,
				ingredientName: ingName
			})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
