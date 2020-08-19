import * as actionTypes from './actions';

const initialState = {
	ingredients: null,
	totalPrice: 2
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT:
			return { ...state };

		default:
			return state;
	}
};

export default reducer;
