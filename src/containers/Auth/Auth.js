import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actionCreators from '../../store/actions/indexActions';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/utility';

export class Auth extends Component {
	constructor(props) {
		super(props);

		this.state = {
			controls: {
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
			},
			isSignUp: true
		};
	}
	///////////////////////////////////////////////////////////////

	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			}
		};
		this.setState({ controls: updatedControls });
	};

	///////////////////////////////////////////////////////////////
	switchAuthModeHandler = (event) => {
		event.preventDefault();
		this.setState((prevState) => {
			return {
				isSignUp: !prevState.isSignUp
			};
		});
	};
	///////////////////////////////////////////////////////////////
	signupHandler = (event) => {
		event.preventDefault();
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
	};

	componentDidMount() {
		if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
			this.props.onSetAuthRedirectPath();
		}
	}

	render() {
		const formElementArray = [];
		for (let key in this.state.controls) {
			formElementArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}
		let form = (
			<form onSubmit={this.signupHandler}>
				{formElementArray.map((formElement) => (
					<Input
						key={formElement.id}
						inputtype={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						shouldValidate={formElement.config.validation}
						touched={formElement.config.touched}
						changed={(event) => this.inputChangedHandler(event, formElement.id)}
					/>
				))}
				<Button btnType="Success">Submit</Button>
				<Button btnType="Danger" clicked={this.switchAuthModeHandler}>
					{this.state.isSignUp ? 'Sign up' : 'New User'}
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}

		let errorMessage = null;

		if (this.props.error) {
			errorMessage = <p>{this.props.error.message}</p>;
		}

		let authRedirect = null;
		if (this.props.isAuthenticated) {
			authRedirect = <Redirect to={this.props.authRedirectPath} />;
		}

		return (
			<div className={classes.AuthForm}>
				{authRedirect}
				{errorMessage}
				{form}
			</div>
		);
	}
}

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
