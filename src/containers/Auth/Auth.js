import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actionCreators from '../../store/actions/indexActions';
import Spinner from '../../components/UI/Spinner/Spinner';
import { checkValidity } from '../../shared/utility';

const Auth = (props) => {
	const [ controls, setControls ] = useState({
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'E-mail Address'
			},
			value: '',
			validation: {
				required: true,
				isEmail: true
			},
			valid: false,
			touched: false
		},
		password: {
			elementType: 'input',
			elementConfig: {
				type: 'password',
				placeholder: 'Password'
			},
			value: '',
			validation: {
				required: true,
				minLength: 6
			},
			valid: false,
			touched: false
		}
	});

	const [ isSignUp, setIsSignUp ] = useState(true);

	const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

	////////////////////////////////////////////////////////

	useEffect(
		() => {
			if (!buildingBurger && authRedirectPath !== '/') {
				onSetAuthRedirectPath();
			}
		},
		[ buildingBurger, authRedirectPath, onSetAuthRedirectPath ]
	);

	///////////////////////////////////////////////////////////////

	const inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...controls,
			[controlName]: {
				...controls[controlName],
				value: event.target.value,
				valid: checkValidity(event.target.value, controls[controlName].validation),
				touched: true
			}
		};
		setControls(updatedControls);
	};

	///////////////////////////////////////////////////////////////
	const switchAuthModeHandler = (event) => {
		event.preventDefault();
		setIsSignUp(!isSignUp);
	};
	///////////////////////////////////////////////////////////////
	const signupHandler = (event) => {
		event.preventDefault();
		props.onAuth(controls.email.value, controls.password.value, isSignUp);
	};

	const formElementArray = [];
	for (let key in controls) {
		formElementArray.push({
			id: key,
			config: controls[key]
		});
	}
	let form = (
		<form onSubmit={signupHandler}>
			{formElementArray.map((formElement) => (
				<Input
					key={formElement.id}
					inputtype={formElement.config.elementType}
					elementConfig={formElement.config.elementConfig}
					value={formElement.config.value}
					invalid={!formElement.config.valid}
					shouldValidate={formElement.config.validation}
					touched={formElement.config.touched}
					changed={(event) => inputChangedHandler(event, formElement.id)}
				/>
			))}
			<Button btnType="Success">Submit</Button>
			<Button btnType="Danger" clicked={switchAuthModeHandler}>
				{isSignUp ? 'Sign up' : 'New User'}
			</Button>
		</form>
	);
	if (props.loading) {
		form = <Spinner />;
	}

	let errorMessage = null;

	if (props.error) {
		errorMessage = <p>{props.error.message}</p>;
	}

	let authRedirect = null;
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={authRedirectPath} />;
	}

	return (
		<div className={classes.AuthForm}>
			{authRedirect}
			{errorMessage}
			{form}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignUp) => dispatch(actionCreators.auth(email, password, isSignUp)),
		onSetAuthRedirectPath: () => dispatch(actionCreators.setAuthRedirectPath('/'))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
