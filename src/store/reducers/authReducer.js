import * as actionTypes from '../actions/actionTypes';

const intialState = {
	error: null,
	loading: false,
	token: null,
	userId: null
};

const authSuccess = (state, action) => {
	return {
		...state,
		loading: false,
		error: null,
		token: action.tokenId,
		userId: action.userId
	};
};

const authReducer = (state = intialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
			return {
				...state,
				error: null,
				loading: true
			};
		case actionTypes.AUTH_FAIL:
			return {
				...state,
				loading: false,
				error: action.error
			};
		case actionTypes.AUTH_SUCCESS:
			return authSuccess(state, action);
		default:
			return state;
	}
};

export default authReducer;
