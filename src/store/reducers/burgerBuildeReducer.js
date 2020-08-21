import * as actionTypes from '../actions/actionTypes';

const initialState = {
	ingredients: null,
	totalPrice: 2,
	error: false
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
		case actionTypes.SET_INGREDIENTS:
			return {
				...state,
				ingredients: action.ingredients,
				error: false
			};
		case actionTypes.FETCH_INGREDIENTS_FAILED:
			return {
				...state,
				error: true
			};
		default:
			return state;
	}
};

export default reducer;
