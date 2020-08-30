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
			purchasing: false
		};
	}

	componentDidMount() {
		this.props.onInitIngredients();
	}

	updatePurchasable(ingredients) {
		const sum = Object.keys(ingredients) //[bacon,salad,cheese...]
			.map((ingKey) => ingredients[ingKey]) //[1,2,0....]
			.reduce((acc, current) => acc + current, 0);

		return sum > 0;
	}

	purchaseHandler = () => {
		if (this.props.isAuthenticated) {
			this.setState({ purchasing: true });
		} else {
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		this.props.onInitpurchase();
		this.props.history.push('/checkout');
	};

	render() {
		const disabledInfo = { ...this.props.ings };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		} //[bacon: true, salad: false .....]

		let modalContent = null;

		let burger = this.props.error ? <p>Ingredients can't load</p> : <Spinner />;

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
						isAuth={this.props.isAuthenticated}
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
