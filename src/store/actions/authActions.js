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

export const authLogout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('expirationDate');
	localStorage.removeItem('userId');

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
				const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);

				localStorage.setItem('token', response.data.idToken);
				localStorage.setItem('expirationDate', expirationDate);
				localStorage.setItem('userId', response.data.localId);

				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn * 1000));
			})
			.catch((err) => {
				dispatch(authFail(err.response.data.error));
			});
	};
};

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	};
};

export const authCheckState = () => {
	return (dispatch) => {
		const token = localStorage.getItem('token');
		const expirationDate = localStorage.getItem('expirationDate');
		const userId = localStorage.getItem('userId');
		if (!token) {
			//If there is no token
			dispatch(authLogout());
		} else {
			if (new Date(expirationDate) > new Date()) {
				//Token but valid Expiration Date
				dispatch(authSuccess(token, userId));
				const expTime = new Date(expirationDate).getTime() - new Date().getTime();
				console.log(expTime);

				dispatch(checkAuthTimeout(expTime));
			} else {
				dispatch(authLogout());
			}
		}
	};
};
