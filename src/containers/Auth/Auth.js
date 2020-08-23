import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actionCreators from '../../store/actions/indexActions';

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
	checkValidity = (value, rules) => {
		let isValid = true;

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}
		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}
		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}
		if (rules.isEmail) {
			const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			isValid = pattern.test(value) && isValid;
		}
		if (rules.isNumeric) {
			const pattern = /^\d*$/;
			isValid = pattern.test(value) && isValid;
		}

		return isValid;
	};
	///////////////////////////////////////////////////////////////////////////
	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
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
		return <div className={classes.AuthForm}>{form}</div>;
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignUp) => dispatch(actionCreators.auth(email, password, isSignUp))
	};
};

export default connect(null, mapDispatchToProps)(Auth);
