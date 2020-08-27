import axios from 'axios';
import * as actionTypes from './actionTypes';

const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

const authSuccess = (tokenId, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		tokenId: tokenId,
		userId: userId
	};
};

const authFail = (err) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: err
	};
};

const authLogout = () => {
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

const checkAuthTimeout = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(authLogout());
		}, expirationTime);
	};
};

export const auth = (email, password, isSignUp) => {
	return (dispatch) => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		let url =
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBXskfSCjiVDNf8MJ7k45iifMsgAzc-0LA';
		if (!isSignUp) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBXskfSCjiVDNf8MJ7k45iifMsgAzc-0LA';
		}
		axios
			.post(url, authData)
			.then((response) => {
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn * 1000));
			})
			.catch((err) => {
				dispatch(authFail(err.response.data.error));
			});
	};
};
