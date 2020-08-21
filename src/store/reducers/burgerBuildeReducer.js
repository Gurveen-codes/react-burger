import * as actionTypes from '../actions/actionTypes';

const initialState = {
	ingredients: {
		bacon: 0,
		salad: 0,
		cheese: 0,
		meat: 0
	},
	totalPrice: 2
};

const INGREDIENTS_PRICES = {
	base_price: 2,
	bacon: 1,
	cheese: 0.5,
	salad: 0.5,
	meat: 1.5
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] + 1
				},
				totalPrice: state.totalPrice + INGREDIENTS_PRICES[action.ingredientName]
			};
		case actionTypes.REMOVE_INGREDIENT:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] - 1
				},
				totalPrice: state.totalPrice - INGREDIENTS_PRICES[action.ingredientName]
			};

		default:
			return state;
	}
};

export default reducer;
