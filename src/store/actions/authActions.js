import * as actionTypes from './actionTypes';

const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

const authSuccess = (authData) => {
	return {
		type: actionTypes.AUTH_START,
		authdata: authData
	};
};

const authFail = (err) => {
	return {
		type: actionTypes.AUTH_START,
		error: err
	};
};

export const auth = (email, password) => {
	return (dispatch) => {
		dispatch(authStart());
		//.................///
	};
};
