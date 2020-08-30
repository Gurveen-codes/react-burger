import * as actionTypes from '../actions/actionTypes';

const intialState = {
	error: null,
	loading: false,
	token: null,
	userId: null,
	authRedirectPath: '/'
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

const authLogout = (state) => {
	return {
		...state,
		token: null,
		userId: null
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
		case actionTypes.AUTH_LOGOUT:
			return authLogout(state);
		case actionTypes.SET_AUTH_REDIRECT_PATH:
			return {
				...state,
				authRedirectPath: action.path
			};
		default:
			return state;
	}
};

export default authReducer;
