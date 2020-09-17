import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../../store/actions/indexActions';
import { checkValidity } from '../../../shared/utility';

const ContactData = (props) => {
	const [ orderForm, setorderForm ] = useState({
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
				required: true,
				isEmail: true
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
				maxLength: 6,
				isNumeric: true
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
	});

	const [ formIsValid, setFormIsValid ] = useState(false);

	/////////////////////////////////////////////////////////////////////
	const orderHandler = (event) => {
		event.preventDefault();
		const formData = {};
		for (let formElementIndentifier in orderForm) {
			formData[formElementIndentifier] = orderForm[formElementIndentifier].value;
		}
		const currentOrder = {
			ingredients: props.ings,
			totalPrice: props.price,
			orderData: formData,
			userId: props.userId
		};

		props.onOrderBurger(currentOrder, props.tokenId);
	};

	///////////////////////////////////////////////////////////////

	const inputChangedHandler = (event, inputIdentifier) => {
		const updatedForm = { ...orderForm };
		const updatedFormElement = {
			...updatedForm[inputIdentifier]
		};

		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;
		for (let inputIdentifier in updatedForm) {
			formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
		}

		setorderForm(updatedForm);
		setFormIsValid(formIsValid);
	};
	////////////////////////////////////////////////////////

	const formElementArray = [];
	for (let key in orderForm) {
		formElementArray.push({
			id: key,
			config: orderForm[key]
		});
	}
	let form = (
		<form onSubmit={orderHandler}>
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
			<Button btnType="Success" disabled={!formIsValid}>
				Order
			</Button>
		</form>
	);

	if (props.loading) {
		form = <Spinner />;
	}

	return (
		<div className={classes.ContactForm}>
			<h4>Enter your Contact data</h4>
			{form}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		tokenId: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, tokenId) => {
			dispatch(actionCreators.purchaseBurger(orderData, tokenId));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
