import React, { Component } from 'react';
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
			ingredients: null,
			totalPrice: INGREDIENTS_PRICES.base_price,
			purchasable: false,
			purchasing: false,
			loading: false,
			error: null
		};
	}

	componentDidMount() {
		axios
			.get('/ingredients.json')
			.then((response) => {
				this.setState({ ingredients: response.data });
			})
			.catch((error) => {
				this.setState({ error: true });
			});
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
		for (let i in this.state.ingredients) {
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
		}
		queryParams.push('totalPrice=' + this.state.totalPrice);
		const queryString = queryParams.join('&');

		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
	};

	render() {
		const disabledInfo = { ...this.state.ingredients };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		} //[bacon: true, salad: false .....]

		let modalContent = null;

		let burger = this.state.error ? <p>Ingredients can't load</p> : <Spinner />;

		if (this.state.ingredients) {
			burger = (
				<Auxillary>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						added={this.addIngredientHandler}
						removed={this.removeIngredientHandler}
						disabled={disabledInfo}
						price={this.state.totalPrice}
						purchasable={this.state.purchasable}
						purchased={this.purchaseHandler}
					/>
				</Auxillary>
			);

			modalContent = (
				<OrderSummary
					ingredients={this.state.ingredients}
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

export default withErrorHandler(BurgerBuilder, axios);
