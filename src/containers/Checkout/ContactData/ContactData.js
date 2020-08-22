import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../../store/actions/indexActions';

export class ContactData extends Component {
	constructor(props) {
		super(props);

		this.state = {
			orderForm: {
				name: {
					elementType: 'input',
					elementConfig: {
						type: 'text',
						placeholder: 'Your Name'
					},
					value: '',
					validation: {
						required: true
					},
					valid: false,
					touched: false
				},
				email: {
					elementType: 'input',
					elementConfig: {
						type: 'email',
						placeholder: 'Your E-Mail'
					},
					value: '',
					validation: {
						required: true
					},
					valid: false,
					touched: false
				},
				street: {
					elementType: 'input',
					elementConfig: {
						type: 'text',
						placeholder: 'Street Address'
					},
					value: '',
					validation: {
						required: true
					},
					valid: false,
					touched: false
				},
				postalCode: {
					elementType: 'input',
					elementConfig: {
						type: 'text',
						placeholder: 'Postal Code'
					},
					value: '',
					validation: {
						required: true,
						minLength: 6,
						maxLength: 6
					},
					valid: false,
					touched: false
				},
				deliveryMethod: {
					elementType: 'select',
					elementConfig: {
						options: [
							{ value: 'fastest', displayValue: 'Fastest' },
							{ value: 'cheapest', displayValue: 'Cheapest' }
						]
					},
					value: 'fastest',
					validation: {},
					valid: true
				}
			},
			formIsValid: false
		};
	}
	/////////////////////////////////////////////////////////////////////
	orderHandler = (event) => {
		event.preventDefault();
		const formData = {};
		for (let formElementIndentifier in this.state.orderForm) {
			formData[formElementIndentifier] = this.state.orderForm[formElementIndentifier].value;
		}
		const currentOrder = {
			ingredients: this.props.ings,
			totalPrice: this.props.price,
			orderData: formData
		};

		this.props.onOrderBurger(currentOrder);
	};

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

		return isValid;
	};
	//////////////////////////////////////////////////////////////////////////////
	inputChangedHandler = (event, inputIdentifier) => {
		const updatedForm = { ...this.state.orderForm };
		const updatedFormElement = {
			...updatedForm[inputIdentifier]
		};

		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;
		for (let inputIdentifier in updatedForm) {
			formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
		}

		this.setState({ orderForm: updatedForm, formIsValid: formIsValid });
	};
	////////////////////////////////////////////////////////

	render() {
		const formElementArray = [];
		for (let key in this.state.orderForm) {
			formElementArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}
		let form = (
			<form onSubmit={this.orderHandler}>
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
				<Button btnType="Success" disabled={!this.state.formIsValid}>
					Order
				</Button>
			</form>
		);

		if (this.state.loading) {
			form = <Spinner />;
		}

		return (
			<div className={classes.ContactForm}>
				<h4>Enter your Contact data</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	};
};

const mapDispatchToProps = (dispatch) => {
	const onOrderBurger = (orderData) => {
		dispatch(actionCreators.purchaseBurgerStart(orderData));
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
