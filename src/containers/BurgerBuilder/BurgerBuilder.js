import React, { Component } from 'react';
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

export class BurgerBuilder extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// ingredients: null,
			//totalPrice: INGREDIENTS_PRICES.base_price,
			//purchasable: false,
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

		return sum > 0;
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
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
						price={this.props.price}
						purchasable={this.updatePurchasable(this.props.ings)}
						purchased={this.purchaseHandler}
					/>
				</Auxillary>
			);

			modalContent = (
				<OrderSummary
					ingredients={this.props.ings}
					totalPrice={this.props.price}
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
		ings: state.ingredients,
		price: state.totalPrice
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) => dispatch(actionCreators.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(actionCreators.removeIngredient(ingName))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
